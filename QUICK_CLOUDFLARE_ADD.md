# Agregar PadelFlow a tu Túnel de Cloudflare Existente

Ya tienes Cloudflare Zero Trust configurado. Solo necesitas agregar las rutas para PadelFlow.

## Opción 1: Agregar a tu Túnel Existente (Recomendado)

### 1. Editar la Configuración del Túnel

```bash
# Editar tu configuración existente
sudo nano /etc/cloudflared/config.yml
```

### 2. Agregar las Rutas de PadelFlow

Agregar estas líneas en la sección `ingress:` (ANTES de la regla catch-all):

```yaml
ingress:
  # ... tus otras rutas existentes ...

  # PadelFlow Frontend
  - hostname: padelflow.bertium.net
    service: http://localhost:7000
    originRequest:
      noTLSVerify: true

  # PadelFlow Backend API
  - hostname: api.padelflow.bertium.net
    service: http://localhost:7001
    originRequest:
      noTLSVerify: true

  # Catch-all (debe estar al final)
  - service: http_status:404
```

**Ejemplo de configuración completa:**

```yaml
tunnel: tu-tunnel-existente
credentials-file: /root/.cloudflared/tu-tunnel-id.json

ingress:
  # Tus sitios existentes
  - hostname: sitio1.bertium.net
    service: http://localhost:8080

  - hostname: sitio2.bertium.net
    service: http://localhost:8081

  # PadelFlow (NUEVO)
  - hostname: padelflow.bertium.net
    service: http://localhost:7000
    originRequest:
      noTLSVerify: true

  - hostname: api.padelflow.bertium.net
    service: http://localhost:7001
    originRequest:
      noTLSVerify: true

  # Catch-all (siempre al final)
  - service: http_status:404
```

### 3. Crear los Registros DNS en Cloudflare

#### Opción A: Via CLI

```bash
# Reemplaza "tu-tunnel-existente" con el nombre de tu túnel
cloudflared tunnel route dns tu-tunnel-existente padelflow.bertium.net
cloudflared tunnel route dns tu-tunnel-existente api.padelflow.bertium.net
```

#### Opción B: Via Dashboard de Cloudflare (Más fácil)

1. Ir a **Cloudflare Dashboard** → **bertium.net** → **DNS**

2. **Agregar registro para Frontend:**
   - Click en **"Add record"**
   - Type: `CNAME`
   - Name: `padelflow`
   - Target: `tu-tunnel-id.cfargotunnel.com` (mismo que tus otros sitios)
   - Proxy status: **Proxied** (nube naranja)
   - Click **Save**

3. **Agregar registro para Backend:**
   - Click en **"Add record"**
   - Type: `CNAME`
   - Name: `api.padelflow`
   - Target: `tu-tunnel-id.cfargotunnel.com` (mismo target)
   - Proxy status: **Proxied** (nube naranja)
   - Click **Save**

### 4. Reiniciar el Túnel

```bash
# Reiniciar para aplicar la nueva configuración
sudo systemctl restart cloudflared

# Verificar que está corriendo
sudo systemctl status cloudflared

# Ver logs para confirmar que cargó las nuevas rutas
sudo journalctl -u cloudflared -f
```

Deberías ver en los logs algo como:
```
Registered tunnel connection
padelflow.bertium.net -> http://localhost:7000
api.padelflow.bertium.net -> http://localhost:7001
```

### 5. Deploy de la Aplicación PadelFlow

```bash
# Ir al directorio del proyecto
cd ~/padelflow

# Crear archivo .env
nano .env
```

Agregar:

```env
GEMINI_API_KEY=tu_api_key_real
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=https://padelflow.bertium.net
API_URL=https://api.padelflow.bertium.net
```

```bash
# Guardar (Ctrl+O, Enter, Ctrl+X)

# Deploy con Docker
docker-compose up -d --build

# Verificar que los contenedores están corriendo
docker-compose ps
```

### 6. Verificar que Todo Funciona

```bash
# Verificar túnel
sudo systemctl status cloudflared

# Verificar contenedores
docker-compose ps

# Probar las URLs
curl https://api.padelflow.bertium.net/health
curl https://padelflow.bertium.net
```

### 7. Probar en el Navegador

1. Ir a `https://padelflow.bertium.net`
2. Ir a `https://api.padelflow.bertium.net/health`

Deberías ver:
- ✅ Certificado SSL válido (candado verde)
- ✅ Frontend carga correctamente
- ✅ Backend responde con JSON

---

## Opción 2: Crear un Túnel Separado para PadelFlow

Si prefieres tener un túnel separado para PadelFlow:

```bash
# Crear nuevo túnel
cloudflared tunnel create padelflow

# Crear configuración específica
sudo nano /etc/cloudflared/padelflow.yml
```

```yaml
tunnel: padelflow
credentials-file: /root/.cloudflared/NUEVO-TUNNEL-ID.json

ingress:
  - hostname: padelflow.bertium.net
    service: http://localhost:7000
  - hostname: api.padelflow.bertium.net
    service: http://localhost:7001
  - service: http_status:404
```

```bash
# Ejecutar el nuevo túnel
cloudflared tunnel --config /etc/cloudflared/padelflow.yml run padelflow
```

**Nota:** Esta opción es más compleja si ya tienes un túnel funcionando. Recomiendo usar la Opción 1.

---

## Resumen de Pasos Mínimos

Si ya tienes todo configurado:

1. ✅ Editar `/etc/cloudflared/config.yml` (agregar 2 rutas)
2. ✅ Crear 2 registros DNS CNAME en Cloudflare Dashboard
3. ✅ Reiniciar cloudflared: `sudo systemctl restart cloudflared`
4. ✅ Crear archivo `.env` en el proyecto
5. ✅ Deploy: `docker-compose up -d --build`
6. ✅ Verificar en navegador

**Tiempo estimado:** 5-10 minutos

---

## Verificación Rápida

```bash
# 1. Ver configuración actual del túnel
cat /etc/cloudflared/config.yml

# 2. Ver estado del túnel
sudo systemctl status cloudflared

# 3. Ver logs
sudo journalctl -u cloudflared -n 50

# 4. Ver contenedores Docker
docker-compose ps

# 5. Probar endpoints
curl https://api.padelflow.bertium.net/health
```

---

## Troubleshooting Rápido

### Error 502 Bad Gateway

Significa que Cloudflare no puede conectarse a los puertos locales:

```bash
# Verificar que los contenedores están corriendo en los puertos correctos
netstat -tuln | grep -E '7000|7001'
docker-compose ps

# Reiniciar contenedores si es necesario
docker-compose restart
```

### DNS no resuelve

```bash
# Verificar DNS
dig padelflow.bertium.net
dig api.padelflow.bertium.net

# Debería mostrar CNAME apuntando a .cfargotunnel.com
```

### Túnel no reconoce las nuevas rutas

```bash
# Ver configuración cargada
sudo journalctl -u cloudflared -n 100 | grep ingress

# Reiniciar túnel
sudo systemctl restart cloudflared
```

---

## Comandos Útiles

```bash
# Ver túneles activos
cloudflared tunnel list

# Ver info de tu túnel
cloudflared tunnel info NOMBRE-DE-TU-TUNNEL

# Ver rutas configuradas
cloudflared tunnel route list

# Ver logs en tiempo real
sudo journalctl -u cloudflared -f
```

---

## ¿Qué Puerto Usa Cada Servicio?

En tu MiniPC (localhost):
- **7000** → Frontend (padelflow.bertium.net)
- **7001** → Backend API (api.padelflow.bertium.net)
- **7432** → PostgreSQL (solo interno, no expuesto)

---

## Siguiente Paso

Una vez que todo esté funcionando:

1. Registrar un usuario de prueba en `https://padelflow.bertium.net`
2. Probar el login
3. Explorar la interfaz

Ver [API_EXAMPLES.md](API_EXAMPLES.md) para ejemplos de uso del API.
