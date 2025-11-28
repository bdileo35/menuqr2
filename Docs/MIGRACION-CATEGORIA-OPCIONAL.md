# 🔄 Migración: categoryId Opcional

## ⚠️ IMPORTANTE: Ejecutar antes de usar

Después de hacer pull/clone, **DEBES ejecutar**:

```bash
npx prisma migrate dev --name allow_null_category
npx prisma generate
```

## 📋 ¿Qué hace esta migración?

- Hace `categoryId` opcional en el modelo `MenuItem`
- Permite guardar items sin categoría (`categoryId = null`)
- Los items sin categoría no se muestran en la carta pública
- Se pueden ver/editar/recuperar desde el editor

## 🔍 Verificar que funcionó

Después de ejecutar la migración, verifica:

1. El schema tiene `categoryId String?` (con `?`)
2. Puedes crear/editar items sin categoría
3. Los items sin categoría aparecen en "Sin categoría" en el editor
4. Los items sin categoría NO aparecen en la carta

## ❌ Si no ejecutas la migración

- Error 500 al guardar items sin categoría
- Prisma intentará guardar `null` en un campo `NOT NULL`
- La API fallará con error de base de datos

