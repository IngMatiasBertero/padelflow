# PadelFlow - Sistema de Reservas de Canchas de Padel

Sistema completo de gestión y reservas de canchas de padel con autenticación, base de datos PostgreSQL y paneles diferenciados para clientes y dueños de complejos deportivos.

## Características

### Para Clientes
- Explorar complejos deportivos disponibles
- Ver disponibilidad de canchas en tiempo real
- Realizar reservas de turnos
- Sistema de pagos integrado (Mercado Pago - próximamente)
- Historial de reservas
- Reviews y ratings

### Para Dueños de Complejos
- Panel de administración dedicado
- Gestión de complejos deportivos
- Administración de canchas
- Calendario de reservas
- Dashboard con métricas y analytics
- Insights con IA (Google Gemini)

## Stack Tecnológico

### Frontend
- **React 19** con TypeScript
- **Vite** como build tool
- **TailwindCSS** para estilos
- **Nginx** como servidor en producción

### Backend
- **Node.js 20** con TypeScript
- **Express** como framework web
- **Prisma ORM** para base de datos
- **JWT** para autenticación
- **Bcrypt** para hash de contraseñas
- **Zod** para validación de datos

### Base de Datos
- **PostgreSQL 16**

### DevOps
- **Docker** & **Docker Compose**
- Multi-container deployment
- Health checks y dependency management

## Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │   Backend API   │      │   PostgreSQL    │
│   (Puerto 7000) │─────▶│   (Puerto 7001) │─────▶│   (Puerto 7432) │
│   Nginx + React │      │   Express + JWT │      │   Base de Datos │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Desarrollo Local

### Requisitos
- Node.js 20+
- Docker y Docker Compose
- PostgreSQL 16 (o usar Docker)

### Frontend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tu GEMINI_API_KEY

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Backend

```bash
# Ir al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las configuraciones necesarias

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Ejecutar en modo desarrollo
npm run dev
```

La API estará disponible en `http://localhost:3000`

## Deployment en Producción

### Opción 1: Con Cloudflare Zero Trust (Recomendado)

Si usas Cloudflare Zero Trust (túnel), **no necesitas abrir puertos** en tu router. Todo se maneja de forma segura a través del túnel cifrado.

Ver la [Guía de Cloudflare Zero Trust](CLOUDFLARE_SETUP.md) para configuración completa.

**URLs de ejemplo:**
- Frontend: `https://padelflow.bertium.net`
- Backend API: `https://api.padelflow.bertium.net`

**Ventajas:**
- ✅ SSL/TLS automático (HTTPS gratis)
- ✅ No expones tu IP pública
- ✅ Protección DDoS de Cloudflare
- ✅ Sin configuración de firewall o puertos

### Opción 2: Deployment Tradicional

Ver la [Guía de Deployment completa](DEPLOYMENT.md) para instrucciones detalladas con VPS tradicional.

### Quick Start con Docker (Local)

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 2. Build y deploy
docker-compose up -d --build

# 3. Verificar que todo está corriendo
docker-compose ps
docker-compose logs -f
```

Acceder localmente:
- Frontend: `http://localhost:7000`
- Backend API: `http://localhost:7001`
- PostgreSQL: `localhost:7432`

## Estructura del Proyecto

Ver [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) para detalles completos de la estructura.

```
PadelFlow/
├── frontend/              # React + Vite
├── backend/              # Express + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
├── docker-compose.yml
├── DEPLOYMENT.md
└── README.md
```

## API Endpoints

Ver [backend/README.md](backend/README.md) para documentación completa de la API.

### Principales Endpoints

```
POST   /api/auth/register      - Registro de usuario
POST   /api/auth/login         - Login
GET    /api/auth/profile       - Perfil del usuario

GET    /api/complejos          - Listar complejos
POST   /api/complejos          - Crear complejo (dueños)
GET    /api/complejos/:id      - Detalle de complejo

GET    /api/canchas            - Listar canchas
POST   /api/canchas            - Crear cancha (dueños)

GET    /api/turnos             - Listar turnos
POST   /api/turnos             - Crear reserva
GET    /api/turnos/my          - Mis reservas
```

## Modelos de Datos

### User
- Roles: CLIENTE, DUENO, ADMIN
- Autenticación con JWT
- Contraseñas hasheadas con bcrypt

### Complejo
- Información del complejo deportivo
- Horarios de apertura/cierre
- Rating y reviews
- Relación con dueño

### Cancha
- Tipos: TECHADA, DESCUBIERTA, BLINDEX
- Precio por hora
- Relación con complejo

### Turno
- Estados: DISPONIBLE, RESERVADO, PENDIENTE, BLOQUEADO, CANCELADO
- Sistema de señas (25% del precio)
- Relación con cancha y cliente

## Seguridad

- JWT para autenticación
- Contraseñas hasheadas con bcrypt (10 rounds)
- Validación de datos con Zod
- CORS configurado
- Headers de seguridad en Nginx
- Variables de entorno para datos sensibles

## Testing

```bash
# Frontend
npm run test

# Backend
cd backend
npm run test
```

## Contribuir

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Roadmap

- [x] Sistema de autenticación
- [x] CRUD de complejos y canchas
- [x] Sistema de reservas
- [x] Dashboard para dueños
- [ ] Integración con Mercado Pago
- [ ] Sistema de reviews y ratings
- [ ] Notificaciones (email/SMS)
- [ ] Dashboard de analytics avanzado
- [ ] App móvil (React Native)
- [ ] Integración con Google Calendar

## Licencia

MIT

## Contacto

Para preguntas o soporte, por favor abrir un issue en el repositorio.

---

Hecho con ❤️ para la comunidad de padel
