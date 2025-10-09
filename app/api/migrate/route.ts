import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🔄 Iniciando migración de base de datos...');

    // Ejecutar las migraciones creando las tablas
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "restaurantId" TEXT NOT NULL UNIQUE,
        "restaurantName" TEXT NOT NULL,
        "phone" TEXT,
        "address" TEXT,
        "plan" TEXT DEFAULT 'basic',
        "role" TEXT NOT NULL DEFAULT 'ADMIN',
        "avatar" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "lastLogin" TIMESTAMP(3),
        "whatsappPhone" TEXT,
        "whatsappToken" TEXT,
        "whatsappPhoneId" TEXT,
        "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "menus" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "restaurantId" TEXT NOT NULL UNIQUE,
        "restaurantName" TEXT NOT NULL,
        "description" TEXT,
        "logoUrl" TEXT,
        "logoPublicId" TEXT,
        "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
        "secondaryColor" TEXT NOT NULL DEFAULT '#64748b',
        "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
        "textColor" TEXT NOT NULL DEFAULT '#1f2937',
        "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
        "contactPhone" TEXT,
        "contactEmail" TEXT,
        "contactAddress" TEXT,
        "contactWebsite" TEXT,
        "socialInstagram" TEXT,
        "socialFacebook" TEXT,
        "socialTwitter" TEXT,
        "showPrices" BOOLEAN NOT NULL DEFAULT true,
        "showImages" BOOLEAN NOT NULL DEFAULT true,
        "showDescriptions" BOOLEAN NOT NULL DEFAULT true,
        "showNutritional" BOOLEAN NOT NULL DEFAULT false,
        "allowOrdering" BOOLEAN NOT NULL DEFAULT false,
        "currency" TEXT NOT NULL DEFAULT '$',
        "language" TEXT NOT NULL DEFAULT 'es',
        "deliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
        "deliveryFee" REAL NOT NULL DEFAULT 0,
        "deliveryRadius" REAL,
        "deliveryMinOrder" REAL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "ownerId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "position" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "imageUrl" TEXT,
        "imagePublicId" TEXT,
        "menuId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "menu_items" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL NOT NULL,
        "originalPrice" REAL,
        "position" INTEGER NOT NULL DEFAULT 0,
        "imageUrl" TEXT,
        "imagePublicId" TEXT,
        "galleryImages" TEXT,
        "hasImage" BOOLEAN NOT NULL DEFAULT false,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "isPopular" BOOLEAN NOT NULL DEFAULT false,
        "isPromo" BOOLEAN NOT NULL DEFAULT false,
        "spicyLevel" INTEGER NOT NULL DEFAULT 0,
        "preparationTime" INTEGER,
        "tags" TEXT,
        "menuId" TEXT NOT NULL,
        "categoryId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;

    return NextResponse.json({
      success: true,
      message: 'Migración completada exitosamente! Las tablas han sido creadas.'
    });

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
