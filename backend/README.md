# PadelFlow Backend API

API REST para el sistema de reservas de canchas de padel PadelFlow.

## Tecnologías

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Zod** - Validación de datos

## Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/      # Lógica de negocio
│   │   ├── authController.ts
│   │   ├── complejoController.ts
│   │   ├── canchaController.ts
│   │   └── turnoController.ts
│   ├── routes/          # Definición de rutas
│   │   ├── authRoutes.ts
│   │   ├── complejoRoutes.ts
│   │   ├── canchaRoutes.ts
│   │   └── turnoRoutes.ts
│   ├── middleware/      # Middlewares (auth, etc)
│   │   └── auth.ts
│   ├── utils/          # Utilidades
│   │   └── jwt.ts
│   └── index.ts        # Entry point
├── prisma/
│   └── schema.prisma   # Schema de base de datos
└── package.json
```

## API Endpoints

### Autenticación

#### POST /api/auth/register
Registrar nuevo usuario (cliente o dueño).

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "telefono": "3856000111",
  "rol": "CLIENTE"  // o "DUENO"
}
```

**Response:**
```json
{
  "user": {
    "id": "clxxxxx",
    "email": "usuario@email.com",
    "nombre": "Juan Pérez",
    "telefono": "3856000111",
    "rol": "CLIENTE",
    "avatar": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /api/auth/login
Iniciar sesión.

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "password123"
}
```

**Response:** Igual que register

#### GET /api/auth/profile
Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "clxxxxx",
  "email": "usuario@email.com",
  "nombre": "Juan Pérez",
  "telefono": "3856000111",
  "rol": "CLIENTE",
  "avatar": "https://...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Complejos

#### GET /api/complejos
Listar todos los complejos activos.

**Query params:**
- `ciudad` (opcional): Filtrar por ciudad

**Response:**
```json
[
  {
    "id": "clxxxxx",
    "nombre": "Santiago Padel Club",
    "ciudad": "Santiago del Estero",
    "direccion": "Avenida Libertador y Lavalle",
    "telefono": "+54 385 486-1436",
    "horario_apertura": "08:00",
    "horario_cierre": "02:00",
    "imagen": "https://...",
    "rating": 4.5,
    "reviewsCount": 94,
    "canchas": [...],
    "owner": {
      "id": "...",
      "nombre": "...",
      "email": "..."
    }
  }
]
```

#### GET /api/complejos/:id
Obtener detalle de un complejo.

#### POST /api/complejos
Crear nuevo complejo (solo dueños).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "nombre": "Mi Complejo",
  "ciudad": "Santiago del Estero",
  "direccion": "Calle Ejemplo 123",
  "telefono": "+54 385 123-4567",
  "horario_apertura": "08:00",
  "horario_cierre": "23:00",
  "imagen": "https://..." // opcional
}
```

#### GET /api/complejos/my
Obtener mis complejos (solo dueños).

**Headers:**
```
Authorization: Bearer <token>
```

### Canchas

#### GET /api/canchas
Listar canchas activas.

**Query params:**
- `complejo_id` (opcional): Filtrar por complejo

**Response:**
```json
[
  {
    "id": "clxxxxx",
    "nombre": "Cancha 1 (Blindex)",
    "tipo": "BLINDEX",
    "precio_hora": 4800,
    "activa": true,
    "complejo": {
      "id": "...",
      "nombre": "...",
      "ciudad": "..."
    }
  }
]
```

#### POST /api/canchas
Crear nueva cancha (solo dueños).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "nombre": "Cancha 1",
  "tipo": "BLINDEX",  // BLINDEX, TECHADA, DESCUBIERTA
  "precio_hora": 4800,
  "complejo_id": "clxxxxx"
}
```

### Turnos / Reservas

#### GET /api/turnos
Listar turnos.

**Query params:**
- `cancha_id` (opcional): Filtrar por cancha
- `fecha` (opcional): Filtrar por fecha (YYYY-MM-DD)
- `estado` (opcional): DISPONIBLE, RESERVADO, PENDIENTE, BLOQUEADO, CANCELADO

**Response:**
```json
[
  {
    "id": "clxxxxx",
    "fecha": "2024-01-15T00:00:00.000Z",
    "hora_inicio": "18:00",
    "hora_fin": "19:00",
    "estado": "RESERVADO",
    "precio": 4800,
    "sena_pagada": true,
    "sena_monto": 1200,
    "cancha": {
      "id": "...",
      "nombre": "Cancha 1",
      "complejo": {
        "nombre": "Santiago Padel Club"
      }
    },
    "cliente": {
      "id": "...",
      "nombre": "Juan Pérez",
      "telefono": "3856000111"
    }
  }
]
```

#### POST /api/turnos
Crear reserva (clientes autenticados).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "cancha_id": "clxxxxx",
  "fecha": "2024-01-15",
  "hora_inicio": "18:00",
  "hora_fin": "19:00"
}
```

**Response:** Objeto Turno creado con estado PENDIENTE

#### GET /api/turnos/my
Obtener mis reservas.

**Headers:**
```
Authorization: Bearer <token>
```

#### PATCH /api/turnos/:id/cancel
Cancelar reserva.

**Headers:**
```
Authorization: Bearer <token>
```

## Desarrollo Local

### Requisitos
- Node.js 20+
- PostgreSQL 16+

### Instalación

```bash
cd backend
npm install
```

### Configuración

Crear archivo `.env`:

```env
DATABASE_URL="postgresql://padelflow:password@localhost:5432/padelflow_db?schema=public"
JWT_SECRET="tu_secreto_super_seguro"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:7000"
```

### Migraciones de Base de Datos

```bash
# Generar Prisma Client
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Abrir Prisma Studio (GUI para DB)
npm run prisma:studio
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

### Build para Producción

```bash
npm run build
npm start
```

## Deployment con Docker

Ver archivo [DEPLOYMENT.md](../DEPLOYMENT.md) en la raíz del proyecto.

## Modelos de Datos

### User
- `id`: String (cuid)
- `email`: String (unique)
- `password`: String (hashed)
- `nombre`: String
- `telefono`: String
- `rol`: CLIENTE | DUENO | ADMIN
- `avatar`: String (opcional)
- `activo`: Boolean

### Complejo
- `id`: String (cuid)
- `nombre`: String
- `ciudad`: String
- `direccion`: String
- `telefono`: String
- `horario_apertura`: String (HH:MM)
- `horario_cierre`: String (HH:MM)
- `imagen`: String (opcional)
- `rating`: Float
- `reviewsCount`: Int
- `owner_id`: String (FK -> User)

### Cancha
- `id`: String (cuid)
- `nombre`: String
- `tipo`: TECHADA | DESCUBIERTA | BLINDEX
- `precio_hora`: Int
- `activa`: Boolean
- `complejo_id`: String (FK -> Complejo)

### Turno
- `id`: String (cuid)
- `fecha`: DateTime
- `hora_inicio`: String (HH:MM)
- `hora_fin`: String (HH:MM)
- `estado`: DISPONIBLE | RESERVADO | PENDIENTE | BLOQUEADO | CANCELADO
- `precio`: Int
- `sena_pagada`: Boolean
- `sena_monto`: Int
- `pago_completo`: Boolean
- `cancha_id`: String (FK -> Cancha)
- `cliente_id`: String (FK -> User, opcional)

## Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

### Obtener token

Login o registro devuelven un token JWT.

### Usar token

Incluir en header de requests protegidos:

```
Authorization: Bearer <token>
```

### Roles

- **CLIENTE**: Puede ver complejos, crear reservas
- **DUENO**: Puede crear complejos, canchas, gestionar reservas
- **ADMIN**: Acceso total (futuro)

## Estado de Turnos

- **DISPONIBLE**: Turno libre, puede reservarse
- **PENDIENTE**: Reserva creada, esperando pago de seña
- **RESERVADO**: Seña pagada, turno confirmado
- **BLOQUEADO**: Dueño bloqueó el horario
- **CANCELADO**: Reserva cancelada

## Próximas Funcionalidades

- [ ] Integración con Mercado Pago
- [ ] Sistema de reviews y ratings
- [ ] Notificaciones (email/SMS)
- [ ] Dashboard de analytics para dueños
- [ ] Sistema de promociones
- [ ] Integración con Google Calendar
