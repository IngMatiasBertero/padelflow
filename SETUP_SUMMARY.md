# Resumen de Configuración - PadelFlow

## 📋 Configuración Completa

### URLs de la Aplicación

```
Frontend:     https://padelflow.bertium.net
Backend API:  https://api.padelflow.bertium.net
Health Check: https://api.padelflow.bertium.net/health
```

### Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE CDN                             │
│  - SSL/TLS automático                                        │
│  - DDoS protection                                           │
│  - CDN global                                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓ (Túnel cifrado)
┌─────────────────────────────────────────────────────────────┐
│              TU MINIPC (Sin puertos abiertos)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Cloudflared Tunnel Service                    │   │
│  │  - padelflow.bertium.net → localhost:7000            │   │
│  │  - api.padelflow.bertium.net → localhost:7001        │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Docker Containers                       │   │
│  │                                                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │  Frontend   │  │  Backend    │  │ PostgreSQL │  │   │
│  │  │  (Nginx)    │  │  (Express)  │  │            │  │   │
│  │  │  Port 7000  │  │  Port 7001  │  │ Port 7432  │  │   │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Stack Tecnológico

### Frontend
- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Estilos:** TailwindCSS
- **Servidor:** Nginx
- **Puerto:** 7000 (interno)

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express + TypeScript
- **ORM:** Prisma
- **Autenticación:** JWT
- **Validación:** Zod
- **Puerto:** 7001 (interno)

### Base de Datos
- **Motor:** PostgreSQL 16
- **Puerto:** 7432 (interno)
- **Persistencia:** Docker Volume

### Infraestructura
- **Contenedores:** Docker + Docker Compose
- **Túnel:** Cloudflare Zero Trust
- **SSL/TLS:** Automático (Cloudflare)
- **CDN:** Cloudflare Global Network

## 📁 Estructura de Archivos

```
padelflow/
├── frontend/
│   ├── components/          # Componentes React
│   ├── services/           # Servicios (Gemini AI)
│   ├── Dockerfile          # Build de React + Nginx
│   └── nginx.conf          # Configuración Nginx
│
├── backend/
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Endpoints API
│   │   ├── middleware/     # Auth, etc.
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Schema DB
│   └── Dockerfile          # Build de Node.js
│
├── docker-compose.yml      # Orquestación
├── .env                    # Variables (NO commitear)
│
└── Documentación/
    ├── README.md           # Documentación principal
    ├── DEPLOYMENT.md       # Deployment tradicional
    ├── CLOUDFLARE_SETUP.md # Guía Cloudflare
    ├── CLOUDFLARE_CHECKLIST.md # Checklist paso a paso
    ├── API_EXAMPLES.md     # Ejemplos de API
    └── PROJECT_STRUCTURE.md # Estructura completa
```

## 🔐 Variables de Entorno (.env)

```env
# API Key de Google Gemini
GEMINI_API_KEY=tu_api_key_aqui

# JWT Secret (generar: openssl rand -base64 32)
JWT_SECRET=secreto_aleatorio_super_seguro

# URLs de Cloudflare
FRONTEND_URL=https://padelflow.bertium.net
API_URL=https://api.padelflow.bertium.net
```

## 🚀 Comandos Principales

### Deploy Inicial

```bash
# 1. Instalar y configurar cloudflared
cloudflared tunnel login
cloudflared tunnel create padelflow
# Configurar /etc/cloudflared/config.yml
sudo cloudflared service install
sudo systemctl start cloudflared

# 2. Deploy de la aplicación
cd ~/padelflow
nano .env  # Configurar variables
docker-compose up -d --build
```

### Operaciones Diarias

```bash
# Ver estado
docker-compose ps
sudo systemctl status cloudflared

# Ver logs
docker-compose logs -f
sudo journalctl -u cloudflared -f

# Reiniciar servicios
docker-compose restart
sudo systemctl restart cloudflared

# Actualizar aplicación
docker-compose up -d --build

# Backup de base de datos
docker exec padelflow_db pg_dump -U padelflow padelflow_db > backup.sql
```

## 🌐 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil (requiere JWT)

### Complejos
- `GET /api/complejos` - Listar
- `GET /api/complejos/:id` - Detalle
- `POST /api/complejos` - Crear (dueños)
- `GET /api/complejos/my` - Mis complejos (dueños)

### Canchas
- `GET /api/canchas` - Listar
- `POST /api/canchas` - Crear (dueños)

### Turnos/Reservas
- `GET /api/turnos` - Listar
- `POST /api/turnos` - Crear reserva
- `GET /api/turnos/my` - Mis reservas
- `PATCH /api/turnos/:id/cancel` - Cancelar

Ver [API_EXAMPLES.md](API_EXAMPLES.md) para ejemplos detallados.

## 🔑 Roles de Usuario

### CLIENTE
- Explorar complejos
- Ver canchas disponibles
- Crear reservas
- Ver historial de reservas
- Cancelar reservas propias

### DUENO
- Crear y gestionar complejos
- Crear y gestionar canchas
- Ver calendario de reservas
- Dashboard con métricas
- Insights con IA (Gemini)

### ADMIN
- Acceso total (futuro)

## 📊 Modelos de Datos

### User
```typescript
{
  email: string
  password: string (hashed)
  nombre: string
  telefono: string
  rol: CLIENTE | DUENO | ADMIN
}
```

### Complejo
```typescript
{
  nombre: string
  ciudad: string
  direccion: string
  horario_apertura: string
  horario_cierre: string
  owner_id: User.id
}
```

### Cancha
```typescript
{
  nombre: string
  tipo: BLINDEX | TECHADA | DESCUBIERTA
  precio_hora: number
  complejo_id: Complejo.id
}
```

### Turno
```typescript
{
  fecha: Date
  hora_inicio: string
  hora_fin: string
  estado: DISPONIBLE | RESERVADO | PENDIENTE | CANCELADO
  precio: number
  sena_monto: number
  cancha_id: Cancha.id
  cliente_id: User.id (opcional)
}
```

## 🎯 Flujo de Usuario

### Cliente
1. Registro → Token JWT
2. Explorar complejos
3. Ver disponibilidad
4. Crear reserva → Estado PENDIENTE
5. Pagar seña → Estado RESERVADO
6. Ver historial

### Dueño
1. Registro como DUENO → Token JWT
2. Crear complejo
3. Agregar canchas
4. Ver dashboard
5. Gestionar reservas
6. Ver insights IA

## 🔒 Seguridad

- ✅ JWT con expiración de 7 días
- ✅ Contraseñas hasheadas (bcrypt, 10 rounds)
- ✅ Validación de datos (Zod)
- ✅ CORS configurado
- ✅ Headers de seguridad (Nginx)
- ✅ HTTPS automático (Cloudflare)
- ✅ Túnel cifrado (Cloudflare)
- ✅ Sin exposición de IP pública

## 📈 Monitoreo

### Cloudflare Dashboard
- Analytics de tráfico
- Logs de requests
- Métricas de performance
- Estado del túnel

### Aplicación
```bash
# Logs en tiempo real
docker-compose logs -f

# Logs del túnel
sudo journalctl -u cloudflared -f

# Estado de contenedores
docker-compose ps
docker stats
```

## 💾 Backups

### Manual
```bash
# Backup completo
docker exec padelflow_db pg_dump -U padelflow padelflow_db > backup_$(date +%Y%m%d).sql

# Restaurar
cat backup_20240115.sql | docker exec -i padelflow_db psql -U padelflow -d padelflow_db
```

### Automático (Cron)
```bash
# Agregar a crontab (backup diario a las 3am)
0 3 * * * docker exec padelflow_db pg_dump -U padelflow padelflow_db > ~/backups/backup_$(date +\%Y\%m\%d).sql
```

## 🆘 Troubleshooting Rápido

### Túnel no conecta
```bash
sudo systemctl restart cloudflared
sudo journalctl -u cloudflared -f
```

### Contenedores no inician
```bash
docker-compose down
docker-compose up -d --build
docker-compose logs -f
```

### Error 502
```bash
# Verificar que contenedores están corriendo
docker-compose ps

# Verificar puertos
netstat -tuln | grep -E '7000|7001'
```

### CORS Error
```bash
# Verificar variables de entorno
cat .env

# Reconstruir backend
docker-compose up -d --build backend
```

## 📚 Documentación

- **README.md** - Inicio
- **CLOUDFLARE_SETUP.md** - Guía completa de Cloudflare
- **CLOUDFLARE_CHECKLIST.md** - Checklist paso a paso
- **DEPLOYMENT.md** - Deployment tradicional
- **API_EXAMPLES.md** - Ejemplos de uso del API
- **PROJECT_STRUCTURE.md** - Estructura del proyecto

## ✨ Próximos Pasos

- [ ] Integración con Mercado Pago
- [ ] Sistema de reviews
- [ ] Notificaciones (email/SMS)
- [ ] App móvil (React Native)
- [ ] Analytics avanzado
- [ ] Integración Google Calendar

---

**URLs Finales:**
- Frontend: https://padelflow.bertium.net
- Backend: https://api.padelflow.bertium.net

**Repositorio:** [GitHub/GitLab URL aquí]

**Soporte:** Ver documentación o abrir issue en GitHub
