# 📋 Análisis: Demo de 7 Días

## 🎯 Objetivo
Permitir que comercios prueben MenuQR por 7 días gratis, y luego:
- Si compran: activar plan completo
- Si no compran: desactivar acceso

## 💡 Propuesta de Implementación

### 1. Schema - Agregar campos a User
```prisma
model User {
  // ... campos existentes
  isTrial Boolean @default(false)
  trialStartedAt DateTime?
  trialEndsAt DateTime?
  isActive Boolean @default(true) // Si false, no puede acceder
}
```

### 2. Flujo de Demo

#### Paso 1: Crear cuenta demo
- Usuario entra a `/comprar`
- Click en "Probar gratis 7 días"
- Se crea usuario con:
  - `isTrial: true`
  - `trialStartedAt: now()`
  - `trialEndsAt: now() + 7 days`
  - `hasPro: false` (pero puede usar todas las funciones en trial)
  - `isActive: true`

#### Paso 2: Durante el trial
- Acceso completo a todas las funciones
- Banner indicando días restantes
- Opción de comprar en cualquier momento

#### Paso 3: Al finalizar trial
- Si compró: activar plan correspondiente
- Si no compró: `isActive: false`
- Bloquear acceso (mostrar mensaje de upgrade)

### 3. Endpoints Necesarios

#### POST /api/trial/start
```typescript
// Crear cuenta de trial
{
  restaurantName: string,
  email: string,
  phone?: string
}
// Retorna: { idUnico, trialEndsAt }
```

#### GET /api/trial/status/[idUnico]
```typescript
// Verificar estado del trial
// Retorna: { 
//   isTrial: boolean,
//   daysRemaining: number,
//   isActive: boolean
// }
```

#### POST /api/trial/convert
```typescript
// Convertir trial a plan pago
{
  idUnico: string,
  plan: 'standard' | 'pro'
}
```

### 4. UI/UX

#### Banner en todas las pantallas (si está en trial)
```
⚠️ Demo activa - Te quedan 3 días
[Comprar ahora] [Cerrar]
```

#### Página de compra
```
[Probar gratis 7 días] ← Botón destacado
[Comprar Standard] [Comprar PRO]
```

#### Página de bloqueo (si trial expiró)
```
❌ Tu demo ha expirado
Para continuar usando MenuQR, elige un plan:
[Comprar Standard] [Comprar PRO]
```

### 5. Verificaciones

#### Middleware de verificación
```typescript
// En cada página protegida
if (user.isTrial && user.trialEndsAt < now()) {
  if (!user.isActive) {
    redirect('/trial-expired')
  }
}
```

## 🔄 Flujo Completo

1. **Comercio entra a menuqrep.vercel.app**
   - Ve panel de MenuQR
   - Click "Probar gratis 7 días"

2. **Se crea cuenta demo**
   - Genera `idUnico` único
   - Crea usuario con trial activo
   - Redirige a `/editor/[idUnico]`

3. **Durante 7 días**
   - Acceso completo
   - Banner con días restantes
   - Opción de comprar en cualquier momento

4. **Al día 7**
   - Si compró: continúa con plan
   - Si no compró: bloquea acceso
   - Muestra página de upgrade

## 📋 Implementación

### Prioridad
1. ✅ Agregar campos a schema
2. ✅ Endpoint crear trial
3. ✅ Endpoint verificar estado
4. ✅ Banner en UI
5. ✅ Página de bloqueo
6. ✅ Middleware de verificación

### Consideraciones
- **Datos:** Los datos del trial se mantienen, solo se bloquea acceso
- **Upgrade:** Puede comprar en cualquier momento durante trial
- **Renovación:** No hay renovación automática, debe comprar

