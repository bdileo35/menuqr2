'use client'
import { useState, useEffect } from 'react'

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(true) // Por defecto oscuro

  useEffect(() => {
    // Cargar preferencia guardada o establecer oscuro por defecto
    const savedTheme = localStorage.getItem('demo-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      // Si no hay preferencia guardada, establecer oscuro por defecto
      localStorage.setItem('demo-theme', 'dark')
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('demo-theme', newTheme ? 'dark' : 'light')
  }

  return {
    isDark,
    toggleTheme,
    themeIcon: isDark ? '🌙' : '☀️',
    themeLabel: isDark ? 'Modo Oscuro' : 'Modo Claro'
  }
}