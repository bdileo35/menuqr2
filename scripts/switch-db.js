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
  
  // Leer schema PostgreSQL original (guardar backup primero)
  const postgresSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// NOTA: Los modelos deben copiarse desde schema.sqlite.prisma
// o mantener ambos schemas sincronizados manualmente
`;
  
  fs.writeFileSync(schemaPath, postgresSchema);
  
  console.log('✅ Schema cambiado a PostgreSQL');
  console.log('📋 Próximos pasos:');
  console.log('   1. DATABASE_URL="postgresql://..." en .env.local');
  console.log('   2. npx prisma generate');
  console.log('   3. npx prisma migrate deploy (o db push)');
  
} else {
  console.error('❌ Modo inválido. Usa: local o remote');
  process.exit(1);
}

