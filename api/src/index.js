import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Client } from '@elastic/elasticsearch';
import { Ingredient } from './models/ingredient.js';
import { Recipe } from './models/recipe.js';
import { registerChatRoute } from './chatRoute.js';

const app = express();
app.use(cors());
app.use(express.json());

// ---- Config desde entorno con fallback ----
// En Docker: usa nombres de servicios (mongo, es)
// En local: usa localhost
const MONGO_URL = process.env.MONGO_URL
  || 'mongodb://localhost:27017/appdb?replicaSet=rs0';
const ELASTIC_URL = process.env.ELASTIC_URL || 'http://localhost:9200';

console.log('🔌 MONGO_URL:', MONGO_URL);
console.log('🔌 ELASTIC_URL:', ELASTIC_URL);

// ---- Conexión Mongo con logs y timeout razonable ----
const connectMongo = async (retries = 10) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URL, {
        serverSelectionTimeoutMS: 10000, // 10s para dar tiempo en Docker
      });
      console.log('✅ Mongo conectado:', MONGO_URL);
      return;
    } catch (err) {
      console.error(`❌ Error conectando a Mongo (intento ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        console.log('Reintentando en 5 segundos...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('❌ No se pudo conectar a Mongo después de', retries, 'intentos');
        process.exit(1);
      }
    }
  }
};

await connectMongo();

// ---- Cliente Elasticsearch ----
const es = new Client({ node: ELASTIC_URL });

// Verificar conexión a Elasticsearch
try {
  const info = await es.info();
  console.log('✅ Elasticsearch conectado:', info.cluster_name, info.version.number);
} catch (err) {
  console.error('⚠️  Error conectando a Elasticsearch:', err.message);
  console.error('La búsqueda puede no funcionar, pero la API seguirá corriendo.');
}

// ---- Utilidades de dominio ----
const slugify = (value) => value
  ?.toString()
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || `recipe-${Date.now()}`;

const normalizeDifficulty = (value) => {
  if (!value) return undefined;
  const normalized = value.toString().toLowerCase();
  return ['easy', 'medium', 'hard'].includes(normalized) ? normalized : undefined;
};

const parsePositiveInt = (value, fallback = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
};

const clampSize = (value, fallback = 10, max = 100) => {
  const parsed = parsePositiveInt(value, fallback) || fallback;
  return Math.max(1, Math.min(parsed, max));
};

const ensureUniqueSlug = async (rawValue, currentId) => {
  const base = slugify(rawValue);
  let candidate = base;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Recipe.exists({ slug: candidate, ...(currentId ? { _id: { $ne: currentId } } : {}) })) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
};

const resolveIngredientRefs = async (ingredientsInput = []) => {
  if (!Array.isArray(ingredientsInput) || !ingredientsInput.length) {
    return [];
  }

  const ids = [];
  const names = [];

  for (const item of ingredientsInput) {
    if (!item) continue;
    if (item.ingredientId) {
      ids.push(item.ingredientId.toString());
    } else if (item.name) {
      names.push(item.name.trim());
    }
  }

  const [byIdDocs, byNameDocs] = await Promise.all([
    ids.length ? Ingredient.find({ _id: { $in: ids } }) : Promise.resolve([]),
    names.length ? Ingredient.find({ name: { $in: names } }) : Promise.resolve([])
  ]);

  const byId = new Map(byIdDocs.map(doc => [doc._id.toString(), doc]));
  const byName = new Map(byNameDocs.map(doc => [doc.name.toLowerCase(), doc]));

  return ingredientsInput.map(item => {
    if (!item) {
      throw new Error('Ingrediente mal formado en la lista');
    }
    const idKey = item.ingredientId ? item.ingredientId.toString() : undefined;
    const nameKey = item.name ? item.name.trim().toLowerCase() : undefined;
    const ingredientDoc = (idKey && byId.get(idKey)) || (nameKey && byName.get(nameKey));
    if (!ingredientDoc) {
      throw new Error(`Ingrediente no encontrado: ${item.name || item.ingredientId}`);
    }
    return {
      ingredientId: ingredientDoc._id,
      name: ingredientDoc.name,
      quantity: item.quantity ?? null,
      unit: item.unit ?? null,
      optional: Boolean(item.optional),
      notes: item.notes ?? ''
    };
  });
};

// ---- Healthcheck útil ----
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().command({ ping: 1 });
    const info = await es.info();
    const [recipesCount, ingredientsCount] = await Promise.all([
      Recipe.estimatedDocumentCount().catch(() => 0),
      Ingredient.estimatedDocumentCount().catch(() => 0)
    ]);
    res.json({
      ok: true,
      mongo: 'ok',
      elastic: {
        name: info.name,
        cluster: info.cluster_name,
        version: info.version.number
      },
      stats: {
        recipes: recipesCount,
        ingredients: ingredientsCount
      }
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ---- Ingredientes ----
app.get('/ingredients', async (req, res) => {
  try {
    const { q, category, limit = 50 } = req.query;
    const filter = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { category: regex }
      ];
    }
    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    const items = await Ingredient.find(filter)
      .sort({ name: 1 })
      .limit(Math.min(parsePositiveInt(limit, 50) || 50, 200))
      .lean();

    res.json(items);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/ingredients/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Identificador inválido' });
    }
    const ingredient = await Ingredient.findById(req.params.id).lean();
    if (!ingredient) return res.status(404).json({ error: 'Ingrediente no encontrado' });
    res.json(ingredient);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/ingredients', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.name) payload.name = payload.name.trim();
    const ingredient = await Ingredient.create(payload);
    res.status(201).json(ingredient);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: 'Ya existe un ingrediente con ese nombre' });
    }
    res.status(400).json({ error: e.message });
  }
});

app.patch('/ingredients/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Identificador inválido' });
    }
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ingredient) return res.status(404).json({ error: 'Ingrediente no encontrado' });
    res.json(ingredient);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/ingredients/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Identificador inválido' });
    }
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ error: 'Ingrediente no encontrado' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ---- Recetas ----
app.get('/recipes', async (req, res) => {
  try {
    const {
      q,
      cuisine,
      difficulty,
      tags,
      ingredient,
      maxTime,
      from = 0,
      size = 10
    } = req.query;

    const filter = {};
    const andConditions = [];

    if (q) {
      filter.$text = { $search: q };
    }

    if (cuisine) {
      filter.cuisine = new RegExp(`^${cuisine}$`, 'i');
    }

    const normalizedDifficulty = normalizeDifficulty(difficulty);
    if (normalizedDifficulty) {
      filter.difficulty = normalizedDifficulty;
    }

    const tagList = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);
    if (tagList.length) {
      filter.tags = { $all: tagList };
    }

    const ingredientTerms = Array.isArray(ingredient)
      ? ingredient
      : (typeof ingredient === 'string' ? ingredient.split(',').map(t => t.trim()).filter(Boolean) : []);
    if (ingredientTerms.length) {
      ingredientTerms.forEach(term => {
        andConditions.push({ 'ingredients.name': new RegExp(term, 'i') });
      });
    }

    if (maxTime) {
      const parsed = Number(maxTime);
      if (Number.isFinite(parsed)) {
        filter.totalTimeMinutes = { $lte: parsed };
      }
    }

    if (andConditions.length) {
      filter.$and = andConditions;
    }

    const skip = parsePositiveInt(from, 0);
    const limit = clampSize(size, 10, 100);

    const [results, total] = await Promise.all([
      Recipe.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Recipe.countDocuments(filter)
    ]);

    res.json({
      total,
      from: skip,
      size: limit,
      results
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/recipes/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };
    const recipe = await Recipe.findOne(query).lean();
    if (!recipe) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json(recipe);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/recipes', async (req, res) => {
  try {
    const {
      title,
      ingredients: ingredientsInput = [],
      slug: slugCandidate,
      difficulty,
      ...rest
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El campo title es obligatorio' });
    }

    const resolvedIngredients = await resolveIngredientRefs(ingredientsInput);
    const normalizedDifficulty = normalizeDifficulty(difficulty) ?? 'medium';
    const slug = await ensureUniqueSlug(slugCandidate || title, null);

    const recipe = await Recipe.create({
      ...rest,
      title,
      slug,
      difficulty: normalizedDifficulty,
      ingredients: resolvedIngredients
    });

    // Index in Elasticsearch
    try {
      const plainDoc = recipe.toObject();
      const id = plainDoc._id.toString();
      delete plainDoc._id;
      delete plainDoc.__v;

      await es.index({
        index: 'recipes',
        id,
        document: plainDoc,
        refresh: 'wait_for' // Wait for search availability
      });
    } catch (esErr) {
      console.error('⚠️ Error indexing new recipe:', esErr.message);
      // We don't fail the request, just log the error
    }

    res.status(201).json(recipe);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.patch('/recipes/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const baseQuery = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const existing = await Recipe.findOne(baseQuery);
    if (!existing) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const update = { ...req.body };

    if (update.difficulty) {
      const normalized = normalizeDifficulty(update.difficulty);
      if (!normalized) {
        return res.status(400).json({ error: 'Valor de difficulty inválido' });
      }
      update.difficulty = normalized;
    }

    if (update.slug || update.title) {
      const slugCandidate = update.slug || update.title;
      update.slug = await ensureUniqueSlug(slugCandidate, existing._id);
    }

    if (Array.isArray(update.ingredients)) {
      update.ingredients = await resolveIngredientRefs(update.ingredients);
    }

    const recipe = await Recipe.findByIdAndUpdate(
      existing._id,
      update,
      { new: true, runValidators: true }
    );

    // Update in Elasticsearch
    try {
      const plainDoc = recipe.toObject();
      const id = plainDoc._id.toString();
      delete plainDoc._id;
      delete plainDoc.__v;

      await es.index({
        index: 'recipes',
        id,
        document: plainDoc,
        refresh: 'wait_for'
      });
    } catch (esErr) {
      console.error('⚠️ Error updating recipe in ES:', esErr.message);
    }

    res.json(recipe);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/recipes/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const baseQuery = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const recipe = await Recipe.findOneAndDelete(baseQuery);
    if (!recipe) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    // Delete from Elasticsearch
    try {
      await es.delete({
        index: 'recipes',
        id: recipe._id.toString(),
        refresh: 'wait_for'
      });
    } catch (esErr) {
      // Ignore 404 from ES (already deleted or never existed)
      if (esErr.meta && esErr.meta.statusCode !== 404) {
        console.error('⚠️ Error deleting recipe from ES:', esErr.message);
      }
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ---- Búsqueda en Elasticsearch ----
app.get(['/search/recipes', '/search'], async (req, res) => {
  try {
    const {
      q,
      cuisine,
      difficulty,
      tags,
      ingredients,
      maxTime,
      from = 0,
      size = 10,
      refresh
    } = req.query;

    import('fs').then(fs => {
      fs.appendFileSync('debug_req.log', `Params: ${JSON.stringify({ q, ingredients, cuisine })}\n`);
    });

    console.log('🔍 Search Params:', { q, ingredients, cuisine });

    // Si se solicita refresh explícitamente o después de operaciones recientes
    if (refresh === 'true') {
      try {
        await es.indices.refresh({ index: 'recipes' });
      } catch (refreshErr) {
        console.warn('Refresh warning:', refreshErr.message);
      }
    }

    const must = [];
    const filter = [];

    if (q) {
      must.push({
        multi_match: {
          query: q,
          type: 'bool_prefix',
          fields: [
            'title',
            'title._2gram',
            'title._3gram',
            'description',
            'description._2gram',
            'description._3gram',
            'ingredients.name',
            'ingredients.name._2gram',
            'ingredients.name._3gram'
          ]
        }
      });
    }

    const cuisineTerm = Array.isArray(cuisine) ? cuisine[0] : cuisine;
    if (cuisineTerm) {
      filter.push({ term: { 'cuisine.keyword': cuisineTerm } });
    }

    const normalizedDifficulty = normalizeDifficulty(difficulty);
    if (normalizedDifficulty) {
      filter.push({ term: { 'difficulty.keyword': normalizedDifficulty } });
    } else if (difficulty) {
      // Support multiple difficulty values separated by comma
      const difficultyList = Array.isArray(difficulty)
        ? difficulty.flatMap(d => d.split(',').map(str => str.trim()))
        : (typeof difficulty === 'string' ? difficulty.split(',').map(str => str.trim()) : []);
      const validDifficulties = difficultyList
        .map(d => normalizeDifficulty(d))
        .filter(Boolean);
      if (validDifficulties.length > 0) {
        filter.push({ terms: { 'difficulty.keyword': validDifficulties } });
      }
    }

    const tagList = Array.isArray(tags)
      ? tags.flatMap(t => t.split(',').map(str => str.trim()))
      : (typeof tags === 'string' ? tags.split(',').map(str => str.trim()) : []);
    if (tagList.length) {
      filter.push({ terms: { 'tags.keyword': tagList.filter(Boolean) } });
    }

    const ingredientList = Array.isArray(ingredients)
      ? ingredients.flatMap(t => t.split(',').map(str => str.trim()))
      : (typeof ingredients === 'string' ? ingredients.split(',').map(str => str.trim()) : []);

    if (ingredientList.length) {
      // Use nested query for ingredients
      const ingredientQueries = ingredientList
        .filter(Boolean)
        .map(term => ({
          match: {
            'ingredients.name': {
              query: term
              // Removed fuzziness: 'AUTO' as it can cause issues with search_as_you_type fields
              // and exact matching is usually preferred for filters.
            }
          }
        }));

      if (ingredientQueries.length > 0) {
        must.push({
          nested: {
            path: 'ingredients',
            query: {
              bool: {
                should: ingredientQueries,
                minimum_should_match: 1
              }
            }
          }
        });
      }
    }

    if (maxTime) {
      const parsed = Number(maxTime);
      if (Number.isFinite(parsed)) {
        filter.push({ range: { totalTimeMinutes: { lte: parsed } } });
      }
    }

    const fromNumber = Math.max(0, parseInt(from, 10) || 0);
    const sizeNumber = Math.min(Math.max(1, parseInt(size, 10) || 10), 100);

    const searchPayload = {
      index: 'recipes',
      from: fromNumber,
      size: sizeNumber,
      query: {
        bool: {
          must: must.length ? must : [{ match_all: {} }],
          filter
        }
      },
      // Add aggregations for dynamic filtering
      aggs: {
        all_ingredients: {
          nested: {
            path: 'ingredients'
          },
          aggs: {
            ids: {
              terms: {
                field: 'ingredients.ingredientId', // Use ingredientId (keyword)
                size: 100
              }
            }
          }
        }
      }
    };

    if (q) {
      searchPayload.highlight = {
        fields: {
          title: {},
          description: {},
          'ingredients.name': {}
        }
      };
    }

    console.log('🔍 ES Query:', JSON.stringify(searchPayload, null, 2));
    const r = await es.search(searchPayload);

    res.json({
      hits: r.hits.hits,
      total: r.hits.total,
      aggregations: r.aggregations
    });
  } catch (e) {
    console.error('Search error:', e);
    res.status(400).json({ ok: false, error: e.message });
  }
});

registerChatRoute(app);

app.listen(3000, () => console.log('🚀 API de recetas en http://localhost:3000'));
