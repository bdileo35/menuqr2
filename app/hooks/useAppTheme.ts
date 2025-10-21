'use client';
import { useState } from 'react';

export function useAppTheme() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  return { 
    isDarkMode, 
    toggleTheme 
  };
}
