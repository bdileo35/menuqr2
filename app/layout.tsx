import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MenuQR - Menús Digitales Inteligentes",
  description: "Crea y gestiona menús digitales con códigos QR para restaurantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const DevClick = dynamic(() => import('./components/DevClickToComponent'), { ssr: false });
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <DevClick />
      </body>
    </html>
  );
}