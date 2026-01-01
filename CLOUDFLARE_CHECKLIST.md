# Checklist de Deployment con Cloudflare Zero Trust

Guía rápida paso a paso para deployar PadelFlow en tu MiniPC usando Cloudflare Zero Trust.

## Pre-requisitos ✓

- [ ] Dominio `bertium.net` agregado a Cloudflare
- [ ] Cuenta de Cloudflare Zero Trust configurada
- [ ] MiniPC con Docker y Docker Compose instalados
- [ ] API Key de Google Gemini

## Paso 1: Instalar Cloudflared en tu MiniPC

```bash
# Descargar
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Instalar
sudo dpkg -i cloudflared-linux-amd64.deb

# Verificar
cloudflared --version
```

- [ ] Cloudflared instalado

## Paso 2: Autenticar y Crear Túnel

```bash
# Autenticar
cloudflared tunnel login

# Crear túnel (guarda el ID que aparece)
cloudflared tunnel create padelflow
```

- [ ] Autenticado con Cloudflare
- [ ] Túnel creado
- [ ] ID del túnel guardado: `_________________`

## Paso 3: Configurar el Túnel

```bash
# Crear directorio de configuración
sudo mkdir -p /etc/cloudflared

# Crear archivo de configuración
sudo nano /etc/cloudflared/config.yml
```

Pegar esta configuración (reemplazar `<TU_TUNNEL_ID>`):

```yaml
tunnel: padelflow
credentials-file: /root/.cloudflared/<TU_TUNNEL_ID>.json

ingress:
  - hostname: padelflow.bertium.net
    service: http://localhost:7000
    originRequest:
      noTLSVerify: true

  - hostname: api.padelflow.bertium.net
    service: http://localhost:7001
    originRequest:
      noTLSVerify: true

  - service: http_status:404
```

- [ ] Archivo de configuración creado
- [ ] Tunnel ID reemplazado correctamente

## Paso 4: Configurar DNS

```bash
# Crear registros DNS
cloudflared tunnel route dns padelflow padelflow.bertium.net
cloudflared tunnel route dns padelflow api.padelflow.bertium.net
```

**O manualmente en Cloudflare Dashboard:**

1. **Frontend:**
   - Type: `CNAME`
   - Name: `padelflow`
   - Target: `<TU_TUNNEL_ID>.cfargotunnel.com`
   - Proxy: Activado (naranja)

2. **Backend:**
   - Type: `CNAME`
   - Name: `api.padelflow`
   - Target: `<TU_TUNNEL_ID>.cfargotunnel.com`
   - Proxy: Activado (naranja)

- [ ] DNS configurado para `padelflow.bertium.net`
- [ ] DNS configurado para `api.padelflow.bertium.net`

## Paso 5: Instalar Túnel como Servicio

```bash
# Instalar servicio
sudo cloudflared service install

# Iniciar
sudo systemctl start cloudflared

# Habilitar inicio automático
sudo systemctl enable cloudflared

# Verificar estado
sudo systemctl status cloudflared
```

- [ ] Servicio instalado
- [ ] Servicio iniciado
- [ ] Inicio automático habilitado
- [ ] Estado: ✓ activo (running)

## Paso 6: Preparar la Aplicación

```bash
# Ir al directorio del proyecto
cd ~/padelflow

# Crear archivo .env
nano .env
```

Agregar:

```env
GEMINI_API_KEY=tu_api_key_real
JWT_SECRET=un_secreto_super_seguro  # Generar con: openssl rand -base64 32
FRONTEND_URL=https://padelflow.bertium.net
API_URL=https://api.padelflow.bertium.net
```

- [ ] Archivo `.env` creado
- [ ] `GEMINI_API_KEY` configurada
- [ ] `JWT_SECRET` configurado (aleatorio y seguro)
- [ ] URLs de Cloudflare configuradas

## Paso 7: Deploy con Docker

```bash
# Build y deploy
docker-compose up -d --build

# Verificar contenedores
docker-compose ps

# Ver logs
docker-compose logs -f
```

- [ ] Build completado sin errores
- [ ] 3 contenedores corriendo (postgres, backend, frontend)
- [ ] Logs sin errores críticos

## Paso 8: Verificación

### Verificar Túnel

```bash
# Ver estado del túnel
sudo systemctl status cloudflared

# Ver información del túnel
cloudflared tunnel info padelflow

# Ver logs
sudo journalctl -u cloudflared -f
```

- [ ] Túnel conectado
- [ ] Sin errores en logs

### Verificar Aplicación

```bash
# Health check del backend
curl https://api.padelflow.bertium.net/health

# Frontend
curl https://padelflow.bertium.net
```

- [ ] Backend responde en `https://api.padelflow.bertium.net/health`
- [ ] Frontend carga en `https://padelflow.bertium.net`

### Verificar en Navegador

Abrir en el navegador:

1. `https://padelflow.bertium.net`
2. `https://api.padelflow.bertium.net/health`

- [ ] Frontend carga correctamente en el navegador
- [ ] Backend health check responde con JSON
- [ ] Certificado SSL válido (candado verde)
- [ ] No hay errores de CORS en la consola del navegador

## Paso 9: Probar Funcionalidad

### Registrar un usuario de prueba

En el navegador o con curl:

```bash
curl -X POST https://api.padelflow.bertium.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@padelflow.com",
    "password": "password123",
    "nombre": "Usuario Prueba",
    "telefono": "3856000111",
    "rol": "CLIENTE"
  }'
```

- [ ] Usuario registrado exitosamente
- [ ] Token JWT recibido
- [ ] Login funciona correctamente

## Paso 10: Configuración Adicional (Opcional)

### Backup Automático

```bash
# Crear script de backup
nano ~/backup_padelflow.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
docker exec padelflow_db pg_dump -U padelflow padelflow_db > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
```

```bash
# Dar permisos
chmod +x ~/backup_padelflow.sh

# Agregar a crontab (backup diario a las 3am)
crontab -e
# Agregar: 0 3 * * * ~/backup_padelflow.sh
```

- [ ] Script de backup creado
- [ ] Cron job configurado

### Monitoreo

- [ ] Configurar alertas en Cloudflare
- [ ] Configurar logs en Cloudflare Analytics

## Troubleshooting

### Si algo no funciona:

1. **Verificar túnel:**
   ```bash
   sudo systemctl status cloudflared
   sudo journalctl -u cloudflared -f
   ```

2. **Verificar contenedores:**
   ```bash
   docker-compose ps
   docker-compose logs
   ```

3. **Verificar DNS:**
   ```bash
   dig padelflow.bertium.net
   dig api.padelflow.bertium.net
   ```

4. **Verificar puertos locales:**
   ```bash
   netstat -tuln | grep -E '7000|7001'
   ```

## Comandos Útiles

```bash
# Reiniciar túnel
sudo systemctl restart cloudflared

# Reiniciar aplicación
docker-compose restart

# Ver logs del túnel
sudo journalctl -u cloudflared -f

# Ver logs de la aplicación
docker-compose logs -f

# Backup manual
docker exec padelflow_db pg_dump -U padelflow padelflow_db > backup.sql
```

## URLs Finales

Una vez completado:

- **Frontend:** https://padelflow.bertium.net
- **Backend API:** https://api.padelflow.bertium.net
- **Health Check:** https://api.padelflow.bertium.net/health

## Próximos Pasos

- [ ] Crear usuarios de prueba (cliente y dueño)
- [ ] Probar flujo completo de reserva
- [ ] Configurar backups automáticos
- [ ] Monitorear logs y performance
- [ ] Compartir la aplicación con usuarios reales

---

**¡Felicidades!** Tu aplicación PadelFlow está deployada y accesible desde internet de forma segura con Cloudflare Zero Trust.
