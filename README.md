# 🍽️ Jornada de Almuerzo Gratis

Sistema de gestión de pedidos para restaurante construido con arquitectura de microservicios, Node.js y Angular.

## 🌐 Demo

- **Frontend:** [https://prueba-tecnica-alegra.vercel.app](https://prueba-tecnica-alegra.vercel.app)
- **API Gateway:** [https://api-gateway-production-a367.up.railway.app](https://api-gateway-production-a367.up.railway.app)

---

## 🏗️ Arquitectura

El sistema está construido con **microservicios completamente independientes**. Cada servicio tiene su propio `package.json`, `tsconfig.json`, `.env` y `Dockerfile` — lo que permite que cualquier servicio pueda ser reemplazado por una implementación en otro lenguaje (Laravel, Python, Go) sin afectar al resto del sistema.

La comunicación entre servicios es exclusivamente via HTTP a través del API Gateway — ese es el único contrato entre ellos.
```
                    ┌─────────────┐
                    │   Frontend  │
                    │   Angular   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │ :3000
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼───────┐  ┌──────▼───────┐
│ order-service│  │warehouse-service│  │kitchen-service│
│    :3001     │  │     :3003      │  │    :3002     │
└───────┬──────┘  └────────┬───────┘  └──────────────┘
        │                  │
        │         ┌────────▼───────┐
        │         │ market-service │
        │         │    :3004      │
        │         └───────────────┘
        │
┌───────▼──────┐
│  ai-service  │
│    :3005     │
└───────┬──────┘
        │
┌───────▼──────┐
│  PostgreSQL  │
│    :5432     │
└──────────────┘
```

### Microservicios

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| `api-gateway` | 3000 | Punto de entrada único, enrutamiento y CORS |
| `order-service` | 3001 | Gestión de órdenes y procesamiento asíncrono |
| `kitchen-service` | 3002 | Actualización de estado de órdenes |
| `warehouse-service` | 3003 | Gestión de inventario y procesamiento de recetas |
| `market-service` | 3004 | Compras en la plaza de mercado externa |
| `ai-service` | 3005 | Agente IA con predicción de escasez |

---

## 🔄 Flujo del sistema

1. El gerente presiona el botón de pedido indicando la cantidad de platos
2. `order-service` crea la orden y responde inmediatamente con el `orderId`
3. En background, `order-service` llama a `warehouse-service`
4. `warehouse-service` procesa los platos en **lotes paralelos de 10**:
   - Selecciona una receta aleatoria de las 6 disponibles
   - Verifica el stock con `FOR UPDATE` para evitar race conditions
   - Si faltan ingredientes, llama a `market-service` para comprar
   - Si el mercado no tiene stock, cambia a otra receta automáticamente
   - Reintenta hasta 5 veces antes de abandonar un plato
5. El frontend hace **polling** cada 5 segundos para actualizar el estado
6. El gerente puede marcar la orden como completada cuando todos los platos estén listos

---

## 🤖 AI Challenge — Predicción de escasez

El sistema incluye un agente de inteligencia artificial construido con **Gemini 2.5 Flash** y **function calling** que analiza en tiempo real:

- Stock actual de ingredientes
- Historial de órdenes y consumo
- Predicción de cuántas órdenes más se pueden completar antes de que un ingrediente se agote
- Recetas más pedidas
- Historial de compras en la plaza

El agente decide autónomamente qué queries ejecutar según la pregunta del gerente — puede encadenar múltiples consultas a la DB para dar una respuesta completa.

### Preguntas disponibles en el chatbot

- ¿Qué ingredientes van a faltar pronto?
- ¿Cuál es la receta más pedida?
- ¿Cuántos platos se han completado hoy?
- ¿Qué ingredientes tienen stock crítico?
- ¿Cuántas compras se han hecho en la plaza?

---

## 🛠️ Stack tecnológico

**Backend:**
- Node.js con TypeScript — sin frameworks (HTTP puro)
- PostgreSQL — base de datos relacional
- Gemini 2.5 Flash — agente de IA con function calling

**Frontend:**
- Angular 21
- Tailwind CSS v4
- Signals para gestión de estado

**Infraestructura:**
- Docker — cada servicio tiene su propio Dockerfile
- Railway — despliegue del backend
- Vercel — despliegue del frontend

---

## 📁 Estructura del proyecto
```
/
├── docker-compose.yml
├── db/
│   └── init.sql              ← schema y datos iniciales
├── src/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   └── api-gateway.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── order-service/
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── shared/
│   │   │   │   ├── http/
│   │   │   │   └── database/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   └── infrastructure/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
|   |   |__ .env
│   ├── warehouse-service/    ← misma estructura
│   ├── kitchen-service/
│   ├── market-service/
│   └── ai-service/
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/services/
    │   │   └── pages/dashboard/
    │   └── environments/
    └── vercel.json
```

---

## 🚀 Correr localmente

### Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 20+

### Variables de entorno

Crea un `.env` en cada servicio dentro de `src/`:
```bash
# src/order-service/.env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=restaurant
WAREHOUSE_SERVICE_HOST=warehouse-service
```
```bash
# src/warehouse-service/.env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=restaurant
MARKET_SERVICE_HOST=market-service
```
```bash
# src/ai-service/.env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=restaurant
GOOGLE_API_KEY=tu_api_key
```
```bash
# .env raíz (solo para postgres en docker-compose)
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=restaurant
```

### Levantar el sistema
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/prueba-tecnica-alegra
cd prueba-tecnica-alegra

# Levantar todos los servicios
docker-compose up --build

# La primera vez PostgreSQL ejecuta el init.sql automáticamente
# Si necesitas resetear la DB:
docker-compose down -v
docker-compose up --build

# Para ejecutar el frontend
cd frontend-pages
npm install
ng serve

```

### URLs locales

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API Gateway | http://localhost:3000 |
| Order Service | http://localhost:3001 |
| Kitchen Service | http://localhost:3002 |
| Warehouse Service | http://localhost:3003 |
| Market Service | http://localhost:3004 |
| AI Service | http://localhost:3005 |

---

## 📊 Endpoints principales

### Orders
```
POST   /orders              → Crear orden (respuesta inmediata)
GET    /orders              → Historial de órdenes
GET    /orders/:id          → Estado de una orden
GET    /orders/:id/recipes  → Recetas de una orden
```

### Warehouse
```
POST   /warehouse/check     → Procesar orden (interno)
GET    /warehouse/inventory → Stock actual de ingredientes
GET    /warehouse/recipes   → Recetas disponibles con ingredientes
```

### Market
```
POST   /market/buy          → Comprar ingrediente (interno)
GET    /market/history      → Historial de compras
```

### AI
```
POST   /ai/query            → Consultar al agente IA
```

### Kitchen
```
PATCH  /kitchen/orders      → Actualizar estado de orden
```

---

## 🗄️ Schema de base de datos
```sql
orders          → órdenes del gerente
recipes         → 6 recetas disponibles
order_items     → relación orden-receta
ingredients     → stock de ingredientes
recipe_ingredients → ingredientes por receta con cantidad
market_purchases   → historial de compras en la plaza
```

---

## 🐳 Despliegue

### Backend — Railway

Cada microservicio está desplegado como un servicio independiente en Railway, con PostgreSQL como plugin managed.

Variables de entorno configuradas en Railway usando referencias internas:
```
DB_HOST=${{Postgres.PGHOST}}
WAREHOUSE_SERVICE_HOST=warehouse-service.railway.internal
```

### Frontend — Vercel

El frontend Angular está desplegado en Vercel y rewrites para el routing de Angular.

---

## 💡 Decisiones técnicas

**¿Por qué cada servicio tiene su propio `shared/`?**
En microservicios reales los servicios son independientes del lenguaje. Compartir código via un paquete npm rompería esa independencia — un servicio futuro en Laravel o Python no podría usar el shared de Node.js. La duplicación de utilidades básicas es una decisión consciente que compra independencia real.

**¿Por qué procesamiento por lotes paralelos?**
Un pedido de 100 platos procesado secuencialmente tardaba más de 1 minuto. Con batches de 10 en paralelo y respuesta asíncrona inmediata, el endpoint responde en menos de 100ms y el procesamiento completo baja a 8-12 segundos.

**¿Por qué `FOR UPDATE` en los ingredientes?**
Para evitar race conditions bajo alta demanda — sin el lock, dos platos procesados en paralelo podrían consumir el mismo stock y llevar el inventario a valores negativos.
