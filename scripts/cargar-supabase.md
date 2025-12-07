# 🚀 Cargar Datos 20/190 en Supabase

## 📋 Pasos

### **Opción 1: Desde Vercel (Recomendado)**

1. **Aplicar Schema a Supabase:**
   ```bash
   # Conectar a Supabase
   DATABASE_URL="postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require" npx prisma db push
   ```

2. **Cargar Datos desde Vercel:**
   ```bash
   curl -X POST https://menuqrep.vercel.app/api/seed-demo
   ```

### **Opción 2: Desde Local con Supabase**

1. **Cambiar DATABASE_URL temporalmente:**
   ```bash
   # En .env.local, cambiar a:
   DATABASE_URL="postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require"
   ```

2. **Aplicar Schema:**
   ```bash
   npx prisma db push
   ```

3. **Cargar Datos:**
   ```bash
   # Con servidor corriendo
   Invoke-WebRequest -Uri "http://localhost:3000/api/seed-demo" -Method POST
   ```

4. **Volver a SQLite (opcional):**
   ```bash
   DATABASE_URL="file:./prisma/dev.db"
   ```

## ✅ Verificar

Después de cargar, verificar en Vercel:
- `https://menuqrep.vercel.app/editor/5XJ1J37F` → Debe mostrar 20 categorías, 190 items
- `https://menuqrep.vercel.app/api/menu/5XJ1J37F` → Debe devolver 20 categorías, 190 items

