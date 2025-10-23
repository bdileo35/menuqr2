"use client";
import { QRCodeCanvas } from "qrcode.react";

interface QRGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRGenerator({ value, size = 180, className = "" }: QRGeneratorProps) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-lg inline-block ${className}`}>
      <QRCodeCanvas value={value} size={size} />
    </div>
  );
}


