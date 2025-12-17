"use client";
import { useRouter, usePathname } from "next/navigation";
import { 
  MdOutlineEdit, 
  MdOutlineStore, 
  MdOutlineQrCode2,
  MdOutlineReceipt,
  MdOutlineSettings,
  MdOutlineHelpOutline
} from "react-icons/md";
import { useAppTheme } from "../hooks/useAppTheme";

interface NavBarProps {
  idUnico: string;
}

export default function NavBar({ idUnico }: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDarkMode } = useAppTheme();
  
  // Colores según tema
  const gris = isDarkMode ? "#9ca3af" : "#6b7280";
  const grisActivo = isDarkMode ? "#f3f4f6" : "#374151";
  const fondo = isDarkMode ? "#1f2937" : "#fff";
  const borde = isDarkMode ? "#374151" : "#e5e7eb";
  const sombra = isDarkMode ? "0 -2px 8px rgba(0,0,0,0.3)" : "0 -2px 8px rgba(0,0,0,0.05)";

  // Orden: Datos, Editor, QR, Pedidos, Config (Ayuda oculto por ahora)
  const navItems = [
    { 
      label: "Datos", 
      path: `/datos-comercio/${idUnico}`, 
      icon: MdOutlineStore 
    },
    { 
      label: "Editor", 
      path: `/editor/${idUnico}`, 
      icon: MdOutlineEdit 
    },
    { 
      label: "QR", 
      path: `/opciones-qr/${idUnico}`, 
      icon: MdOutlineQrCode2 
    },
    { 
      label: "Pedidos", 
      path: `/pedidos/${idUnico}`, 
      icon: MdOutlineReceipt 
    },
    { 
      label: "Config", 
      path: `/configuracion/${idUnico}`, 
      icon: MdOutlineSettings 
    },
    // { 
    //   label: "Ayuda", 
    //   path: `/ayuda/${idUnico}`, 
    //   icon: MdOutlineHelpOutline 
    // }, // Oculto por ahora
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: fondo,
      borderTop: `1px solid ${borde}`,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: 60,
      zIndex: 100,
      boxShadow: sombra
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            style={{
              background: "none",
              border: "none",
              height: "100%",
              padding: "0 4px",
              color: active ? grisActivo : gris,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: active ? 700 : 600,
              fontSize: 11,
              transition: "color 0.2s",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Icon size={20} style={{ marginBottom: 2 }} />
            <span style={{ fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

