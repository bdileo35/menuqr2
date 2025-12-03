'use client';
import { 
  MdOutlineStore, 
  MdOutlineEdit, 
  MdOutlineQrCode2, 
  MdOutlineSettings 
} from 'react-icons/md';
import { useAppTheme } from '../../../hooks/useAppTheme';

type PanelSection = 'datos' | 'editor' | 'qr' | 'config';

interface PanelNavBarProps {
  currentSection: PanelSection;
  onSectionChange: (section: PanelSection) => void;
}

const navItems: { key: PanelSection; label: string; icon: any }[] = [
  { key: 'datos', label: 'Datos', icon: MdOutlineStore },
  { key: 'editor', label: 'Editor', icon: MdOutlineEdit },
  { key: 'qr', label: 'QR', icon: MdOutlineQrCode2 },
  { key: 'config', label: 'Config', icon: MdOutlineSettings },
];

export default function PanelNavBar({ currentSection, onSectionChange }: PanelNavBarProps) {
  const { isDarkMode } = useAppTheme();

  return (
    <nav
      className={`fixed bottom-0 left-0 w-full flex justify-around items-center h-16 z-50 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-800 border-t border-gray-700 shadow-lg'
          : 'bg-white border-t border-gray-200 shadow-md'
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = currentSection === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSectionChange(item.key)}
            className={`flex flex-col items-center justify-center h-full flex-1 text-sm font-medium transition-colors duration-200 ${
              active
                ? isDarkMode
                  ? 'text-white bg-gray-700'
                  : 'text-gray-900 bg-gray-200'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            } rounded-md mx-1`}
          >
            <Icon size={24} className="mb-1" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}



