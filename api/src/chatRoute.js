import { Ollama } from 'ollama'
import { Client as ElasticsearchClient } from '@elastic/elasticsearch'

// ----- CONFIG -----
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2'
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://ollama:11434'

// 👇 IMPORTANT: usar ELASTIC_URL del docker-compose
const ELASTIC_URL = process.env.ELASTIC_URL || 'http://es:9200'
const ELASTIC_INDEX = 'recipes'

// ----- CLIENTS -----
const ollama = new Ollama({ host: OLLAMA_HOST })

const esClient = new ElasticsearchClient({
  node: ELASTIC_URL
})

// ------------------------------------

export function registerChatRoute(app) {
  app.post('/chat', async (req, res) => {
    try {
      const { message } = req.body || {}
      console.log('\n\n\n📩 Mensaje recibido del frontend:', message)

      if (!message || !message.trim()) {
        return res
          .status(400)
          .json({ error: 'El campo "message" es obligatorio.' })
      }

      const query = message.trim()

      // ----------- EXTRAER PALABRAS CLAVE CON OLLAMA -----------
      let searchTerms = query
      console.log('🔄 Iniciando extracción con Ollama...')
      try {
        const extractionPrompt = `
Extrae SOLO ingredientes o nombres de platos que aparezcan EXACTAMENTE en el texto del usuario.

REGLAS ESTRICTAS:
- No añadas explicaciones.
- No escribas frases completas.
- No inventes ingredientes.
- No añadas términos relacionados.
- NO incluyas palabras como: receta, recetas, plato, comida, cena, desayuno, almuerzo, lleva, con, quiero, dime, buscar, busca.
- Devuelve únicamente las PALABRAS CLAVE separadas por espacio.
- Si aparece un ingrediente, devuelve solo el ingrediente.
- Si aparece un plato, devuelve solo el nombre del plato (sin adornos).
- Si el usuario escribe un ingrediente en plural, conviértelo a singular (zanahorias → zanahoria).

- Petición: "${query}"

DEVUELVE SOLO LA LISTA LIMPIA DE PALABRAS CLAVE SIN TEXTO EXTRA.
        `.trim()

        const extractionResponse = await ollama.chat({
          model: 'phi3:mini',
          messages: [{ role: 'user', content: extractionPrompt }]
        })

        console.log('📦 Respuesta cruda de Ollama:', JSON.stringify(extractionResponse))

        let extracted = extractionResponse?.message?.content?.trim()
        if (extracted) {
          // Limpiar caracteres especiales (markdown, puntuación)
          // Permitimos letras, números y espacios.
          extracted = extracted.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').trim()

          console.log('🔍 Términos extraídos por Ollama:', extracted)
          if (extracted.length > 0) {
            searchTerms = extracted
          }
        } else {
          console.log('⚠️ Ollama devolvió contenido vacío.')
        }
      } catch (err) {
        console.error('⚠️ Error extrayendo keywords con Ollama, usando query original:', err)
      }

      console.log('🔎 Buscando en Elasticsearch con terms:', searchTerms)

      // ----------- ELASTICSEARCH SEARCH -----------
      let recipes = []

      try {
        const esResponse = await esClient.search({
          index: ELASTIC_INDEX,
          size: 5,
          query: {
            multi_match: {
              query: searchTerms,
              fields: [
                'title^3',
                'description^2',
                'ingredients.name',
                'ingredients.notes',
                'instructions',
                'tips',
                'tags'
              ]
            }
          }
        })

        recipes = esResponse.hits.hits.map((hit) => ({
          _id: hit._id,
          _score: hit._score,
          ...hit._source
        }))

        console.log('📚 Recetas encontradas en Elasticsearch:', recipes.length)
        console.log('📚 Detalles:', recipes.map((r) => r.title))
      } catch (err) {
        console.error('❌ Error consultando Elasticsearch:', err)
      }

      // ----------- CONTEXTO PARA OLLAMA -----------
      const dbContext =
        recipes.length === 0
          ? 'No se han encontrado recetas relacionadas en la base de datos.'
          : recipes
            .map((r) => {
              const ingredients = r.ingredients
                ? r.ingredients.map((i) => `${i.quantity || ''} ${i.unit || ''} ${i.name} ${i.notes || ''}`.trim()).join(', ')
                : 'No especificados'
              return `
Título: ${r.title}
Descripción: ${r.description}
Ingredientes: ${ingredients}
Instrucciones: ${r.instructions}
---`
            })
            .join('\n')

      const systemPrompt = `
Eres un asistente de cocina que SIEMPRE responde en castellano.
Cuando sea posible, utiliza la información de las recetas recuperadas desde Elasticsearch y dilo explícitamente.
Si la base de datos no contiene información relevante, responde de forma general y útil.

REGLAS DE RESPUESTA:

1. PREGUNTAS DE BÚSQUEDA GENERAL (ej: “recetas con pollo”, “platos con zanahoria”):
   - Devuelve SOLO una lista de nombres de recetas encontradas.
   - No des detalles, ingredientes ni instrucciones.

2. PREGUNTAS SOBRE UNA RECETA CONCRETA (ej: “cómo se hace el caldo de pollo”, “dame ingredientes del pollo al limón”):
   - Explica la receta completa: ingredientes, preparación y tiempos.
   - Usa los datos recuperados de la base de datos.

3. PREGUNTAS DE ANÁLISIS O COMPARACIÓN (ej: “receta con menos calorías”, “la más rápida”, “la más alta en proteína”):
   - Analiza las recetas recuperadas y ofrece el resultado (la más ligera, la más rápida, etc).
   - Menciona qué receta cumple con la condición y por qué.

4. PREGUNTAS DE COCINA GENERALES (ej: “qué es sofreír”, “cómo marinar carne”, “dame un truco de cocina”):
   - Responde como un experto en cocina, incluso si no hay recetas relevantes.

5. Todas las respuestas deben ser breves, claras y prácticas.
      `.trim()

      const userPrompt = `
Pregunta del usuario: "${message}"

Recetas encontradas en la base de datos (búsqueda: "${searchTerms}"):
${dbContext}
      `.trim()

      // ----------- LLAMADA A OLLAMA -----------
      const response = await ollama.chat({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })

      const answer =
        response?.message?.content ??
        'No he podido generar una respuesta en este momento.'

      return res.json({ answer, recipes })
    } catch (err) {
      console.error('❌ Error en /chat:', err)
      return res
        .status(500)
        .json({ error: 'Error interno en el servidor de chat.' })
    }
  })
}