"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface ExtractedMenuItem {
  name: string;
  price: string;
  description?: string;
  confidence: number;
}

interface ExtractedCategory {
  name: string;
  items: ExtractedMenuItem[];
}

export default function ScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedCategory[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const newImageUrls: string[] = [];

    // Procesar cada archivo
    for (const file of newFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        newImageUrls.push(imageUrl);
        
        // Cuando se hayan procesado todas las imágenes
        if (newImageUrls.length === newFiles.length) {
          setSelectedImages(prev => [...prev, ...newImageUrls]);
          setUploadedFiles(prev => [...prev, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    }

    // Mostrar preview de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Procesar todas las imágenes con OCR
    if (newFiles.length > 0) {
      setIsProcessing(true);
      setProgress(10);

      try {
        // Procesar cada imagen
        for (let i = 0; i < newFiles.length; i++) {
          setCurrentImageIndex(i);
          await simulateOCRProcessing(newFiles[i], i);
        }
      } catch (error) {
        console.error('Error processing images:', error);
        alert('Error procesando las imágenes. Intente nuevamente.');
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setCurrentImageIndex(0);
      }
    }
  };

  const simulateOCRProcessing = async (file: File, imageIndex: number = 0) => {
    // Simulación del procesamiento OCR con datos de ejemplo
    // En producción aquí iría la API de OCR (Google Vision, Tesseract, etc.)
    
    const baseProgress = (imageIndex / uploadedFiles.length) * 100;
    const stepProgress = 100 / uploadedFiles.length;
    
    setProgress(baseProgress + stepProgress * 0.3);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProgress(baseProgress + stepProgress * 0.6);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProgress(baseProgress + stepProgress * 0.9);
    
    // Generar datos diferentes según la imagen (simular múltiples cartas)
    const mockDataSets: ExtractedCategory[][] = [
      // Dataset 1 - Página principal del menú
      [
        {
          name: "PLATOS DEL DIA",
          items: [
            { name: "Milanesas al horno c/ Puré", price: "$9000", confidence: 0.95 },
            { name: "Croquetas de carne c/ensalada", price: "$8000", confidence: 0.92 },
            { name: "Chuleta de merluza c/rusa gatura", price: "$10000", confidence: 0.88 },
            { name: "Pechuga rellena c/ f. españolas", price: "$12000", confidence: 0.90 },
            { name: "Mejillones c/ fetuccinis", price: "$14000", confidence: 0.87 },
            { name: "Vacío a la parrilla c/fritas", price: "$15000", confidence: 0.94 },
            { name: "Peceto al verdeo c/ Puré", price: "$15000", confidence: 0.91 }
          ]
        },
        {
          name: "PROMOS DE LA SEMANA", 
          items: [
            { name: "PROMO 1: Milanesa c/Papas + Postre + Bebida", price: "$12000", confidence: 0.89 },
            { name: "PROMO 2: Salpicón de Ave + Postre + Bebida", price: "$12000", confidence: 0.86 }
          ]
        }
      ],
      // Dataset 2 - Página de empanadas y minutas
      [
        {
          name: "EMPANADAS",
          items: [
            { name: "Carne - Pollo - J y Q", price: "$600", description: "Docena", confidence: 0.93 },
            { name: "Atún, Chía", price: "$800", description: "Docena", confidence: 0.91 }
          ]
        },
        {
          name: "MINUTAS",
          items: [
            { name: "Hamburguesa completa", price: "$7000", confidence: 0.88 },
            { name: "Sándwich de milanesa", price: "$6500", confidence: 0.90 },
            { name: "Tostado jamón y queso", price: "$4000", confidence: 0.94 }
          ]
        }
      ],
      // Dataset 3 - Página de parrilla y carnes
      [
        {
          name: "PARRILLA",
          items: [
            { name: "Bife de chorizo", price: "$18000", confidence: 0.92 },
            { name: "Entraña completa", price: "$16000", confidence: 0.89 },
            { name: "Costillar de cerdo", price: "$14000", confidence: 0.87 },
            { name: "Chorizo casero", price: "$8000", confidence: 0.95 }
          ]
        }
      ]
    ];
    
    // Seleccionar dataset según el índice de la imagen
    const selectedDataset = mockDataSets[imageIndex % mockDataSets.length];
    
    setProgress(baseProgress + stepProgress);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Combinar con datos existentes si es que hay
    if (imageIndex === 0) {
      setExtractedData(selectedDataset);
    } else {
      setExtractedData(prev => [...prev, ...selectedDataset]);
    }
    
  };

  const handleSaveMenu = async () => {
    if (!extractedData.length) return;
    
    try {
      // Aquí enviaríamos los datos extraídos al backend para crear el menú
      console.log('Saving extracted menu data:', extractedData);
      
      // Simular guardado exitoso
      alert('¡Menú digitalizado correctamente! Redirigiendo al panel de control...');
      router.push('/admin/dashboard');
      
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Error guardando el menú. Intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header - Estilo QRing */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-4 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            ← Volver
          </button>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            📷 Scanner OCR de Cartas
          </h1>
          <p className="text-slate-600">
            Digitaliza tu carta física automáticamente con inteligencia artificial
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Panel de carga - Estilo QRing */}
          <div className="card-qring p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              📸 Subir Imagen de la Carta
            </h2>
            
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImages.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedImages.slice(0, 4).map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`Carta ${index + 1}`} 
                        className="w-full h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                  {selectedImages.length > 4 && (
                    <p className="text-sm text-slate-600 mb-2">
                      +{selectedImages.length - 4} imágenes más...
                    </p>
                  )}
                  <p className="text-green-600 font-medium">
                    ✅ {selectedImages.length} imagen{selectedImages.length > 1 ? 'es' : ''} cargada{selectedImages.length > 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl text-slate-400 mb-4">📷</div>
                  <p className="text-slate-600 mb-2">Haz clic para seleccionar imágenes</p>
                  <p className="text-sm text-slate-500">PNG, JPG hasta 10MB • Múltiples archivos permitidos</p>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* Barra de progreso */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>
                    Procesando imagen {currentImageIndex + 1} de {selectedImages.length}...
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Instrucciones - Estilo QRing */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Tips para mejores resultados:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Usa buena iluminación</li>
                <li>• Mantén la carta plana y recta</li>
                <li>• Evita reflejos y sombras</li>
                <li>• Asegúrate que el texto sea legible</li>
              </ul>
            </div>
          </div>

          {/* Panel de resultados - Estilo QRing */}
          <div className="card-qring p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              🤖 Datos Extraídos por IA
            </h2>
            
            {extractedData.length > 0 ? (
              <div className="space-y-4">
                {extractedData.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800 mb-3 border-b border-slate-300 pb-2">
                      {category.name}
                    </h3>
                    
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-start p-3 bg-white rounded border border-slate-100 shadow-sm">
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-slate-600">{item.description}</div>
                            )}
                            <div className="text-xs text-emerald-600 font-medium">
                              Confianza: {(item.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="font-bold text-blue-600 ml-4">
                            {item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Botones de acción - Estilo QRing */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveMenu}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    ✅ Guardar Menú Digital
                  </button>
                  <button
                    onClick={() => setExtractedData([])}
                    className="btn-qring-secondary"
                  >
                    🔄 Reiniciar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="font-medium">Los datos extraídos aparecerán aquí</p>
                <p className="text-sm">Sube una imagen para comenzar el análisis OCR</p>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional - Estilo QRing */}
        <div className="mt-8 card-qring p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            🚀 ¿Cómo funciona el Scanner OCR?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl mb-2">📷</div>
              <h3 className="font-semibold text-blue-800 mb-2">1. Captura</h3>
              <p className="text-sm text-blue-700">Sube la foto de tu carta física</p>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold text-emerald-800 mb-2">2. Procesamiento IA</h3>
              <p className="text-sm text-emerald-700">OCR extrae texto y precios automáticamente</p>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-3xl mb-2">💾</div>
              <h3 className="font-semibold text-slate-800 mb-2">3. Menú Digital</h3>
              <p className="text-sm text-slate-700">Se genera tu menú digital listo para usar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}