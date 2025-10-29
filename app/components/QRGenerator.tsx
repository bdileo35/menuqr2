"use client";
import { QRCodeCanvas } from "qrcode.react";

interface QRGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  bare?: boolean; // sin marco/espaciado extra
  margin?: boolean; // incluir margen blanco interno
}

export default function QRGenerator({ value, size = 180, className = "", bare = false, margin = false }: QRGeneratorProps) {
  if (bare) {
    return <QRCodeCanvas value={value} size={size} includeMargin={margin} />;
  }
  return (
    <div className={`bg-white p-2 rounded-xl shadow inline-block ${className}`}>
      <QRCodeCanvas value={value} size={size} includeMargin={margin} />
    </div>
  );
}


