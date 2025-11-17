# 📚 Documentación: Gestión de Restaurantes

Índice completo de documentación para crear y gestionar restaurantes en MenuQR.

---

## 🚀 Inicio Rápido

**¿Primera vez?** Empieza aquí:

1. **[QUICK-START.md](./QUICK-START.md)** - Guía rápida de 3 pasos
2. **[PLANTILLA-MENU.md](./PLANTILLA-MENU.md)** - Copia y personaliza tu menú

---

## 📖 Documentación Completa

### Para Crear Nuevos Restaurantes

- **[TUTORIAL-NUEVO-RESTAURANTE.md](./TUTORIAL-NUEVO-RESTAURANTE.md)**
  - Guía paso a paso completa
  - Explicación detallada de cada paso
  - Solución de problemas
  - Tips y mejores prácticas

- **[PLANTILLA-MENU.md](./PLANTILLA-MENU.md)**
  - Plantilla lista para copiar
  - Ejemplos de formato
  - Reglas y tips

### Ejemplos Reales

- **[Menu_Esquina_Pompeya.md](./Menu_Esquina_Pompeya.md)** - Ejemplo completo
- **[Menu_los_toritos.md](./Menu_los_toritos.md)** - Otro ejemplo

---

## 🛠️ Herramientas Disponibles

### Scripts NPM

```bash
# Crear nuevo restaurante (interactivo)
npm run crear-restaurante

# Crear nuevo restaurante (con argumentos)
npm run crear-restaurante -- --nombreArchivo "Menu.md" --nombreComercio "Mi Resto" ...

# Seed específico de Los Toritos
npm run seed:toritos
```

### Endpoints API

- `POST /api/seed-comercio` - Crear restaurante desde archivo MD
- `GET /api/menu/[idUnico]` - Obtener menú de un restaurante

---

## 📋 Checklist para Nuevo Restaurante

- [ ] Archivo MD creado en `Docs/`
- [ ] Formato de tabla correcto
- [ ] Script ejecutado exitosamente
- [ ] ID único guardado
- [ ] Carta pública verificada
- [ ] Editor accesible
- [ ] Contraseña cambiada
- [ ] Imágenes agregadas (opcional)
- [ ] Tema configurado

---

## 🎯 Flujo de Trabajo Recomendado

```
1. Preparar archivo MD
   ↓
2. Ejecutar script crear-restaurante
   ↓
3. Verificar carta pública
   ↓
4. Personalizar desde editor
   ↓
5. Agregar imágenes (opcional)
   ↓
6. Configurar tema y colores
   ↓
7. ¡Listo para usar!
```

---

## 💡 Tips Importantes

1. **Nombres de archivos:** Usa formato `Menu_[nombre].md`
2. **ID único:** Guárdalo siempre, es tu identificador
3. **Backup:** Guarda copias de tus archivos MD
4. **Formato:** Sigue la plantilla para evitar errores
5. **Validación:** Verifica siempre la carta pública después de crear

---

## 🆘 Ayuda

- **Problemas comunes:** Ver sección "Solución de Problemas" en `TUTORIAL-NUEVO-RESTAURANTE.md`
- **Formato incorrecto:** Revisa `PLANTILLA-MENU.md`
- **Errores del script:** Verifica que el archivo MD está en `Docs/` y tiene formato correcto

---

## 📞 Soporte

Para más ayuda:
- Revisa los ejemplos en `Docs/`
- Consulta el código en `scripts/crear-restaurante.ts`
- Revisa el schema en `prisma/schema.prisma`

---

**Última actualización:** Noviembre 2025

