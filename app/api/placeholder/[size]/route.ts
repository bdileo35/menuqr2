import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || 'Placeholder';
  const [width, height] = params.size.split('x').map(Number);
  
  // Crear un SVG placeholder simple
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="14" fill="#64748b">
        ${text.replace(/\+/g, ' ')}
      </text>
      <circle cx="30" cy="30" r="8" fill="#94a3b8"/>
      <text x="30" y="35" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="12" fill="white">
        📷
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
}