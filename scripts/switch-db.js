// Script para cambiar entre SQLite (local) y PostgreSQL (Supabase)
// Uso: node scripts/switch-db.js local|remote

const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'local';

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const sqliteSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.sqlite.prisma');

if (mode === 'local') {
  console.log('🔄 Cambiando a SQLite (desarrollo local)...');
  
  // Leer schema SQLite
  const sqliteSchema = fs.readFileSync(sqliteSchemaPath, 'utf8');
  
  // Escribir como schema principal
  fs.writeFileSync(schemaPath, sqliteSchema);
  
  console.log('✅ Schema cambiado a SQLite');
  console.log('📋 Próximos pasos:');
  console.log('   1. DATABASE_URL="file:./dev.db" en .env.local');
  console.log('   2. npx prisma generate');
  console.log('   3. npx prisma db push');
  
} else if (mode === 'remote') {
  console.log('🔄 Cambiando a PostgreSQL (Supabase)...');
  
  // Leer schema SQLite completo
  const sqliteSchema = fs.readFileSync(sqliteSchemaPath, 'utf8');
  
  // Reemplazar provider y comentario
  const postgresSchema = sqliteSchema
    .replace(/provider = "sqlite"/g, 'provider = "postgresql"')
    .replace(/\/\/ Schema para desarrollo local con SQLite/g, '// Schema para PostgreSQL (Supabase)')
    .replace(/\/\/ Uso: npx prisma generate --schema=\.\/prisma\/schema\.sqlite\.prisma/g, '// Uso: npx prisma generate')
    .replace(/\/\/ Copiar todos los modelos desde schema\.prisma/g, '// Schema completo para PostgreSQL')
    .replace(/\/\/ \(Los enums y modelos son compatibles entre SQLite y PostgreSQL para este caso\)/g, '// Compatible con Supabase');
  
  fs.writeFileSync(schemaPath, postgresSchema);
  
  console.log('✅ Schema cambiado a PostgreSQL');
  console.log('📋 Próximos pasos:');
  console.log('   1. DATABASE_URL="postgresql://..." en .env.local');
  console.log('   2. npx prisma generate');
  console.log('   3. npx prisma db push (o migrate deploy)');
  
} else {
  console.error('❌ Modo inválido. Usa: local o remote');
  process.exit(1);
}

