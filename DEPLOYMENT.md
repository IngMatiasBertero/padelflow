# Guía de Deployment - PadelFlow

Sistema completo de reservas de canchas de padel con autenticación, base de datos PostgreSQL y paneles diferenciados para clientes y dueños.

## Stack Tecnológico

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- TailwindCSS
- Nginx (servidor de producción)

### Backend
- Node.js 20 + TypeScript
- Express (API REST)
- Prisma ORM
- JWT para autenticación
- Bcrypt para contraseñas

### Base de Datos
- PostgreSQL 16

## Arquitectura del Sistema

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │   Backend API   │      │   PostgreSQL    │
│   (Puerto 7000) │─────▶│   (Puerto 7001) │─────▶│   (Puerto 7432) │
│   Nginx + React │      │   Express + JWT │      │   Base de Datos │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Requisitos Previos

- Docker y Docker Compose instalados en tu VPS
- Puertos disponibles: 7000, 7001, 7432
- API Key de Google Gemini (para insights con IA)

## Archivos de Configuración

### Frontend
- **Dockerfile**: Build de React + Nginx
- **nginx.conf**: Servidor web con SPA routing

### Backend
- **backend/Dockerfile**: Build de Node.js + Express
- **backend/prisma/schema.prisma**: Schema de base de datos

### Docker Compose
- **docker-compose.yml**: Orquestación de 3 servicios (PostgreSQL, Backend, Frontend)

## Pasos para Deployment

### 1. Preparar el entorno en tu VPS

```bash
# Conectarse a tu VPS
ssh usuario@tu-vps-ip

# Crear directorio para el proyecto
mkdir -p ~/padelflow
cd ~/padelflow
```

### 2. Transferir archivos al VPS

Desde tu máquina local:

```bash
# Opción A: Usando rsync (recomendado)
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  /c/Users/Matias/Documents/Proyecto\ PadelFlow/ \
  usuario@tu-vps-ip:~/padelflow/

# Opción B: Usando SCP
scp -r /c/Users/Matias/Documents/Proyecto\ PadelFlow/* \
  usuario@tu-vps-ip:~/padelflow/
```

### 3. Configurar variables de entorno

En tu VPS, crear archivo `.env` en la raíz del proyecto:

```bash
cd ~/padelflow
nano .env
```

Agregar las siguientes variables:

```env
# Gemini API (para insights con IA)
GEMINI_API_KEY=tu_api_key_real_aqui

# JWT Secret (IMPORTANTE: Cambiar en producción)
JWT_SECRET=un_secreto_super_seguro_aleatorio_cambiar_en_produccion_$(openssl rand -base64 32)
```

**Nota:** El `JWT_SECRET` debe ser una cadena aleatoria y segura. Puedes generarla con:
```bash
openssl rand -base64 32
```

### 4. Build y Deploy

```bash
# Build de la imagen
docker-compose build

# Levantar el contenedor
docker-compose up -d

# Verificar que está corriendo
docker-compose ps
docker-compose logs -f
```

### 5. Verificar el deployment

```bash
# Verificar que los 3 contenedores están corriendo
docker ps | grep padelflow

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Verificar salud de la API
curl http://localhost:7001/health

# Verificar frontend
curl http://localhost:7000
```

## Acceso a la Aplicación

Una vez deployado, acceder desde:

### Frontend (Interfaz de usuario)
- Localmente en el VPS: `http://localhost:7000`
- Desde internet: `http://tu-vps-ip:7000`

### Backend API
- Localmente en el VPS: `http://localhost:7001/api`
- Desde internet: `http://tu-vps-ip:7001/api`
- Health check: `http://tu-vps-ip:7001/health`

### Base de Datos
- Host: `localhost`
- Puerto: `7432`
- Usuario: `padelflow`
- Password: `padelflow_password`
- Database: `padelflow_db`

**Nota:** Para conectarse desde fuera del VPS, usa un cliente PostgreSQL con estos datos.

## Comandos Útiles

### Gestión de Contenedores

```bash
# Ver logs en tiempo real de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart backend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose down -v

# Reconstruir y reiniciar
docker-compose up -d --build

# Ver uso de recursos
docker stats
```

### Gestión de Base de Datos

```bash
# Acceder a PostgreSQL desde línea de comandos
docker exec -it padelflow_db psql -U padelflow -d padelflow_db

# Backup de base de datos
docker exec padelflow_db pg_dump -U padelflow padelflow_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup_20240115.sql | docker exec -i padelflow_db psql -U padelflow -d padelflow_db

# Ver tablas en la base de datos
docker exec -it padelflow_db psql -U padelflow -d padelflow_db -c "\dt"
```

### Migraciones de Prisma

```bash
# Ejecutar migraciones pendientes
docker exec -it padelflow_backend npx prisma migrate deploy

# Ver estado de migraciones
docker exec -it padelflow_backend npx prisma migrate status

# Abrir Prisma Studio (interfaz gráfica para la BD)
docker exec -it padelflow_backend npx prisma studio
```

## Actualizar la Aplicación

```bash
# 1. Transferir archivos actualizados al VPS
# 2. Reconstruir la imagen
docker-compose build

# 3. Reiniciar con la nueva imagen
docker-compose up -d
```

## Troubleshooting

### Los contenedores no inician

```bash
# Ver logs detallados de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs postgres

# Verificar puertos ocupados
netstat -tuln | grep -E '7000|7001|7432'
```

### Error de conexión a base de datos

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar health check
docker inspect padelflow_db | grep -A 10 Health

# Reiniciar solo la base de datos
docker-compose restart postgres
```

### Error en migraciones de Prisma

```bash
# Ver estado de migraciones
docker exec -it padelflow_backend npx prisma migrate status

# Resetear base de datos (CUIDADO: borra todos los datos)
docker-compose down -v
docker-compose up -d

# O ejecutar migraciones manualmente
docker exec -it padelflow_backend npx prisma migrate deploy
```

### Backend no responde

```bash
# Verificar logs del backend
docker-compose logs backend

# Verificar que puede conectarse a la base de datos
docker exec -it padelflow_backend npx prisma db pull

# Reiniciar backend
docker-compose restart backend
```

### Frontend no carga o da error 404

```bash
# Verificar logs de nginx
docker-compose logs frontend

# Verificar que los archivos fueron construidos
docker exec -it padelflow_frontend ls -la /usr/share/nginx/html

# Reconstruir frontend
docker-compose up -d --build frontend
```

### Error de API Key

```bash
# Verificar que las variables están configuradas
cat .env

# Reconstruir con las nuevas variables
docker-compose down
docker-compose up -d --build
```

### Puertos ocupados

Si algún puerto está ocupado, editar [docker-compose.yml](docker-compose.yml):

```yaml
# Frontend (cambiar 7000 por otro puerto)
frontend:
  ports:
    - "7002:80"  # Usar puerto 7002 en lugar de 7000

# Backend (cambiar 7001 por otro puerto)
backend:
  ports:
    - "7003:3000"  # Usar puerto 7003 en lugar de 7001

# PostgreSQL (cambiar 7432 por otro puerto)
postgres:
  ports:
    - "7433:5432"  # Usar puerto 7433 en lugar de 7432
```

## Configuración de Firewall

Si usas un firewall, permitir los puertos necesarios:

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 7000/tcp   # Frontend
sudo ufw allow 7001/tcp   # Backend API
sudo ufw allow 7432/tcp   # PostgreSQL (solo si necesitas acceso externo)

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=7000/tcp
sudo firewall-cmd --permanent --add-port=7001/tcp
sudo firewall-cmd --permanent --add-port=7432/tcp
sudo firewall-cmd --reload
```

**Nota de Seguridad:** Solo exponer el puerto 7432 (PostgreSQL) si realmente necesitas acceder a la base de datos desde fuera del servidor. Para uso normal, solo necesitas los puertos 7000 y 7001.

## Nginx Reverse Proxy (Opcional)

Para usar un dominio personalizado, instalar y configurar nginx en el host:

```bash
# Instalar nginx en el host (no en Docker)
sudo apt install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/padelflow
```

Agregar la siguiente configuración:

```nginx
# Frontend
server {
    listen 80;
    server_name padelflow.tudominio.com;

    location / {
        proxy_pass http://localhost:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.padelflow.tudominio.com;

    location / {
        proxy_pass http://localhost:7001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar la configuración:

```bash
# Crear symlink
sudo ln -s /etc/nginx/sites-available/padelflow /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar nginx
sudo systemctl reload nginx
```

## Configuración SSL con Let's Encrypt (Opcional)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificados SSL
sudo certbot --nginx -d padelflow.tudominio.com -d api.padelflow.tudominio.com

# Renovación automática (certbot lo configura automáticamente)
# Verificar con:
sudo certbot renew --dry-run
```

## Estructura de URLs con Dominio

Con nginx reverse proxy y SSL:

- Frontend: `https://padelflow.tudominio.com`
- Backend API: `https://api.padelflow.tudominio.com`
- Documentación API: `https://api.padelflow.tudominio.com/health`

## Notas de Seguridad

### Producción

- **JWT_SECRET**: Usar una cadena aleatoria fuerte (generada con `openssl rand -base64 32`)
- **Variables de entorno**: No commitear archivos `.env` al repositorio
- **PostgreSQL**: Cambiar la contraseña por defecto en producción
- **Firewall**: Solo exponer puertos necesarios (7000, 7001)
- **SSL/TLS**: Usar HTTPS en producción (Let's Encrypt)
- **Backups**: Configurar backups automáticos de la base de datos

### Recomendaciones

- Mantener Docker y las imágenes actualizadas
- Monitorear logs regularmente
- Configurar límites de rate limiting en el backend
- Implementar monitoreo (ej: Prometheus + Grafana)
- Considerar usar Docker secrets en lugar de variables de entorno para datos sensibles

## Datos de Prueba

Para poblar la base de datos con datos de ejemplo, puedes ejecutar:

```bash
# Conectarse a la base de datos
docker exec -it padelflow_db psql -U padelflow -d padelflow_db

# Crear un usuario de prueba (cliente)
INSERT INTO users (id, email, password, nombre, telefono, rol)
VALUES (
  'test_client_1',
  'cliente@test.com',
  '$2b$10$example_hash',  -- password: "password123"
  'Juan Pérez',
  '3856000111',
  'CLIENTE'
);

# Crear un usuario dueño
INSERT INTO users (id, email, password, nombre, telefono, rol)
VALUES (
  'test_owner_1',
  'dueno@test.com',
  '$2b$10$example_hash',  -- password: "password123"
  'Carlos Dueño',
  '3856000222',
  'DUENO'
);
```

**Nota:** Para generar el hash de contraseña correcto, usa el endpoint de registro de la API o genera el hash con bcrypt.
