import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT - Actualizar datos del comercio
export async function PUT(
  request: NextRequest,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  try {
    const body = await request.json();
    const {
      restaurantName,
      contactPhone,
      contactEmail,
      contactAddress,
      contactWebsite,
      socialInstagram,
      socialFacebook,
      socialTwitter,
      logoUrl,
      googleMapsUrl,
      googleReviewsUrl,
      whatsappPhone,
      description
    } = body;

    // Buscar menú
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico },
      include: { owner: true }
    });

    if (!menu) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    // Preparar datos de actualización para menus
    const menuUpdateData: any = {};
    if (restaurantName !== undefined) menuUpdateData.restaurantName = restaurantName.trim();
    if (contactPhone !== undefined) menuUpdateData.contactPhone = contactPhone?.trim() || null;
    if (contactEmail !== undefined) menuUpdateData.contactEmail = contactEmail?.trim() || null;
    if (contactAddress !== undefined) menuUpdateData.contactAddress = contactAddress?.trim() || null;
    if (contactWebsite !== undefined) menuUpdateData.contactWebsite = contactWebsite?.trim() || null;
    if (socialInstagram !== undefined) menuUpdateData.socialInstagram = socialInstagram?.trim() || null;
    if (socialFacebook !== undefined) menuUpdateData.socialFacebook = socialFacebook?.trim() || null;
    if (socialTwitter !== undefined) menuUpdateData.socialTwitter = socialTwitter?.trim() || null;
    if (logoUrl !== undefined) menuUpdateData.logoUrl = logoUrl?.trim() || null;
    if (googleMapsUrl !== undefined) menuUpdateData.googleMapsUrl = googleMapsUrl?.trim() || null;
    if (googleReviewsUrl !== undefined) menuUpdateData.googleReviewsUrl = googleReviewsUrl?.trim() || null;
    if (description !== undefined) menuUpdateData.description = description?.trim() || null;

    // Actualizar menú
    const updatedMenu = await prisma.menu.update({
      where: { id: menu.id },
      data: menuUpdateData
    });

    // Actualizar WhatsApp en users si viene
    if (whatsappPhone !== undefined && menu.owner) {
      await prisma.user.update({
        where: { id: menu.owner.id },
        data: {
          whatsappPhone: whatsappPhone?.trim() || null
        }
      });
    }

    return NextResponse.json({
      success: true,
      menu: {
        id: updatedMenu.id,
        restaurantId: updatedMenu.restaurantId,
        restaurantName: updatedMenu.restaurantName,
        contactPhone: updatedMenu.contactPhone,
        contactEmail: updatedMenu.contactEmail,
        contactAddress: updatedMenu.contactAddress,
        contactWebsite: updatedMenu.contactWebsite,
        socialInstagram: updatedMenu.socialInstagram,
        socialFacebook: updatedMenu.socialFacebook,
        socialTwitter: updatedMenu.socialTwitter,
        logoUrl: updatedMenu.logoUrl,
        description: updatedMenu.description
      }
    });
  } catch (error) {
    console.error('❌ Error actualizando datos del comercio:', error);
    return NextResponse.json({ error: 'Error al actualizar datos del comercio' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}



