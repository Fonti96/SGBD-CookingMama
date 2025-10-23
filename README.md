MongoDB + Elasticsearch + Monstache + API (Node.js)

Proyecto de ejemplo con MongoDB como fuente de verdad, Elasticsearch para búsquedas full-text, Monstache para sincronización en tiempo real y una API Node.js (Express) para CRUD y búsquedas.

📦 Requisitos

Docker y Docker Compose

Node.js ≥ 18 (para la API)

(Opcional) curl o Postman

Windows PowerShell o bash/zsh (según tu entorno)

🧩 Arquitectura

MongoDB (replica set rs0): base de datos transaccional.

Elasticsearch: índice products para búsqueda.

Kibana: consola y UI para inspeccionar ES.

Monstache: replica cambios de MongoDB → Elasticsearch.

API Node.js: endpoints CRUD (Mongo) + búsqueda (ES).

🗂️ Estructura
.
├── docker-compose.yml
├── monstache.toml
├── products-mapping.json          # mapping y settings de ES
└── api/
    ├── package.json
    └── src/
        └── index.(js|mjs)


Si usas CommonJS o ES Modules, asegúrate de que tu package.json y src/index.js coinciden con el estilo elegido.

🚀 Puesta en marcha
1) Levantar la infraestructura (Mongo, ES, Kibana, Monstache)

Desde la raíz del proyecto:

docker compose up -d


Verificación rápida:

# Elasticsearch vivo
curl http://localhost:9200
# Kibana activo
# Abre http://localhost:5601 en el navegador


Si ES devuelve 401, tienes seguridad activada. En este proyecto está desactivada (xpack.security.enabled=false) para desarrollo.

2) Crear el índice de Elasticsearch (products)
Opción A: PowerShell (Windows)
# Estando en la carpeta donde está products-mapping.json
Invoke-RestMethod `
  -Uri "http://localhost:9200/products" `
  -Method Put `
  -ContentType "application/json" `
  -InFile ".\products-mapping.json"

Opción B: curl “real” (Windows o Unix)
curl -X PUT "http://localhost:9200/products" \
  -H "Content-Type: application/json" \
  --data-binary "@products-mapping.json"

Opción C: Kibana

Abre http://localhost:5601 → Dev Tools → Console.

Ejecuta:

PUT /products
{  ...contenido de products-mapping.json...  }


Verificación:

curl http://localhost:9200/_cat/indices?v
curl http://localhost:9200/products/_mapping?pretty

3) Iniciar la API

Desde ./api:

npm install
npm start


La API queda en: http://localhost:3000

🧪 Probar que todo funciona
A) Insertar un documento (Mongo vía API)
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Zapatillas running",
    "brand":"Acme",
    "price":79.9,
    "tags":["deporte","running"],
    "description":"Cómodas y ligeras"
  }'


Respuesta esperada (JSON):

{
  "_id": "...",
  "name": "Zapatillas running",
  "brand": "Acme",
  "price": 79.9,
  "tags": ["deporte", "running"],
  "description": "Cómodas y ligeras",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "__v": 0
}


Monstache detectará el insert en Mongo y lo indexará en products (ES) automáticamente.

B) Buscar en Elasticsearch

Tras unos segundos (o inmediato), consulta en ES:

curl "http://localhost:9200/products/_search?q=running&pretty"


Deberías ver tu documento en los hits.

C) Buscar vía API (ES bajo el capó)
curl "http://localhost:3000/search?q=running&brand=Acme"


Respuesta esperada (JSON) — hits de ES:

{
  "total": { "value": 1, "relation": "eq" },
  "max_score": 1.23,
  "hits": [
    {
      "_index": "products",
      "_id": "...",
      "_score": 1.23,
      "_source": {
        "name": "Zapatillas running",
        "brand": "Acme",
        "price": 79.9,
        "tags": ["deporte", "running"],
        "description": "Cómodas y ligeras",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    }
  ]
}

🔌 Endpoints útiles (API)

POST /products — crea producto (Mongo).

GET /products/:id — obtiene producto (Mongo).

PATCH /products/:id — actualiza (Mongo).

DELETE /products/:id — elimina (Mongo).

GET /search — busca en ES. Parámetros:

q (texto), brand (term), minPrice, maxPrice, from, size.

Ejemplo:

GET /search?q=running&brand=Acme&minPrice=50&maxPrice=100&size=5

🛠️ Notas de configuración

products-mapping.json define:

Analyzer multi_lang (stopwords ES/EN).

Campos name/description como text; brand/tags como keyword; price float; createdAt date.

monstache.toml incluye:

Conexión a mongodb://mongo:27017/?replicaSet=rs0.

direct-read-namespaces para backfill inicial (p. ej. appdb.products).

Mapeo appdb.products → products en ES.

docker-compose.yml:

Mongo en modo replica set (rs0).

ES single-node con seguridad desactivada (dev).

Kibana apuntando a ES.

Monstache leyendo de Mongo y escribiendo en ES.

API:

Conecta a Mongo en mongodb://localhost:27017/appdb.

Conecta a ES en http://localhost:9200.

Si mueves servicios a la nube (Atlas / Elastic Cloud), sustituye URLs/credenciales y activa TLS.

🧯 Troubleshooting

index_not_found_exception al borrar
El índice no existe todavía. Crea con PUT /products.

resource_already_exists_exception al crear
El índice ya existe. Elimínalo (DELETE /products) o usa versión + alias:

Crear products-v2.

_reindex desde products a products-v2.

Borrar products.

Crear alias products → products-v2.

PowerShell no entiende -H
En PowerShell, curl es Invoke-WebRequest. Usa:

Invoke-RestMethod -InFile ... -ContentType "application/json"

o curl.exe explícitamente con --data-binary.

No ves documentos en ES

Verifica logs de Monstache: docker logs monstache.

Comprueba que la colección y DB coinciden con monstache.toml (appdb.products).

Inserta vía API y revisa /_cat/indices?v.

ES devuelve 401
Tienes seguridad activada. Usa -u user:pass en curl o configura xpack.security.enabled=false en dev.

📚 Comandos útiles
# Ver índices
curl http://localhost:9200/_cat/indices?v

# Count de documentos
curl http://localhost:9200/products/_count

# Mapping y settings
curl http://localhost:9200/products/_mapping?pretty
curl http://localhost:9200/products/_settings?pretty

# Logs (Docker)
docker logs -f monstache
docker logs -f es
docker logs -f mongo

✅ Checklist rápido

 docker compose up -d

 PUT /products con products-mapping.json

 npm install && npm start en api/

 POST /products (insertar un doc)

 GET /products/_search en ES o GET /search en la API
