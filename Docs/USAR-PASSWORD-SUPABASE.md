# 🔑 Cómo Usar tu Contraseña de Supabase

## ✅ Si Ya Tienes la Contraseña

Si ya sabes la contraseña, simplemente **reemplaza `[YOUR_PASSWORD]`** en el connection string con tu contraseña real.

## 📝 Ejemplo

**En Supabase verás:**
```
postgresql://postgres:[YOUR_PASSWORD]@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres
```

**Debes reemplazarlo con tu contraseña real:**
```
postgresql://postgres:TU_CONTRASEÑA_REAL@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres
```

## 🎯 Para Vercel

1. **Vercel Dashboard** → Settings → Environment Variables
2. Buscar `DATABASE_URL`
3. Editar y reemplazar `[YOUR_PASSWORD]` con tu contraseña real
4. Guardar
5. Redeploy

## ⚠️ Importante

- **NO incluyas espacios** antes o después de la contraseña
- Si tu contraseña tiene caracteres especiales, puede que necesites codificarlos (URL encoding)
- La contraseña va **directamente después de `postgres:`** y **antes de `@`**

## 🔍 Verificar Formato Correcto

El formato debe ser:
```
postgresql://postgres:CONTRASEÑA@HOST:PUERTO/DATABASE
```

Ejemplo completo:
```
postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
```

## 📋 Para Connection Pooler

Si usas el pooler (puerto 6543), el formato es:
```
postgresql://postgres.vzcniaopxflpgrwarnvn:CONTRASEÑA@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Nota:** El usuario del pooler es diferente: `postgres.vzcniaopxflpgrwarnvn` (con el proyecto)

