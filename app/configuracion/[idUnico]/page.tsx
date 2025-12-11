'use client';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useState } from 'react';

export default function ConfiguracionPage() {
  const params = useParams();
  const router = useRouter();
  const idUnico = params?.idUnico as string;
  const { isDarkMode } = useAppTheme();
  const [copied, setCopied] = useState<string | null>(null);

  if (!idUnico) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error: ID Único no encontrado</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>La URL debe incluir un ID único válido.</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // SQL para Backup (exportar datos)
  const backupSQL = `-- Backup de datos para ${idUnico}
-- Ejecutar en Supabase SQL Editor

-- 1. Exportar Usuario
SELECT * FROM users WHERE id_unico = '${idUnico}';

-- 2. Exportar Menú
SELECT * FROM menus WHERE "restaurantId" = '${idUnico}';

-- 3. Exportar Categorías
SELECT c.* FROM categories c
INNER JOIN menus m ON c."menuId" = m.id
WHERE m."restaurantId" = '${idUnico}';

-- 4. Exportar Items del Menú
SELECT mi.* FROM "menuItems" mi
INNER JOIN menus m ON mi."menuId" = m.id
WHERE m."restaurantId" = '${idUnico}'
ORDER BY mi."categoryId", mi.position;

-- 5. Exportar Items sin Categoría
SELECT mi.* FROM "menuItems" mi
INNER JOIN menus m ON mi."menuId" = m.id
WHERE m."restaurantId" = '${idUnico}' AND mi."categoryId" IS NULL
ORDER BY mi.position;
`;

  // SQL para Restore (importar datos)
  const restoreSQL = `-- Restore de datos para ${idUnico}
-- IMPORTANTE: Reemplazar los valores entre < > con los datos reales
-- Ejecutar en Supabase SQL Editor

-- 1. Crear/Actualizar Usuario
INSERT INTO users (id_unico, username, password, "hasPro", plan, "createdAt", "updatedAt")
VALUES ('${idUnico}', '<username>', '<password_hash>', <true/false>, '<STANDARD/PRO>', NOW(), NOW())
ON CONFLICT (id_unico) DO UPDATE SET
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  "hasPro" = EXCLUDED."hasPro",
  plan = EXCLUDED.plan,
  "updatedAt" = NOW();

-- 2. Crear/Actualizar Menú
INSERT INTO menus (id, "restaurantId", "restaurantName", "contactPhone", "contactEmail", "contactAddress", "logoUrl", "googleMapsUrl", "googleReviewsUrl", description, waiters, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '${idUnico}',
  '<nombre_restaurante>',
  '<telefono>',
  '<email>',
  '<direccion>',
  '<logo_url>',
  '<google_maps_url>',
  '<google_reviews_url>',
  '<descripcion>',
  '<waiters_json>',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM menus WHERE "restaurantId" = '${idUnico}'
);

-- 3. Insertar Categorías (ejemplo)
-- INSERT INTO categories (id, "menuId", name, description, code, position, "createdAt", "updatedAt")
-- VALUES 
--   (gen_random_uuid(), (SELECT id FROM menus WHERE "restaurantId" = '${idUnico}'), 'Entradas', 'Descripción', 'ENT', 1, NOW(), NOW()),
--   (gen_random_uuid(), (SELECT id FROM menus WHERE "restaurantId" = '${idUnico}'), 'Platos Principales', 'Descripción', 'PP', 2, NOW(), NOW());

-- 4. Insertar Items (ejemplo)
-- INSERT INTO "menuItems" (id, "menuId", "categoryId", name, description, price, code, position, "imageUrl", "isAvailable", "isPopular", "isPromo", "createdAt", "updatedAt")
-- VALUES 
--   (gen_random_uuid(), (SELECT id FROM menus WHERE "restaurantId" = '${idUnico}'), (SELECT id FROM categories WHERE "menuId" = (SELECT id FROM menus WHERE "restaurantId" = '${idUnico}') AND name = 'Entradas'), 'Item 1', 'Descripción', 10000, 'ITEM1', 1, NULL, true, false, false, NOW(), NOW());

-- NOTA: Para un restore completo, necesitarás ejecutar los INSERTs con todos tus datos reales.
`;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} pb-20`}>
      <header className={`p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-2xl font-bold text-center">Configuración</h1>
        <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ID: {idUnico}</p>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Sección Backup */}
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              💾 Backup de Datos
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Exporta todos los datos de tu comercio desde Supabase
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Instrucciones:</strong>
              </p>
              <ol className={`list-decimal list-inside space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Ve a Supabase → SQL Editor</li>
                <li>Copia el SQL de abajo</li>
                <li>Ejecuta cada SELECT para exportar los datos</li>
                <li>Guarda los resultados en archivos .sql o .csv</li>
              </ol>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    SQL para Backup:
                  </label>
                  <button
                    onClick={() => copyToClipboard(backupSQL, 'backup')}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      copied === 'backup'
                        ? 'bg-green-600 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {copied === 'backup' ? '✓ Copiado' : 'Copiar SQL'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={backupSQL}
                  className={`w-full h-64 px-3 py-2 rounded-lg border font-mono text-xs ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-600 text-gray-300' 
                      : 'bg-gray-50 border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección Restore */}
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              🔄 Restore de Datos
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Importa datos desde un backup a Supabase
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Instrucciones:</strong>
              </p>
              <ol className={`list-decimal list-inside space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Ve a Supabase → SQL Editor</li>
                <li>Reemplaza los valores entre &lt; &gt; con tus datos reales</li>
                <li>Ejecuta los INSERTs en orden (Usuario → Menú → Categorías → Items)</li>
                <li>Verifica que los datos se hayan importado correctamente</li>
              </ol>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    SQL para Restore:
                  </label>
                  <button
                    onClick={() => copyToClipboard(restoreSQL, 'restore')}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      copied === 'restore'
                        ? 'bg-green-600 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {copied === 'restore' ? '✓ Copiado' : 'Copiar SQL'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={restoreSQL}
                  className={`w-full h-64 px-3 py-2 rounded-lg border font-mono text-xs ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-600 text-gray-300' 
                      : 'bg-gray-50 border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              ℹ️ Información Importante
            </h2>
          </div>
          <div className="p-4">
            <ul className={`list-disc list-inside space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li><strong>Backup:</strong> Realiza backups periódicos antes de hacer cambios importantes.</li>
              <li><strong>Restore:</strong> El restore reemplazará los datos existentes. Úsalo con precaución.</li>
              <li><strong>Imágenes:</strong> Las imágenes se guardan en <code className="bg-gray-700 px-1 rounded">/public/platos/{idUnico}/</code>. Haz backup de esa carpeta también.</li>
              <li><strong>Supabase:</strong> Puedes usar el Table Editor de Supabase para ver/editar datos visualmente.</li>
            </ul>
          </div>
        </div>
      </main>

      <NavBar idUnico={idUnico} />
    </div>
  );
}
