# Guía de Uso - CookingMama API

Esta guía te ayudará a desplegar y usar el sistema completo cuando enciendas tu ordenador.

## 📋 Requisitos Previos

- Docker Desktop instalado y corriendo
- Docker Compose instalado (viene con Docker Desktop)

## 🚀 Iniciar el Sistema

### Paso 1: Abrir la terminal en la carpeta del proyecto

```powershell
cd "C:\Users\ikerr\Code\SGBD\PRACTICA FINAL 2.0\SGBD-CookingMama"
```

### Paso 2: Iniciar todos los servicios

```powershell
docker-compose up -d
```

Este comando iniciará:
- **MongoDB** (puerto 27017)
- **Elasticsearch** (puerto 9200)
- **Kibana** (puerto 5601)
- **Monstache** (sincronización MongoDB → Elasticsearch)
- **API** (puerto 3000)

### Paso 3: Verificar que todo está corriendo

```powershell
docker-compose ps
```

Deberías ver todos los servicios con estado "Up".

### Paso 4: Esperar a que todo esté listo (30-60 segundos)

Los servicios necesitan tiempo para:
- MongoDB: Inicializar el replica set
- Elasticsearch: Iniciar el cluster
- Monstache: Conectarse y comenzar la sincronización
- API: Conectarse a MongoDB y Elasticsearch

### Paso 5: Verificar el estado de la API

```powershell
Invoke-RestMethod -Uri http://localhost:3000/health -Method Get
```

Deberías recibir una respuesta JSON indicando que MongoDB y Elasticsearch están conectados.

### Paso 6: Ver los logs (opcional)

Para ver los logs de todos los servicios:
```powershell
docker-compose logs -f
```

Para ver logs de un servicio específico:
```powershell
# Logs de la API
docker-compose logs -f api

# Logs de Monstache
docker-compose logs -f monstache

# Logs de MongoDB
docker-compose logs -f mongo
```

## ✅ Verificar que Todo Funciona

### 1. Poblar datos de ejemplo (recrea índices e inserta dataset)

```powershell
cd api
npm install
npm run seed
```

Este comando elimina y vuelve a crear los índices `recipes` e `ingredients` en Elasticsearch con el mapping esperado, limpia MongoDB y vuelve a insertar los datos de ejemplo. Úsalo cada vez que quieras reiniciar el entorno con los datos base.

### 2. Listar las primeras recetas

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/recipes?size=3" -Method Get
```

### 3. Buscar recetas con ingredientes específicos (Esperar 2 segundos tras crear datos)

```powershell
Start-Sleep -Seconds 2
Invoke-RestMethod -Uri "http://localhost:3000/search/recipes?q=tomate&ingredients=Albahaca%20fresca&refresh=true" -Method Get
```

### 4. Consultar ingredientes disponibles por nombre

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/ingredients?q=aceite" -Method Get
```

## 📚 Endpoints Disponibles

### Health Check
```powershell
Invoke-RestMethod -Uri http://localhost:3000/health -Method Get
```

### Listar Ingredientes
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/ingredients?category=Vegetal" -Method Get
```

### Crear Ingrediente
```powershell
$body = @{
    name = "Pepino"
    category = "Vegetal"
    description = "Refrescante y crujiente"
    seasonality = @("Verano")
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri http://localhost:3000/ingredients -Method Post -Body $body -ContentType "application/json"
```

### Actualizar Ingrediente
```powershell
$body = @{ storage = "Refrigerado hasta 5 dias" } | ConvertTo-Json -Depth 1
Invoke-RestMethod -Uri http://localhost:3000/ingredients/ID_DEL_INGREDIENTE -Method Patch -Body $body -ContentType "application/json"
```

### Listar Recetas
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/recipes?difficulty=easy&maxTime=30" -Method Get
```

### Crear Receta
```powershell
$body = @{
    title = "Ensalada rapida de tomate"
    cuisine = "Mediterranea"
    difficulty = "easy"
    servings = 2
    tags = @("ensalada", "rapido")
    ingredients = @(
        @{ name = "Tomate"; quantity = 2; unit = "unidad" },
        @{ name = "Aceite de oliva virgen extra"; quantity = 1; unit = "cda" },
        @{ name = "Sal marina"; quantity = 0.25; unit = "cdita" }
    )
} | ConvertTo-Json -Depth 4

Invoke-RestMethod -Uri http://localhost:3000/recipes -Method Post -Body $body -ContentType "application/json"
```

### Obtener Receta por ID o Slug
```powershell
Invoke-RestMethod -Uri http://localhost:3000/recipes/espagueti-al-pomodoro -Method Get
```

### Buscar Recetas en Elasticsearch
```powershell
# Búsqueda por texto y dificultad
Invoke-RestMethod -Uri "http://localhost:3000/search/recipes?q=garbanzos&difficulty=easy" -Method Get

# Filtrar por ingredientes y tiempo máximo
Invoke-RestMethod -Uri "http://localhost:3000/search/recipes?ingredients=Garbanzos%20cocidos&maxTime=40" -Method Get

# Con refresh (para ver cambios al instante)
Invoke-RestMethod -Uri "http://localhost:3000/search/recipes?q=quinua&refresh=true" -Method Get
```

**Parámetros de búsqueda (`/search/recipes`):**
- `q`: Texto libre (title, description, tags, ingredients.name, cuisine)
- `cuisine`: Coincidencia exacta de cocina (ej: `Mediterranea`)
- `difficulty`: `easy`, `medium` o `hard`
- `tags`: Lista separada por comas
- `ingredients`: Lista separada por comas (se usa búsqueda difusa)
- `maxTime`: Tiempo máximo total en minutos
- `from`: Desplazamiento para paginación (default: 0)
- `size`: Cantidad de resultados (default: 10, máx. 100)
- `refresh`: Forzar refresh del índice (`true`/`false`)

## 🛑 Detener el Sistema

### Opción 1: Detener todos los servicios (recomendado)

```powershell
docker-compose down
```

Esto detendrá todos los contenedores pero **mantendrá los datos** en los volúmenes de Docker.

### Opción 2: Detener y eliminar volúmenes (elimina datos)

⚠️ **CUIDADO**: Esto eliminará todos los datos almacenados en MongoDB y Elasticsearch.

```powershell
docker-compose down -v
```

### Opción 3: Detener sin eliminar contenedores

```powershell
docker-compose stop
```

Para reiniciar después:
```powershell
docker-compose start
```

## 🔧 Comandos Útiles

### Ver estado de los contenedores
```powershell
docker-compose ps
```

### Ver logs en tiempo real
```powershell
docker-compose logs -f
```

### Reiniciar un servicio específico
```powershell
docker-compose restart api
docker-compose restart monstache
```

### Reconstruir la API (después de cambios en el código)
```powershell
docker-compose up -d --build api
```

### Verificar conexión a MongoDB
```powershell
docker exec mongo mongosh --eval "rs.status()" --quiet
```

### Verificar índice en Elasticsearch
```powershell
Invoke-RestMethod -Uri http://localhost:9200/recipes/_count -Method Get
```

### Ver todos los índices en Elasticsearch
```powershell
Invoke-RestMethod -Uri http://localhost:9200/_cat/indices?v -Method Get
```

## 🐛 Solución de Problemas

### La API no responde
1. Verificar que el contenedor está corriendo:
   ```powershell
   docker-compose ps
   ```
2. Ver los logs:
   ```powershell
   docker-compose logs api
   ```
3. Reiniciar el servicio:
   ```powershell
   docker-compose restart api
   ```

### Monstache no sincroniza
1. Verificar que MongoDB tiene replica set activo:
   ```powershell
   docker exec mongo mongosh --eval "rs.status()" --quiet
   ```
2. Ver logs de Monstache:
   ```powershell
   docker-compose logs monstache
   ```
3. Reiniciar Monstache:
   ```powershell
   docker-compose restart monstache
   ```

### Las recetas no aparecen en búsquedas
1. Verificar que Monstache está corriendo:
   ```powershell
   docker-compose ps monstache
   ```
2. Forzar refresh en la búsqueda:
   ```powershell
Invoke-RestMethod -Uri "http://localhost:3000/search/recipes?q=tomate&refresh=true" -Method Get
   ```
3. Esperar 1-2 segundos después de crear o actualizar una receta antes de buscarla.

### Error al iniciar servicios
1. Verificar que Docker Desktop está corriendo
2. Verificar que los puertos no están en uso:
   - 3000 (API)
   - 27017 (MongoDB)
   - 9200 (Elasticsearch)
   - 5601 (Kibana)
3. Detener todo y volver a iniciar:
   ```powershell
   docker-compose down
   docker-compose up -d
   ```

## 📊 Acceder a las Interfaces Web

- **API**: http://localhost:3000
- **Kibana** (dashboard de Elasticsearch): http://localhost:5601
- **Elasticsearch**: http://localhost:9200

### Verificar Elasticsearch directamente
```powershell
Invoke-RestMethod -Uri http://localhost:9200 -Method Get
```

## 🔄 Resumen Rápido

### Para empezar a trabajar:
```powershell
cd "C:\Users\ikerr\Code\SGBD\PRACTICA FINAL 2.0\SGBD-CookingMama"
docker-compose up -d
Start-Sleep -Seconds 30
Invoke-RestMethod -Uri http://localhost:3000/health -Method Get
```

### Para terminar y apagar todo:
```powershell
docker-compose down
```

### Para limpiar completamente (eliminar datos):
```powershell
docker-compose down -v
```

## 📝 Notas Importantes

1. **Primera vez**: La primera vez que ejecutes `docker-compose up -d`, puede tardar varios minutos en descargar las imágenes.

2. **Sincronización**: Monstache sincroniza automáticamente los cambios de MongoDB a Elasticsearch. Hay un pequeño delay (~1 segundo) antes de que las nuevas recetas sean buscables.

3. **Datos persistentes**: Los datos se guardan en volúmenes de Docker, por lo que sobreviven a reinicios del sistema si usas `docker-compose down` (sin `-v`).

4. **Puertos**: Si algún puerto está en uso, puedes cambiarlo en el archivo `docker-compose.yml`.

5. **Logs**: Si algo no funciona, revisa siempre los logs primero con `docker-compose logs [servicio]`.

