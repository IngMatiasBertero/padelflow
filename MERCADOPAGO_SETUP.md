# Guía de Configuración de Mercado Pago

## Paso 1: Crear Cuenta de Desarrollador

1. Ve a https://www.mercadopago.com.ar/developers
2. Inicia sesión con tu cuenta de Mercado Pago (o créala si no tienes)
3. Si no tienes cuenta de desarrollador, te pedirá crear una

## Paso 2: Crear una Aplicación

1. En el panel de desarrolladores, ve a **"Tus aplicaciones"**
2. Click en **"Crear aplicación"**
3. Completa:
   - Nombre: `PadelFlow`
   - Descripción: `Sistema de reservas de canchas de padel`
   - Tipo: `Pagos online`
4. Click en **"Crear aplicación"**

## Paso 3: Obtener las Credenciales

Una vez creada la aplicación:

### Credenciales de Prueba (para development)

1. Ve a tu aplicación → **"Credenciales"**
2. En la pestaña **"Credenciales de prueba"**
3. Verás:
   - **Public Key** (empieza con `TEST-...`)
   - **Access Token** (empieza con `TEST-...`)

### Credenciales de Producción (para cuando esté listo)

1. En la misma sección, pestaña **"Credenciales de producción"**
2. Primero debes **"Activar credenciales de producción"**
3. Completar información de tu negocio
4. Una vez aprobado, obtendrás:
   - **Public Key** (empieza con `APP_USR-...`)
   - **Access Token** (empieza con `APP_USR-...`)

## Paso 4: Configurar en PadelFlow

### En el servidor (.env)

```bash
# En tu servidor
cd ~/padelflow
nano .env
```

Agregar (con las credenciales de PRUEBA primero):

```env
# Mercado Pago - Credenciales de PRUEBA
MP_ACCESS_TOKEN=TEST-123456789-abcdef-tu-access-token-real
MP_PUBLIC_KEY=TEST-12345678-abcd-1234-abcd-123456789abc
```

## Paso 5: Tarjetas de Prueba

Para probar pagos en modo TEST, usa estas tarjetas:

### Tarjeta Aprobada
- Número: `5031 7557 3453 0604`
- Código: `123`
- Vencimiento: Cualquier fecha futura
- Nombre: APRO

### Otras tarjetas de prueba

| Estado | Número | Código | Nombre |
|--------|--------|--------|--------|
| Aprobado | 5031 7557 3453 0604 | 123 | APRO |
| Pendiente | 5031 4332 1540 6351 | 123 | CONT |
| Rechazado (fondos) | 5031 7557 3453 0604 | 123 | OTHE |
| Rechazado (otro) | 5031 4332 1540 6351 | 123 | OTHE |

Documentación completa: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

## Paso 6: URLs de Retorno

Cuando configures los pagos, necesitarás estas URLs:

```
Success URL: https://padelflow.bertium.net/reservas/exito
Failure URL: https://padelflow.bertium.net/reservas/error
Pending URL: https://padelflow.bertium.net/reservas/pendiente
```

## Webhooks (Notificaciones de pago)

Para recibir notificaciones automáticas de pagos:

1. En tu aplicación de MP → **"Webhooks"**
2. Agregar URL: `https://api.padelflow.bertium.net/api/webhooks/mercadopago`
3. Seleccionar eventos:
   - `payment.created`
   - `payment.updated`

## Flujo de Pago en PadelFlow

```
1. Usuario elige cancha y horario
   ↓
2. Sistema calcula seña (25% del precio)
   ↓
3. Genera preferencia de pago en MP
   ↓
4. Usuario paga con MP
   ↓
5. MP notifica vía webhook
   ↓
6. Sistema confirma reserva
```

## Costos de Mercado Pago

- **Tarjeta de crédito**: 4.99% + $2.59 por transacción
- **Tarjeta de débito**: 2.79% + $2.59 por transacción
- **Dinero en cuenta**: 3.99% + $2.59 por transacción

Más info: https://www.mercadopago.com.ar/costs-section/release-1-1

## Testing

### 1. Modo Prueba
Primero implementa con credenciales TEST

### 2. Verificar
- Crear reserva
- Pagar con tarjeta de prueba
- Verificar que se confirma la reserva

### 3. Producción
Cuando todo funcione:
- Cambiar a credenciales de producción
- Probar con tarjeta real (monto pequeño)
- Activar para usuarios

## Enlaces Útiles

- **Panel de desarrolladores**: https://www.mercadopago.com.ar/developers
- **Documentación**: https://www.mercadopago.com.ar/developers/es/docs
- **API Reference**: https://www.mercadopago.com.ar/developers/es/reference
- **SDK Node.js**: https://github.com/mercadopago/sdk-nodejs
- **Tarjetas de prueba**: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

## Próximos Pasos

Una vez tengas las credenciales:
1. Agrégalas al `.env` del servidor
2. Reinicia el backend: `docker-compose restart backend`
3. Prueba crear una reserva con tarjeta de test
4. Verifica que el webhook funcione
