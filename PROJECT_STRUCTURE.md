# Estructura del Proyecto PadelFlow

## Vista General

```
Proyecto PadelFlow/
├── frontend/                    # Aplicación React
│   ├── components/             # Componentes de UI
│   │   ├── Layout.tsx
│   │   ├── AuthPage.tsx
│   │   ├── OwnerDashboard.tsx
│   │   ├── OwnerCalendar.tsx
│   │   ├── ClientExplore.tsx
│   │   ├── ClientComplexDetail.tsx
│   │   └── ClientBookingHistory.tsx
│   ├── services/
│   │   └── geminiService.ts   # Integración con Gemini AI
│   ├── App.tsx                # Componente principal
│   ├── index.tsx              # Entry point
│   ├── types.ts               # Tipos TypeScript
│   ├── constants.tsx          # Datos mock (temporales)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile             # Build de React + Nginx
│   ├── nginx.conf             # Configuración de Nginx
│   └── .dockerignore
│
├── backend/                    # API REST
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   │   ├── authController.ts
│   │   │   ├── complejoController.ts
│   │   │   ├── canchaController.ts
│   │   │   └── turnoController.ts
│   │   ├── routes/            # Definición de rutas
│   │   │   ├── authRoutes.ts
│   │   │   ├── complejoRoutes.ts
│   │   │   ├── canchaRoutes.ts
│   │   │   └── turnoRoutes.ts
│   │   ├── middleware/        # Middlewares
│   │   │   └── auth.ts        # JWT authentication
│   │   ├── utils/
│   │   │   └── jwt.ts         # JWT helpers
│   │   └── index.ts           # Entry point del servidor
│   ├── prisma/
│   │   └── schema.prisma      # Schema de base de datos
│   ├── Dockerfile             # Build del backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── docker-compose.yml          # Orquestación de servicios
├── DEPLOYMENT.md               # Guía de deployment
├── PROJECT_STRUCTURE.md        # Este archivo
├── README.md
└── .env                        # Variables de entorno (no commitear)
```

## Servicios Docker

### 1. PostgreSQL (padelflow_db)
- **Imagen:** postgres:16-alpine
- **Puerto:** 7432:5432
- **Base de datos:** padelflow_db
- **Usuario:** padelflow
- **Volumen:** postgres_data (persistente)

### 2. Backend API (padelflow_backend)
- **Tecnología:** Node.js 20 + Express + Prisma
- **Puerto:** 7001:3000
- **Depende de:** PostgreSQL
- **Funciones:**
  - Autenticación con JWT
  - CRUD de usuarios, complejos, canchas, turnos
  - Validación con Zod
  - Hash de contraseñas con Bcrypt

### 3. Frontend (padelflow_frontend)
- **Tecnología:** React 19 + Vite + Nginx
- **Puerto:** 7000:80
- **Depende de:** Backend
- **Funciones:**
  - SPA con routing
  - Paneles diferenciados (cliente/dueño)
  - Integración con Gemini AI

## Modelos de Base de Datos

### User
```typescript
{
  id: string
  email: string (unique)
  password: string (hashed)
  nombre: string
  telefono: string
  rol: 'CLIENTE' | 'DUENO' | 'ADMIN'
  avatar?: string
  activo: boolean
}
```

### Complejo
```typescript
{
  id: string
  nombre: string
  ciudad: string
  direccion: string
  telefono: string
  horario_apertura: string  // HH:MM
  horario_cierre: string    // HH:MM
  imagen?: string
  rating: number
  reviewsCount: number
  owner_id: string          // FK -> User
}
```

### Cancha
```typescript
{
  id: string
  nombre: string
  tipo: 'TECHADA' | 'DESCUBIERTA' | 'BLINDEX'
  precio_hora: number
  activa: boolean
  complejo_id: string       // FK -> Complejo
}
```

### Turno
```typescript
{
  id: string
  fecha: Date
  hora_inicio: string       // HH:MM
  hora_fin: string         // HH:MM
  estado: 'DISPONIBLE' | 'RESERVADO' | 'PENDIENTE' | 'BLOQUEADO' | 'CANCELADO'
  precio: number
  sena_pagada: boolean
  sena_monto?: number
  pago_completo: boolean
  cancha_id: string        // FK -> Cancha
  cliente_id?: string      // FK -> User (opcional)
}
```

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil del usuario (requiere auth)

### Complejos
- `GET /api/complejos` - Listar complejos
- `GET /api/complejos/:id` - Detalle de complejo
- `POST /api/complejos` - Crear complejo (solo dueños)
- `GET /api/complejos/my` - Mis complejos (solo dueños)

### Canchas
- `GET /api/canchas` - Listar canchas
- `POST /api/canchas` - Crear cancha (solo dueños)

### Turnos
- `GET /api/turnos` - Listar turnos (con filtros)
- `POST /api/turnos` - Crear reserva (requiere auth)
- `GET /api/turnos/my` - Mis reservas (requiere auth)
- `PATCH /api/turnos/:id/cancel` - Cancelar reserva (requiere auth)

## Flujos de Usuario

### Cliente
1. Registro/Login → Token JWT
2. Explorar complejos y canchas
3. Ver disponibilidad de turnos
4. Crear reserva → Estado PENDIENTE
5. Pagar seña → Estado RESERVADO
6. Ver historial de reservas

### Dueño
1. Registro/Login como DUENO → Token JWT
2. Crear complejo(s)
3. Agregar canchas al complejo
4. Ver dashboard con métricas
5. Gestionar calendario de reservas
6. Ver insights con IA (Gemini)

## Variables de Entorno

### Raíz (.env)
```env
GEMINI_API_KEY=tu_api_key
JWT_SECRET=secreto_aleatorio_fuerte
```

### Backend (generadas automáticamente)
```env
DATABASE_URL=postgresql://padelflow:padelflow_password@postgres:5432/padelflow_db
PORT=3000
NODE_ENV=production
FRONTEND_URL=http://localhost:7000
```

## Próximas Implementaciones

- [ ] Integración con Mercado Pago
- [ ] Sistema de reviews y ratings
- [ ] Notificaciones (email/SMS)
- [ ] Dashboard de analytics
- [ ] Sistema de promociones
- [ ] Sincronización con Google Calendar
- [ ] App móvil (React Native)
- [ ] Chat en vivo entre cliente y dueño
