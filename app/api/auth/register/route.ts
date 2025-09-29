import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Función para generar token JWT
function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '30d' }
  );
}

// Función para generar ID único de restaurante
function generateRestaurantId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, restaurantName } = await request.json();

    // Validaciones básicas
    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Generar ID único para restaurante
    let restaurantId: string;
    let existingRestaurant;
    
    do {
      restaurantId = generateRestaurantId();
      existingRestaurant = await prisma.user.findUnique({
        where: { restaurantId }
      });
    } while (existingRestaurant);

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario y menú en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          restaurantId,
          restaurantName,
          role: 'ADMIN'
        }
      });

      // Crear menú con categorías por defecto
      const menu = await tx.menu.create({
        data: {
          restaurantId,
          restaurantName,
          ownerId: user.id,
          categories: {
            create: [
              { name: 'Entradas', description: 'Aperitivos y entradas', position: 0 },
              { name: 'Principales', description: 'Platos principales', position: 1 },
              { name: 'Postres', description: 'Postres y dulces', position: 2 },
              { name: 'Bebidas', description: 'Bebidas y refrescos', position: 3 }
            ]
          }
        }
      });

      return { user, menu };
    });

    // Generar token
    const token = generateToken(result.user.id);

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        restaurantId: result.user.restaurantId,
        restaurantName: result.user.restaurantName,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt
      },
      menu: {
        id: result.menu.id,
        restaurantId: result.menu.restaurantId,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/menu/${restaurantId}`
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error en register:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}