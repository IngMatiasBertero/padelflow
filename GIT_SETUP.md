# Guía de Git y GitHub - PadelFlow

## Subir el Proyecto a GitHub

### Paso 1: Crear Repositorio en GitHub

1. Ir a https://github.com
2. Click en el botón **"+"** (arriba derecha) → **"New repository"**
3. Configurar:
   - Repository name: `padelflow`
   - Description: "Sistema de reservas de canchas de padel"
   - Visibility: **Private** (recomendado) o Public
   - **NO** marcar "Initialize this repository with a README" (ya tienes uno)
4. Click en **"Create repository"**

Guardar la URL que aparece, por ejemplo:
```
https://github.com/tu-usuario/padelflow.git
```

### Paso 2: Inicializar Git Localmente

En tu máquina Windows, abre Git Bash o PowerShell en el directorio del proyecto:

```bash
# Ir al directorio del proyecto
cd "C:\Users\Matias\Documents\Proyecto PadelFlow"

# Inicializar repositorio Git
git init

# Verificar que .gitignore está correcto
cat .gitignore
```

### Paso 3: Crear archivo .env en .gitignore (Verificar)

**IMPORTANTE:** Verificar que `.env` está en `.gitignore` para NO subir tus secretos:

```bash
# Verificar que .env está ignorado
grep ".env" .gitignore
```

Deberías ver:
```
.env
.env.local
.env.*.local
backend/.env
```

✅ Si está ahí, perfecto. Si no, agrégalo.

### Paso 4: Agregar Archivos y Hacer Commit

```bash
# Agregar todos los archivos
git add .

# Ver qué se va a commitear (verificar que .env NO aparece)
git status

# Crear el primer commit
git commit -m "Initial commit: PadelFlow - Sistema de reservas de canchas de padel

- Frontend: React 19 + Vite + TailwindCSS
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL 16
- Docker deployment con Cloudflare Zero Trust
- Autenticación JWT
- Documentación completa"
```

### Paso 5: Conectar con GitHub y Subir

```bash
# Agregar el repositorio remoto (reemplaza con TU URL)
git remote add origin https://github.com/tu-usuario/padelflow.git

# Verificar que se agregó correctamente
git remote -v

# Subir a GitHub
git branch -M main
git push -u origin main
```

Si te pide autenticación:
- **Usuario:** tu-usuario-github
- **Password:** Necesitas un **Personal Access Token** (no tu password)

#### Crear Personal Access Token

1. GitHub → Settings (tu perfil) → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Permisos: Marcar **"repo"**
5. Generate token
6. **COPIAR EL TOKEN** (solo se muestra una vez)
7. Usar ese token como password al hacer `git push`

### Paso 6: Verificar en GitHub

Ve a `https://github.com/tu-usuario/padelflow` y verifica que todos los archivos están ahí.

**Verificar que NO esté el archivo `.env`** (por seguridad).

---

## 📥 Clonar en tu MiniPC

### Paso 1: Instalar Git (si no lo tienes)

```bash
# En Ubuntu/Debian
sudo apt update
sudo apt install git

# Verificar instalación
git --version
```

### Paso 2: Clonar el Repositorio

```bash
# Ir al directorio home
cd ~

# Clonar el repositorio
git clone https://github.com/tu-usuario/padelflow.git

# Entrar al directorio
cd padelflow

# Ver archivos
ls -la
```

### Paso 3: Crear archivo .env

**IMPORTANTE:** El archivo `.env` NO se sube a GitHub por seguridad, así que debes crearlo manualmente:

```bash
# Crear archivo .env
nano .env
```

Agregar el contenido:

```env
# Gemini API Key
GEMINI_API_KEY=tu_api_key_aqui

# JWT Secret (generar uno nuevo con: openssl rand -base64 32)
JWT_SECRET=secreto_super_seguro_aleatorio

# URLs de Cloudflare
FRONTEND_URL=https://padelflow.bertium.net
API_URL=https://api.padelflow.bertium.net
```

Guardar: `Ctrl+O`, `Enter`, `Ctrl+X`

### Paso 4: Deploy

```bash
# Verificar que Docker está corriendo
docker --version
docker-compose --version

# Build y deploy
docker-compose up -d --build

# Verificar
docker-compose ps
docker-compose logs -f
```

---

## 🔄 Flujo de Trabajo para Actualizaciones

### Desde Windows (Desarrollo)

```bash
# Hacer cambios en el código...

# Ver qué cambió
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

### En tu MiniPC (Producción)

```bash
# Ir al directorio del proyecto
cd ~/padelflow

# Descargar cambios
git pull

# Reconstruir y reiniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

---

## 📋 Comandos Útiles de Git

```bash
# Ver estado
git status

# Ver historial de commits
git log --oneline

# Ver cambios antes de commitear
git diff

# Deshacer cambios no commiteados
git checkout -- archivo.txt

# Ver archivos ignorados
git status --ignored

# Ver ramas
git branch

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main

# Merge de rama
git merge feature/nueva-funcionalidad
```

---

## 🔐 Seguridad

### Archivos que NUNCA debes subir a GitHub

Estos ya están en `.gitignore`:

- ✅ `.env` - Variables de entorno con secretos
- ✅ `.env.local` - Variables locales
- ✅ `node_modules/` - Dependencias (muy pesado)
- ✅ `dist/` - Builds (se generan automáticamente)
- ✅ `postgres_data/` - Datos de la base de datos
- ✅ `*.log` - Archivos de logs
- ✅ `backup_*.sql` - Backups de base de datos

### Qué pasa si accidentalmente subes .env

Si subiste `.env` por error:

```bash
# 1. Eliminar del repositorio (pero mantener local)
git rm --cached .env

# 2. Asegurarse que está en .gitignore
echo ".env" >> .gitignore

# 3. Commit
git commit -m "Remove .env from repository"

# 4. Push
git push

# 5. IMPORTANTE: Cambiar todos los secretos (JWT_SECRET, API keys, etc.)
# porque ya fueron expuestos
```

---

## 📁 Estructura Recomendada de Branches

### Para desarrollo profesional:

```bash
# Rama principal (producción)
main

# Rama de desarrollo
git checkout -b develop

# Features nuevos
git checkout -b feature/nombre-feature

# Bugfixes
git checkout -b fix/nombre-bug

# Releases
git checkout -b release/v1.0.0
```

### Flujo básico:

1. Desarrollar en `feature/nueva-cosa`
2. Merge a `develop` para testing
3. Cuando esté listo, merge a `main`
4. Deploy desde `main` en producción

---

## 🚀 GitHub Actions (CI/CD Opcional)

Crear archivo `.github/workflows/deploy.yml` para auto-deploy:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to MiniPC
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.MINIPC_HOST }}
          username: ${{ secrets.MINIPC_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ~/padelflow
            git pull
            docker-compose up -d --build
```

---

## 📝 Ejemplo de README para GitHub

Tu proyecto ya tiene un buen README, pero puedes agregar badges:

```markdown
# PadelFlow

![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Node](https://img.shields.io/badge/Node.js-20-green)

Sistema de reservas de canchas de padel...
```

---

## 🎯 Checklist para el Primer Push

- [ ] `.env` está en `.gitignore`
- [ ] No hay contraseñas en el código
- [ ] No hay API keys hardcodeadas
- [ ] `node_modules/` está ignorado
- [ ] Archivos temporales ignorados
- [ ] README.md actualizado
- [ ] Documentación completa incluida
- [ ] Licencia agregada (opcional)

---

## 📞 Comandos de Emergencia

### Olvidé agregar algo al último commit

```bash
git add archivo-olvidado.txt
git commit --amend --no-edit
git push -f
```

### Quiero deshacer el último commit (pero mantener cambios)

```bash
git reset --soft HEAD~1
```

### Quiero eliminar todos los cambios y volver al último commit

```bash
git reset --hard HEAD
```

### Clonar solo la rama main (más rápido)

```bash
git clone --single-branch --branch main https://github.com/tu-usuario/padelflow.git
```

---

## 🌟 Tips Profesionales

1. **Commits pequeños y frecuentes** - Mejor que commits gigantes
2. **Mensajes descriptivos** - "Fix bug" ❌ vs "Fix login error when password is empty" ✅
3. **No commitear código comentado** - Bórralo, Git lo guarda
4. **Revisar antes de push** - `git diff` y `git status`
5. **Usar branches** - No trabajar directo en `main`

---

## 🔗 URLs Útiles

- **Tu repositorio:** `https://github.com/tu-usuario/padelflow`
- **GitHub Desktop:** https://desktop.github.com/ (GUI para Git)
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Conventional Commits:** https://www.conventionalcommits.org/
