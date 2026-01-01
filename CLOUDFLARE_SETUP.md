# Configuración con Cloudflare Zero Trust - PadelFlow

Guía para deployar PadelFlow usando Cloudflare Zero Trust (Tunnel) con el dominio `padelflow.bertium.net`.

## Ventajas de Cloudflare Zero Trust

- ✅ No necesitas abrir puertos en tu router
- ✅ SSL/TLS automático (HTTPS gratis)
- ✅ Protección DDoS de Cloudflare
- ✅ No expones tu IP pública
- ✅ No necesitas configurar nginx reverse proxy
- ✅ Logs y analytics incluidos

## Arquitectura

```
Internet
   ↓
Cloudflare CDN (HTTPS)
   ↓
Cloudflare Tunnel (cifrado)
   ↓
Tu MiniPC (puertos locales 7000, 7001)
   ↓
Docker Containers
```

## URLs del Proyecto

- **Frontend:** `https://padelflow.bertium.net`
- **Backend API:** `https://api.padelflow.bertium.net`

## Requisitos Previos

1. Dominio `bertium.net` agregado a Cloudflare
2. Cloudflare Zero Trust configurado
3. `cloudflared` instalado en tu MiniPC

## Paso 1: Instalar Cloudflared en tu MiniPC

### En Linux (Debian/Ubuntu)

```bash
# Descargar e instalar
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Verificar instalación
cloudflared --version
```

### Otras plataformas

Para Windows, macOS u otras distribuciones: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

## Paso 2: Autenticar Cloudflared

```bash
# Autenticar con tu cuenta de Cloudflare
cloudflared tunnel login
```

Esto abrirá un navegador para que autorices el acceso. Selecciona el dominio `bertium.net`.

## Paso 3: Crear el Túnel

```bash
# Crear túnel llamado "padelflow"
cloudflared tunnel create padelflow

# Guardar el Tunnel ID que aparece
# Ejemplo: Created tunnel padelflow with id 12345678-1234-1234-1234-123456789abc
```

## Paso 4: Configurar el Túnel

Crear archivo de configuración:

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Agregar la siguiente configuración:

```yaml
tunnel: padelflow
credentials-file: /root/.cloudflared/<TU_TUNNEL_ID>.json

ingress:
  # Frontend - padelflow.bertium.net
  - hostname: padelflow.bertium.net
    service: http://localhost:7000
    originRequest:
      noTLSVerify: true

  # Backend API - api.padelflow.bertium.net
  - hostname: api.padelflow.bertium.net
    service: http://localhost:7001
    originRequest:
      noTLSVerify: true

  # Catch-all rule (requerido)
  - service: http_status:404
```

**Importante:** Reemplaza `<TU_TUNNEL_ID>` con el ID real de tu túnel.

## Paso 5: Crear Registros DNS en Cloudflare

```bash
# Frontend
cloudflared tunnel route dns padelflow padelflow.bertium.net

# Backend API
cloudflared tunnel route dns padelflow api.padelflow.bertium.net
```

Alternativamente, puedes crear los registros manualmente en el dashboard de Cloudflare:

### En Cloudflare Dashboard → DNS

1. **Registro para Frontend:**
   - Type: `CNAME`
   - Name: `padelflow`
   - Target: `<TU_TUNNEL_ID>.cfargotunnel.com`
   - Proxy status: Proxied (naranja)

2. **Registro para Backend API:**
   - Type: `CNAME`
   - Name: `api.padelflow`
   - Target: `<TU_TUNNEL_ID>.cfargotunnel.com`
   - Proxy status: Proxied (naranja)

## Paso 6: Configurar Variables de Entorno

En tu MiniPC, crear el archivo `.env`:

```bash
cd ~/padelflow
nano .env
```

Agregar:

```env
# Gemini API
GEMINI_API_KEY=tu_api_key_real_aqui

# JWT Secret (generar con: openssl rand -base64 32)
JWT_SECRET=un_secreto_super_seguro_aleatorio

# URLs para Cloudflare
FRONTEND_URL=https://padelflow.bertium.net
API_URL=https://api.padelflow.bertium.net
```

## Paso 7: Iniciar el Túnel

### Opción A: Ejecutar Manualmente

```bash
cloudflared tunnel run padelflow
```

### Opción B: Instalar como Servicio (Recomendado)

```bash
# Instalar el túnel como servicio systemd
sudo cloudflared service install

# Iniciar el servicio
sudo systemctl start cloudflared

# Habilitar inicio automático
sudo systemctl enable cloudflared

# Ver estado
sudo systemctl status cloudflared

# Ver logs
sudo journalctl -u cloudflared -f
```

## Paso 8: Deploy de la Aplicación

```bash
# En el directorio del proyecto
cd ~/padelflow

# Build y deploy
docker-compose up -d --build

# Verificar que todo está corriendo
docker-compose ps
```

## Verificar Configuración

### 1. Verificar Túnel

```bash
# Ver túneles activos
cloudflared tunnel list

# Ver información del túnel
cloudflared tunnel info padelflow
```

### 2. Verificar Contenedores Docker

```bash
docker-compose ps
docker-compose logs -f
```

### 3. Probar las URLs

```bash
# Frontend
curl https://padelflow.bertium.net

# Backend API
curl https://api.padelflow.bertium.net/health
```

## Configuración de CORS en el Backend

El backend ya está configurado para aceptar requests desde `https://padelflow.bertium.net` (ver [backend/src/index.ts](backend/src/index.ts)).

La variable `FRONTEND_URL` en [docker-compose.yml](docker-compose.yml:36) controla esto.

## Puertos Utilizados (Solo Locales)

Estos puertos **NO necesitan estar abiertos en tu router**, solo deben estar disponibles localmente en tu MiniPC:

- **7000** - Frontend (Nginx + React)
- **7001** - Backend API (Express)
- **7432** - PostgreSQL

El túnel de Cloudflare accede a estos puertos internamente y los expone a través de HTTPS.

## Troubleshooting

### Túnel no conecta

```bash
# Ver logs del túnel
sudo journalctl -u cloudflared -f

# Verificar conectividad
cloudflared tunnel info padelflow

# Reiniciar servicio
sudo systemctl restart cloudflared
```

### Error 502 Bad Gateway

Significa que Cloudflare no puede alcanzar tu aplicación:

```bash
# Verificar que los contenedores están corriendo
docker-compose ps

# Verificar logs
docker-compose logs frontend
docker-compose logs backend

# Verificar que los puertos están escuchando
netstat -tuln | grep -E '7000|7001'
```

### CORS Errors

Si ves errores de CORS en el navegador:

1. Verificar que `FRONTEND_URL` en `.env` es `https://padelflow.bertium.net`
2. Reconstruir el backend:
   ```bash
   docker-compose up -d --build backend
   ```

### DNS no resuelve

```bash
# Limpiar cache DNS local
sudo systemd-resolve --flush-caches

# Verificar DNS
dig padelflow.bertium.net
dig api.padelflow.bertium.net
```

## Configuración Avanzada (Opcional)

### Agregar Autenticación de Cloudflare Access

Para agregar una capa extra de seguridad:

1. En Cloudflare Zero Trust → Access → Applications
2. Crear nueva aplicación
3. Configurar políticas de acceso (email, grupos, etc.)

### WAF (Web Application Firewall)

En Cloudflare Dashboard → Security → WAF:

1. Habilitar reglas de seguridad
2. Configurar rate limiting
3. Agregar reglas personalizadas

### Cache de Cloudflare

Para mejorar performance:

1. En Cloudflare Dashboard → Caching → Configuration
2. Configurar TTL para assets estáticos
3. Habilitar "Always Online"

## Comandos Útiles

```bash
# Ver estado del túnel
sudo systemctl status cloudflared

# Ver logs del túnel
sudo journalctl -u cloudflared -f

# Reiniciar túnel
sudo systemctl restart cloudflared

# Detener túnel
sudo systemctl stop cloudflared

# Ver métricas del túnel
cloudflared tunnel info padelflow

# Listar todas las rutas
cloudflared tunnel route list
```

## Actualizar la Aplicación

```bash
# 1. Ir al directorio del proyecto
cd ~/padelflow

# 2. Actualizar código (git pull, rsync, etc.)

# 3. Reconstruir y reiniciar
docker-compose up -d --build

# 4. Verificar logs
docker-compose logs -f
```

El túnel de Cloudflare no necesita reiniciarse al actualizar la aplicación.

## Backup de Configuración

### Guardar configuración del túnel

```bash
# Copiar archivo de credenciales
sudo cp /root/.cloudflared/*.json ~/backup/

# Copiar configuración
sudo cp /etc/cloudflared/config.yml ~/backup/
```

### Restaurar en otra máquina

```bash
# Copiar archivos
sudo cp backup/*.json /root/.cloudflared/
sudo cp backup/config.yml /etc/cloudflared/

# Instalar servicio
sudo cloudflared service install

# Iniciar
sudo systemctl start cloudflared
```

## Costos

- **Cloudflare Zero Trust:** Gratis hasta 50 usuarios
- **Túnel:** Sin límite de tráfico
- **SSL/TLS:** Incluido gratis

## Soporte

- Documentación oficial: https://developers.cloudflare.com/cloudflare-one/
- Status de Cloudflare: https://www.cloudflarestatus.com/
- Community: https://community.cloudflare.com/

---

## Resumen de URLs Finales

Una vez configurado todo:

- **Frontend:** https://padelflow.bertium.net
- **Backend API:** https://api.padelflow.bertium.net
- **Health Check:** https://api.padelflow.bertium.net/health
- **Documentación API:** Ver [API_EXAMPLES.md](API_EXAMPLES.md)

**Nota:** Todas las URLs usan HTTPS automáticamente gracias a Cloudflare. No necesitas configurar certificados SSL manualmente.
