'use client';

import { useState } from 'react';

interface ExtractedItem {
  category: string;
  code?: string;
  name: string;
  price: number;
  description?: string;
}

export default function SmartScannerMejorado({ 
  onExtracted 
}: { 
  onExtracted: (data: ExtractedItem[]) => void 
}) {
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedItem[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const processWithAI = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const allItems: ExtractedItem[] = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        setProgress(Math.round(((i + 1) / images.length) * 100));

        const base64 = await fileToBase64(image);

        const response = await fetch('/api/ocr/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            model: 'gpt-4-vision' // o 'tesseract' para versión gratuita
          })
        });

        const result = await response.json();
        allItems.push(...result.items);
      }

      // Eliminar duplicados por nombre
      const unique = removeDuplicates(allItems);
      
      // Generar códigos automáticamente
      const withCodes = generateCodes(unique);

      setExtractedData(withCodes);
      onExtracted(withCodes);
    } catch (error) {
      console.error('Error procesando imágenes:', error);
      alert('Error al procesar las imágenes');
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeDuplicates = (items: ExtractedItem[]): ExtractedItem[] => {
    const seen = new Map<string, ExtractedItem>();
    
    for (const item of items) {
      const key = `${item.category}|${item.name.toLowerCase().trim()}`;
      if (!seen.has(key)) {
        seen.set(key, item);
      }
    }
    
    return Array.from(seen.values());
  };

  const generateCodes = (items: ExtractedItem[]): ExtractedItem[] => {
    const byCategory = new Map<string, ExtractedItem[]>();
    
    // Agrupar por categoría
    for (const item of items) {
      if (!byCategory.has(item.category)) {
        byCategory.set(item.category, []);
      }
      byCategory.get(item.category)!.push(item);
    }

    // Generar códigos
    let categoryIndex = 1;
    const result: ExtractedItem[] = [];

    Array.from(byCategory.entries()).forEach(([category, categoryItems]) => {
      const catCode = String(categoryIndex).padStart(2, '0');
      
      categoryItems.forEach((item, itemIndex) => {
        const itemCode = `${catCode}${String(itemIndex + 1).padStart(2, '0')}`;
        result.push({
          ...item,
          code: itemCode
        });
      });

      categoryIndex++;
    });

    return result;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">📸 Scanner Inteligente Multi-Imagen</h2>

      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 mb-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          id="multiImageUpload"
        />
        
        <label 
          htmlFor="multiImageUpload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          {images.length === 0 ? (
            <>
              <span className="text-4xl mb-2">📷</span>
              <p className="text-gray-400">Toca para subir múltiples imágenes</p>
              <p className="text-sm text-gray-500 mt-1">Soporta hasta 10 imágenes</p>
            </>
          ) : (
            <div className="w-full">
              <p className="text-green-500 mb-4">✅ {images.length} imágenes cargadas</p>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img 
                      src={URL.createObjectURL(img)}
                      alt={`Página ${i + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Process button */}
      <button
        onClick={processWithAI}
        disabled={images.length === 0 || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing 
          ? `🔄 Procesando... ${progress}%` 
          : '🚀 Procesar con IA'
        }
      </button>

      {/* Progress bar */}
      {isProcessing && (
        <div className="mt-4 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Results */}
      {extractedData.length > 0 && (
        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold mb-2">✅ Datos Extraídos</h3>
          <p className="text-sm text-gray-400 mb-4">
            {extractedData.length} platos en {new Set(extractedData.map(i => i.category)).size} categorías
          </p>
          
          <div className="max-h-96 overflow-y-auto">
            {Array.from(new Set(extractedData.map(i => i.category))).map(category => (
              <div key={category} className="mb-4">
                <h4 className="font-bold text-blue-400 mb-2">{category}</h4>
                {extractedData
                  .filter(item => item.category === category)
                  .map((item, i) => (
                    <div key={i} className="text-sm text-gray-300 ml-4 mb-1">
                      {item.code} - {item.name} - ${item.price}
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <p className="text-blue-400 font-bold mb-2">💡 Tips para mejores resultados:</p>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Usa buena iluminación</li>
          <li>• Mantén la carta plana y recta</li>
          <li>• Evita reflejos y sombras</li>
          <li>• Asegúrate que el texto sea legible</li>
          <li>• Sube todas las páginas del menú juntas</li>
        </ul>
      </div>
    </div>
  );
}

