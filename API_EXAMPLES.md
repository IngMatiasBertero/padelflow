# Ejemplos de Uso de la API - PadelFlow

Esta guía contiene ejemplos prácticos de cómo usar la API de PadelFlow.

## Base URL

```
http://localhost:7001/api
```

En producción:
```
http://tu-vps-ip:7001/api
```

## Autenticación

### 1. Registrar un Cliente

```bash
curl -X POST http://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@test.com",
    "password": "password123",
    "nombre": "Juan Pérez",
    "telefono": "3856000111",
    "rol": "CLIENTE"
  }'
```

**Respuesta:**
```json
{
  "user": {
    "id": "clxxxxx",
    "email": "cliente@test.com",
    "nombre": "Juan Pérez",
    "telefono": "3856000111",
    "rol": "CLIENTE",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Registrar un Dueño

```bash
curl -X POST http://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dueno@test.com",
    "password": "password123",
    "nombre": "Carlos Dueño",
    "telefono": "3856000222",
    "rol": "DUENO"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@test.com",
    "password": "password123"
  }'
```

### 4. Obtener Perfil

```bash
curl -X GET http://localhost:7001/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Complejos

### 5. Listar Todos los Complejos

```bash
curl -X GET http://localhost:7001/api/complejos
```

### 6. Filtrar Complejos por Ciudad

```bash
curl -X GET "http://localhost:7001/api/complejos?ciudad=Santiago del Estero"
```

### 7. Crear un Complejo (solo dueños)

```bash
curl -X POST http://localhost:7001/api/complejos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_DUENO" \
  -d '{
    "nombre": "Santiago Padel Club",
    "ciudad": "Santiago del Estero",
    "direccion": "Avenida Libertador y Lavalle",
    "telefono": "+54 385 486-1436",
    "horario_apertura": "08:00",
    "horario_cierre": "02:00",
    "imagen": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea"
  }'
```

### 8. Obtener Detalle de un Complejo

```bash
curl -X GET http://localhost:7001/api/complejos/ID_DEL_COMPLEJO
```

### 9. Obtener Mis Complejos (solo dueños)

```bash
curl -X GET http://localhost:7001/api/complejos/my \
  -H "Authorization: Bearer TU_TOKEN_DUENO"
```

## Canchas

### 10. Listar Todas las Canchas

```bash
curl -X GET http://localhost:7001/api/canchas
```

### 11. Filtrar Canchas por Complejo

```bash
curl -X GET "http://localhost:7001/api/canchas?complejo_id=ID_DEL_COMPLEJO"
```

### 12. Crear una Cancha (solo dueños)

```bash
curl -X POST http://localhost:7001/api/canchas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_DUENO" \
  -d '{
    "nombre": "Cancha 1 (Blindex)",
    "tipo": "BLINDEX",
    "precio_hora": 4800,
    "complejo_id": "ID_DE_TU_COMPLEJO"
  }'
```

Tipos válidos: `BLINDEX`, `TECHADA`, `DESCUBIERTA`

## Turnos / Reservas

### 13. Listar Turnos Disponibles

```bash
curl -X GET http://localhost:7001/api/turnos
```

### 14. Filtrar Turnos por Cancha

```bash
curl -X GET "http://localhost:7001/api/turnos?cancha_id=ID_CANCHA"
```

### 15. Filtrar Turnos por Fecha

```bash
curl -X GET "http://localhost:7001/api/turnos?fecha=2024-01-15"
```

### 16. Filtrar por Estado

```bash
curl -X GET "http://localhost:7001/api/turnos?estado=DISPONIBLE"
```

Estados válidos: `DISPONIBLE`, `RESERVADO`, `PENDIENTE`, `BLOQUEADO`, `CANCELADO`

### 17. Crear una Reserva

```bash
curl -X POST http://localhost:7001/api/turnos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_CLIENTE" \
  -d '{
    "cancha_id": "ID_DE_LA_CANCHA",
    "fecha": "2024-01-15",
    "hora_inicio": "18:00",
    "hora_fin": "19:00"
  }'
```

**Respuesta:**
```json
{
  "id": "clxxxxx",
  "fecha": "2024-01-15T00:00:00.000Z",
  "hora_inicio": "18:00",
  "hora_fin": "19:00",
  "estado": "PENDIENTE",
  "precio": 4800,
  "sena_monto": 1200,
  "sena_pagada": false,
  "cancha": {
    "id": "...",
    "nombre": "Cancha 1 (Blindex)",
    "complejo": {
      "nombre": "Santiago Padel Club"
    }
  }
}
```

### 18. Ver Mis Reservas

```bash
curl -X GET http://localhost:7001/api/turnos/my \
  -H "Authorization: Bearer TU_TOKEN_CLIENTE"
```

### 19. Cancelar una Reserva

```bash
curl -X PATCH http://localhost:7001/api/turnos/ID_DEL_TURNO/cancel \
  -H "Authorization: Bearer TU_TOKEN_CLIENTE"
```

## Ejemplos Completos de Flujos

### Flujo Completo: Cliente Reserva una Cancha

```bash
# 1. Registrarse
RESPONSE=$(curl -s -X POST http://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@cliente.com",
    "password": "password123",
    "nombre": "María García",
    "telefono": "3856000333",
    "rol": "CLIENTE"
  }')

# Extraer el token (requiere jq)
TOKEN=$(echo $RESPONSE | jq -r '.token')

# 2. Ver complejos disponibles
curl -X GET http://localhost:7001/api/complejos

# 3. Ver canchas de un complejo
curl -X GET "http://localhost:7001/api/canchas?complejo_id=ID_COMPLEJO"

# 4. Ver disponibilidad de turnos
curl -X GET "http://localhost:7001/api/turnos?cancha_id=ID_CANCHA&fecha=2024-01-15"

# 5. Crear reserva
curl -X POST http://localhost:7001/api/turnos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cancha_id": "ID_CANCHA",
    "fecha": "2024-01-15",
    "hora_inicio": "18:00",
    "hora_fin": "19:00"
  }'

# 6. Ver mis reservas
curl -X GET http://localhost:7001/api/turnos/my \
  -H "Authorization: Bearer $TOKEN"
```

### Flujo Completo: Dueño Crea su Complejo

```bash
# 1. Registrarse como dueño
RESPONSE=$(curl -s -X POST http://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@dueno.com",
    "password": "password123",
    "nombre": "Roberto Manager",
    "telefono": "3856000444",
    "rol": "DUENO"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')

# 2. Crear complejo
COMPLEJO_RESPONSE=$(curl -s -X POST http://localhost:7001/api/complejos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Mi Complejo Deportivo",
    "ciudad": "Santiago del Estero",
    "direccion": "Calle Ejemplo 123",
    "telefono": "+54 385 123-4567",
    "horario_apertura": "08:00",
    "horario_cierre": "23:00"
  }')

COMPLEJO_ID=$(echo $COMPLEJO_RESPONSE | jq -r '.id')

# 3. Crear canchas
curl -X POST http://localhost:7001/api/canchas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Cancha 1 (Blindex)",
    "tipo": "BLINDEX",
    "precio_hora": 4800,
    "complejo_id": "'$COMPLEJO_ID'"
  }'

curl -X POST http://localhost:7001/api/canchas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Cancha 2 (Techada)",
    "tipo": "TECHADA",
    "precio_hora": 4200,
    "complejo_id": "'$COMPLEJO_ID'"
  }'

# 4. Ver mis complejos
curl -X GET http://localhost:7001/api/complejos/my \
  -H "Authorization: Bearer $TOKEN"
```

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado o token inválido
- `403 Forbidden` - Sin permisos suficientes
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: turno ya reservado)
- `500 Internal Server Error` - Error del servidor

## Errores Comunes

### Error 401: Token inválido o expirado
```json
{
  "error": "Invalid or expired token"
}
```

**Solución:** Hacer login nuevamente para obtener un token fresco.

### Error 403: Sin permisos
```json
{
  "error": "Insufficient permissions"
}
```

**Solución:** Verificar que el rol del usuario es correcto para la operación.

### Error 409: Turno ya reservado
```json
{
  "error": "Time slot already booked"
}
```

**Solución:** Elegir otro horario disponible.

### Error 400: Datos inválidos
```json
{
  "error": "Invalid input",
  "details": [...]
}
```

**Solución:** Revisar los campos enviados según la documentación.

## Testing con Postman

1. Importar la colección de endpoints
2. Configurar variables de entorno:
   - `base_url`: `http://localhost:7001/api`
   - `token`: Se actualiza automáticamente al hacer login
3. Los ejemplos anteriores pueden usarse directamente en Postman

## Testing con JavaScript/Fetch

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:7001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'cliente@test.com',
      password: 'password123'
    })
  });

  const data = await response.json();
  return data.token;
};

// Crear reserva
const crearReserva = async (token) => {
  const response = await fetch('http://localhost:7001/api/turnos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      cancha_id: 'ID_CANCHA',
      fecha: '2024-01-15',
      hora_inicio: '18:00',
      hora_fin: '19:00'
    })
  });

  return await response.json();
};

// Uso
const token = await login();
const reserva = await crearReserva(token);
console.log(reserva);
```
