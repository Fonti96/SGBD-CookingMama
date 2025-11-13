# CookingMama API - Sistema de Recetas y Alimentos

Plataforma completa para gestionar recetas, ingredientes y búsquedas potentes con MongoDB, Elasticsearch y sincronización en tiempo real.

## 🚀 Inicio Rápido

### Opción 1: Usar los scripts (Recomendado)

**Para iniciar todo:**
```powershell
.\iniciar.ps1
```

**Para detener todo:**
```powershell
.\detener.ps1
```

**Para ver el estado:**
```powershell
.\estado.ps1
```

### Opción 2: Usar Docker Compose directamente

**Iniciar:**
```powershell
docker-compose up -d
```

**Detener:**
```powershell
docker-compose down
```

## 📚 Documentación Completa

Para una guía detallada con todos los comandos y solución de problemas, consulta el archivo **[GUIA.md](./GUIA.md)**.

## 🏗️ Arquitectura

- **API REST**: Node.js + Express (Puerto 3000)
- **Base de Datos**: MongoDB con Replica Set (Puerto 27017)
- **Motor de Búsqueda**: Elasticsearch (Puerto 9200)
- **Sincronización**: Monstache mantiene índices `recipes` e `ingredients` actualizados en tiempo real
- **Dashboard**: Kibana (Puerto 5601)

## 🔗 Endpoints Principales

- `GET /health` - Estado del sistema y conteo de colecciones
- `GET /ingredients` - Listar ingredientes (filtros por nombre/categoría)
- `GET /ingredients/:id` - Obtener ingrediente por ID
- `POST /ingredients` - Crear ingrediente
- `PATCH /ingredients/:id` - Actualizar ingrediente
- `DELETE /ingredients/:id` - Eliminar ingrediente
- `GET /recipes` - Listar recetas con filtros por texto, cocina, dificultad, ingredientes o tiempo
- `GET /recipes/:idOrSlug` - Obtener receta por ID o slug
- `POST /recipes` - Crear receta (resuelve automáticamente los ingredientes por nombre o ID)
- `PATCH /recipes/:idOrSlug` - Actualizar receta
- `DELETE /recipes/:idOrSlug` - Eliminar receta
- `GET /search/recipes` - Buscar recetas en Elasticsearch con relevancia completa

## 📦 Poblar la base de datos (seed)

```powershell
cd api
npm install
npm run seed
```

El script recrea los índices `recipes` e `ingredients` en Elasticsearch con el mapping correcto, limpia MongoDB y carga 35 ingredientes y 12 recetas listos para experimentar con búsquedas.

## 📖 Ejemplo de Uso

```powershell
# Crear una nueva receta (los ingredientes pueden ir por nombre)
$body = @{
    title = "Ensalada express de tomate"
    cuisine = "Mediterranea"
    difficulty = "easy"
    servings = 2
    ingredients = @(
        @{ name = "Tomate"; quantity = 2; unit = "unidad" },
        @{ name = "Aceite de oliva virgen extra"; quantity = 1; unit = "cda" },
        @{ name = "Sal marina"; quantity = 0.25; unit = "cdita" }
    )
} | ConvertTo-Json -Depth 4

Invoke-RestMethod -Uri http://localhost:3000/recipes -Method Post -Body $body -ContentType "application/json"

# Buscar recetas con tomate en Elasticsearch
Invoke-RestMethod -Uri "http://localhost:3000/search/recipes?q=tomate&ingredients=Albahaca%20fresca&refresh=true" -Method Get
```

## 📝 Notas

- La primera vez puede tardar varios minutos en descargar las imágenes de Docker
- Espera 30-60 segundos después de iniciar para que todos los servicios estén listos
- Los datos se guardan en volúmenes de Docker y persisten entre reinicios

## 🆘 Ayuda

Consulta **[GUIA.md](./GUIA.md)** para configuraciones avanzadas, monitoreo de Monstache y ejemplos adicionales de consultas.

