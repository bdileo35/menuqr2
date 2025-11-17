'use client';
import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'menuqr-theme';

export function useAppTheme() {
  // Inicializar desde localStorage o default a false (claro)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved !== null ? saved === 'dark' : false; // Default: claro
    }
    return false;
  });
  
  // Sincronizar con localStorage cuando cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return { 
    isDarkMode, 
    toggleTheme 
  };
}


