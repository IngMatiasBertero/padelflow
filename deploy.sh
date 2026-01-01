#!/bin/bash

# Script de Deployment para PadelFlow
# Uso: ./deploy.sh [command]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funciones de utilidad
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Verificar que Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose no está instalado"
        exit 1
    fi

    print_success "Docker está instalado correctamente"
}

# Verificar variables de entorno
check_env() {
    if [ ! -f .env ]; then
        print_error "Archivo .env no encontrado"
        print_info "Creando .env desde .env.example..."

        if [ -f backend/.env.example ]; then
            cp backend/.env.example .env
            print_info "Por favor edita el archivo .env con tus valores"
            exit 1
        else
            print_error "Archivo .env.example no encontrado"
            exit 1
        fi
    fi

    print_success "Archivo .env encontrado"
}

# Build de todos los servicios
build() {
    print_info "Construyendo imágenes Docker..."
    docker-compose build
    print_success "Build completado"
}

# Iniciar servicios
start() {
    print_info "Iniciando servicios..."
    docker-compose up -d
    print_success "Servicios iniciados"

    print_info "Esperando que los servicios estén listos..."
    sleep 5

    status
}

# Detener servicios
stop() {
    print_info "Deteniendo servicios..."
    docker-compose down
    print_success "Servicios detenidos"
}

# Reiniciar servicios
restart() {
    print_info "Reiniciando servicios..."
    docker-compose restart
    print_success "Servicios reiniciados"
}

# Ver estado de servicios
status() {
    echo ""
    print_info "Estado de los servicios:"
    docker-compose ps
    echo ""
}

# Ver logs
logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Deploy completo
deploy() {
    check_docker
    check_env

    print_info "Iniciando deployment completo..."

    build
    start

    echo ""
    print_success "Deployment completado!"
    echo ""
    print_info "Accede a la aplicación en:"
    echo "  Frontend: http://localhost:7000"
    echo "  Backend:  http://localhost:7001"
    echo "  Health:   http://localhost:7001/health"
    echo ""
}

# Limpiar todo (incluyendo volúmenes)
clean() {
    print_info "¿Estás seguro de que quieres eliminar todos los contenedores y volúmenes? (s/n)"
    read -r response

    if [ "$response" = "s" ]; then
        print_info "Eliminando contenedores y volúmenes..."
        docker-compose down -v
        print_success "Limpieza completada"
    else
        print_info "Operación cancelada"
    fi
}

# Backup de base de datos
backup() {
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    print_info "Creando backup de la base de datos..."

    docker exec padelflow_db pg_dump -U padelflow padelflow_db > "$BACKUP_FILE"

    print_success "Backup creado: $BACKUP_FILE"
}

# Restaurar base de datos desde backup
restore() {
    if [ -z "$1" ]; then
        print_error "Uso: ./deploy.sh restore <archivo_backup.sql>"
        exit 1
    fi

    if [ ! -f "$1" ]; then
        print_error "Archivo de backup no encontrado: $1"
        exit 1
    fi

    print_info "Restaurando base de datos desde $1..."
    cat "$1" | docker exec -i padelflow_db psql -U padelflow -d padelflow_db
    print_success "Base de datos restaurada"
}

# Ejecutar migraciones de Prisma
migrate() {
    print_info "Ejecutando migraciones de Prisma..."
    docker exec -it padelflow_backend npx prisma migrate deploy
    print_success "Migraciones completadas"
}

# Abrir Prisma Studio
studio() {
    print_info "Abriendo Prisma Studio..."
    print_info "Accede en: http://localhost:5555"
    docker exec -it padelflow_backend npx prisma studio
}

# Ver ayuda
help() {
    echo "Script de Deployment para PadelFlow"
    echo ""
    echo "Uso: ./deploy.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  deploy      - Build y deploy completo"
    echo "  build       - Construir imágenes Docker"
    echo "  start       - Iniciar servicios"
    echo "  stop        - Detener servicios"
    echo "  restart     - Reiniciar servicios"
    echo "  status      - Ver estado de servicios"
    echo "  logs [srv]  - Ver logs (opcional: especificar servicio)"
    echo "  clean       - Eliminar contenedores y volúmenes"
    echo "  backup      - Crear backup de la base de datos"
    echo "  restore <f> - Restaurar base de datos desde backup"
    echo "  migrate     - Ejecutar migraciones de Prisma"
    echo "  studio      - Abrir Prisma Studio"
    echo "  help        - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./deploy.sh deploy"
    echo "  ./deploy.sh logs backend"
    echo "  ./deploy.sh restore backup_20240115.sql"
    echo ""
}

# Main
case "$1" in
    deploy)
        deploy
        ;;
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    logs)
        logs "$2"
        ;;
    clean)
        clean
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    migrate)
        migrate
        ;;
    studio)
        studio
        ;;
    help|"")
        help
        ;;
    *)
        print_error "Comando desconocido: $1"
        help
        exit 1
        ;;
esac
