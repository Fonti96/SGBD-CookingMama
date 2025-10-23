import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Client } from '@elastic/elasticsearch';

const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/appdb'); // en Docker host -> usa 'localhost'

const es = new Client({ node: 'http://localhost:9200' });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  price: Number,
  tags: [String],
  description: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

// CRUD (Mongo como fuente de verdad)
app.post('/products', async (req, res) => {
  const p = await Product.create(req.body);
  res.json(p);
});

app.get('/products/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.patch('/products/:id', async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Búsqueda (contra Elasticsearch)
app.get('/search', async (req, res) => {
  const { q, brand, minPrice, maxPrice, from = 0, size = 10 } = req.query;

  const must = [];
  if (q) {
    must.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'description', 'tags'],
        fuzziness: 'AUTO'
      }
    });
  }
  const filter = [];
  if (brand) filter.push({ term: { brand: brand } });
  if (minPrice) filter.push({ range: { price: { gte: Number(minPrice) } } });
  if (maxPrice) filter.push({ range: { price: { lte: Number(maxPrice) } } });

  const body = {
    query: {
      bool: {
        must: must.length ? must : [{ match_all: {} }],
        filter
      }
    },
    from: Number(from),
    size: Number(size)
  };

  const r = await es.search({ index: 'products', body });
  res.json(r.hits);
});

app.listen(3000, () => console.log('API on http://localhost:3000'));
