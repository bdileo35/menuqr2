"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DevBanner from "../components/DevBanner";

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

interface ProcessedMenu {
  categories: ExtractedCategory[];
  summary: {
    totalItems: number;
    duplicatesRemoved: number;
    categoriesFound: number;
    processingTime: string;
  };
  rawData: ExtractedCategory[];
}

export default function ScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedCategory[]>([]);
  const [processedMenu, setProcessedMenu] = useState<ProcessedMenu | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDemoImages, setShowDemoImages] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Detectar si venimos del demo
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      setIsDemo(true);
    }
  }, []);

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

    // Mostrar preview de la primera imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImages(prev => [...prev, e.target?.result as string]);
    };
    reader.readAsDataURL(files[0]);

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
    
    // Generar datos completos del menú de Esquina Pompeya (74 productos en 4 páginas)
    const mockDataSets: ExtractedCategory[][] = [
      // Página 1 - Platos del Día y Promos
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
            { name: "Peceto al verdeo c/ Puré", price: "$15000", confidence: 0.91 },
            { name: "Arroz integral con vegetales", price: "$11000", confidence: 0.89 },
            { name: "Tallarines a la crema c/ pollo", price: "$12000", confidence: 0.93 },
            { name: "Salmón grillado c/ pure", price: "$18000", confidence: 0.88 }
          ]
        },
        {
          name: "PROMOS DE LA SEMANA", 
          items: [
            { name: "PROMO 1: Milanesa c/Papas + Postre + Bebida", price: "$12000", confidence: 0.89 },
            { name: "PROMO 2: Salpicón de Ave + Postre + Bebida", price: "$12000", confidence: 0.86 },
            { name: "PROMO 3: Hamburguesa + Papas + Bebida", price: "$10000", confidence: 0.91 },
            { name: "PROMO 4: Pizza + Faina + Bebida", price: "$14000", confidence: 0.87 },
            { name: "PROMO 5: Parrillada + Ensalada + Postre", price: "$25000", confidence: 0.93 }
          ]
        }
      ],
      // Página 2 - Cocina y Tortillas
      [
        {
          name: "COCINA",
          items: [
            { name: "Arepa de Pollo", price: "$7500", confidence: 0.93 },
            { name: "Arepa de Carne", price: "$8000", confidence: 0.91 },
            { name: "Arepa de Queso", price: "$6500", confidence: 0.89 },
            { name: "Arepa Mixta", price: "$9000", confidence: 0.87 },
            { name: "Casuela de Mariscos", price: "$16000", confidence: 0.95 },
            { name: "Pollo al Curry", price: "$13000", confidence: 0.92 },
            { name: "Lomo Saltado", price: "$15000", confidence: 0.88 },
            { name: "Churrasco c/ Chimichurri", price: "$17000", confidence: 0.90 },
            { name: "Rabas a la Romana", price: "$12000", confidence: 0.86 },
            { name: "Cazuela de Cordero", price: "$19000", confidence: 0.94 }
          ]
        },
        {
          name: "TORTILLAS",
          items: [
            { name: "Tortilla Española", price: "$8500", confidence: 0.91 },
            { name: "Tortilla de Papa", price: "$7500", confidence: 0.89 },
            { name: "Tortilla de Jamón y Queso", price: "$9000", confidence: 0.93 },
            { name: "Tortilla de Verduras", price: "$8000", confidence: 0.87 },
            { name: "Tortilla de Atún", price: "$9500", confidence: 0.85 }
          ]
        }
      ],
      // Página 3 - Omelets y Sándwiches
      [
        {
          name: "OMELETS",
          items: [
            { name: "Omelet de Jamón y Queso", price: "$7000", confidence: 0.92 },
            { name: "Omelet de Verduras", price: "$6500", confidence: 0.90 },
            { name: "Omelet de Champiñones", price: "$7500", confidence: 0.88 },
            { name: "Omelet de Finas Hierbas", price: "$7200", confidence: 0.86 },
            { name: "Omelet de Atún", price: "$8000", confidence: 0.94 }
          ]
        },
        {
          name: "SANDWICHES",
          items: [
            { name: "Sándwich de Milanesa", price: "$6500", confidence: 0.93 },
            { name: "Sándwich de Bondiola", price: "$8500", confidence: 0.91 },
            { name: "Sándwich de Pollo Grillado", price: "$7500", confidence: 0.89 },
            { name: "Sándwich Vegetariano", price: "$6000", confidence: 0.87 },
            { name: "Sándwich de Lomito", price: "$9500", confidence: 0.95 },
            { name: "Club Sándwich", price: "$8000", confidence: 0.92 },
            { name: "Sándwich de Atún", price: "$7000", confidence: 0.88 },
            { name: "Sándwich Croque Monsieur", price: "$8500", confidence: 0.90 },
            { name: "Sándwich de Salmón", price: "$11000", confidence: 0.86 },
            { name: "Panini de Vegetales", price: "$7200", confidence: 0.84 }
          ]
        }
      ],
      // Página 4 - Entradas y Empanadas
      [
        {
          name: "ENTRADAS",
          items: [
            { name: "Tabla de Fiambres", price: "$14000", confidence: 0.93 },
            { name: "Provoleta a la Parrilla", price: "$6500", confidence: 0.91 },
            { name: "Mozzarella Caprese", price: "$7500", confidence: 0.89 },
            { name: "Hummus c/ Pan Pita", price: "$5500", confidence: 0.87 },
            { name: "Bruschettas Mixtas", price: "$6000", confidence: 0.95 },
            { name: "Ceviche de Pescado", price: "$9500", confidence: 0.92 },
            { name: "Carpaccio de Carne", price: "$11000", confidence: 0.88 },
            { name: "Tabla de Quesos", price: "$12000", confidence: 0.90 },
            { name: "Palta Rellena", price: "$8000", confidence: 0.86 },
            { name: "Croquetas de Jamón", price: "$7000", confidence: 0.94 }
          ]
        },
        {
          name: "EMPANADAS",
          items: [
            { name: "Empanadas de Carne", price: "$600", description: "c/u", confidence: 0.95 },
            { name: "Empanadas de Pollo", price: "$600", description: "c/u", confidence: 0.93 },
            { name: "Empanadas de Jamón y Queso", price: "$600", description: "c/u", confidence: 0.91 },
            { name: "Empanadas de Verdura", price: "$550", description: "c/u", confidence: 0.89 },
            { name: "Empanadas de Atún", price: "$700", description: "c/u", confidence: 0.87 },
            { name: "Empanadas de Choclo", price: "$550", description: "c/u", confidence: 0.85 },
            { name: "Empanadas Caprese", price: "$650", description: "c/u", confidence: 0.92 },
            { name: "Empanadas Árabes", price: "$700", description: "c/u", confidence: 0.90 }
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

  // Función para eliminar duplicados inteligentemente
  const removeDuplicates = (categories: ExtractedCategory[]): ExtractedCategory[] => {
    const processedCategories: ExtractedCategory[] = [];
    const seenItems = new Set<string>();
    
    categories.forEach(category => {
      const uniqueItems = category.items.filter(item => {
        const itemKey = `${item.name.toLowerCase().trim()}-${item.price}`;
        if (seenItems.has(itemKey)) {
          return false;
        }
        seenItems.add(itemKey);
        return true;
      });
      
      if (uniqueItems.length > 0) {
        processedCategories.push({
          ...category,
          items: uniqueItems
        });
      }
    });
    
    return processedCategories;
  };

  // Función para procesar y generar resumen inteligente
  const processIntelligentMenu = () => {
    if (!extractedData.length) return;
    
    const startTime = Date.now();
    const originalItemCount = extractedData.reduce((acc, cat) => acc + cat.items.length, 0);
    
    // Eliminar duplicados
    const dedupedData = removeDuplicates(extractedData);
    const finalItemCount = dedupedData.reduce((acc, cat) => acc + cat.items.length, 0);
    
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    const processedResult: ProcessedMenu = {
      categories: dedupedData,
      summary: {
        totalItems: finalItemCount,
        duplicatesRemoved: originalItemCount - finalItemCount,
        categoriesFound: dedupedData.length,
        processingTime: `${processingTime}s`
      },
      rawData: extractedData
    };
    
    setProcessedMenu(processedResult);
  };

  // Función para cargar imágenes demo
  const loadDemoImages = async () => {
    const demoImageNames = [
      'IMG-20250926-WA0005.jpg',
      'IMG-20250926-WA0006.jpg', 
      'IMG-20250926-WA0007.jpg',
      'IMG-20250926-WA0008.jpg'
    ];
    
    const demoImages = demoImageNames.map(name => `/demo-images/${name}`);
    setSelectedImages(demoImages);
    setShowDemoImages(true);
    
    // Simular procesamiento automático de las imágenes demo
    setIsProcessing(true);
    setProgress(0);
    
    for (let i = 0; i < demoImages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(((i + 1) / demoImages.length) * 70);
      setCurrentImageIndex(i);
      
      // Simular datos reales extraídos
      const mockExtracted = await simulateOCRFromDemo(i);
      if (i === 0) {
        setExtractedData(mockExtracted);
      } else {
        setExtractedData(prev => [...prev, ...mockExtracted]);
      }
    }
    
    setProgress(100);
    setIsProcessing(false);
    
    // Procesar automáticamente después de cargar
    setTimeout(() => {
      processIntelligentMenu();
    }, 500);
  };

  // Datos completos basados en el menú real de Esquina Pompeya del MD
  const simulateOCRFromDemo = async (imageIndex: number): Promise<ExtractedCategory[]> => {
    const realMenuData = [
      // Página 1 - Platos del Día y Promos
      [
        {
          name: "PLATOS DEL DÍA",
          items: [
            { name: "Rinioncitos al jerez c/ puré", price: "$9000", description: "Riñones al jerez con puré cremoso", confidence: 0.95 },
            { name: "Croquetas de carne c/ ensalada", price: "$9000", description: "Croquetas artesanales con ensalada fresca", confidence: 0.94 },
            { name: "Chupín de merluza c/ papa natural", price: "$10000", description: "Chupín de merluza con papas naturales", confidence: 0.92 },
            { name: "Pechuga rellena c/ f. españolas", price: "$12000", description: "Pechuga rellena con papas españolas", confidence: 0.93 },
            { name: "Mejillones c/ fettuccinis", price: "$12000", description: "Mejillones frescos con fettuccinis", confidence: 0.91 },
            { name: "Vacío a la parrilla c/ fritas", price: "$14000", description: "Vacío a la parrilla con papas fritas", confidence: 0.96 },
            { name: "Peceto al verdeo c/ puré", price: "$15000", description: "Peceto al verdeo con puré", confidence: 0.94 },
            { name: "Correntinos caseros a la Vangoli", price: "$13000", description: "Correntinos caseros estilo Vangoli", confidence: 0.93 }
          ]
        },
        {
          name: "PROMOS DE LA SEMANA",
          items: [
            { name: "Promo 1", price: "$12000", description: "Entraña c/ arroz + postre + bebida", confidence: 0.95 },
            { name: "Promo 2", price: "$12000", description: "Salpicón de ave + postre + bebida", confidence: 0.94 }
          ]
        }
      ],
      // Página 2 - Tortillas y Omelets
      [
        {
          name: "TORTILLAS",
          items: [
            { name: "Papas", price: "$8000", description: "Tortilla de papas clásica", confidence: 0.96 },
            { name: "Papas c/ cebolla", price: "$9000", description: "Tortilla de papas con cebolla", confidence: 0.95 },
            { name: "Española", price: "$10000", description: "Tortilla española tradicional", confidence: 0.94 },
            { name: "Verdura", price: "$8000", description: "Tortilla de verduras frescas", confidence: 0.93 },
            { name: "Papas fritas porción", price: "$6000", description: "Porción de papas fritas", confidence: 0.95 },
            { name: "Puré porción", price: "$6000", description: "Porción de puré", confidence: 0.94 },
            { name: "P. de papas fritas", price: "$6000", description: "Porción papas fritas", confidence: 0.95 },
            { name: "P. de puré de papas/calabaza", price: "$6000", description: "Porción puré papas o calabaza", confidence: 0.94 }
          ]
        },
        {
          name: "OMELETS",
          items: [
            { name: "Omelet c/ jamón", price: "$7000", description: "Omelet con jamón", confidence: 0.96 },
            { name: "Omelet c/ jamón y queso", price: "$8000", description: "Omelet jamón y queso", confidence: 0.95 },
            { name: "Omelet c/ jamón, queso y tomate", price: "$9000", description: "Omelet completo", confidence: 0.94 },
            { name: "Omelet de verdura", price: "$7000", description: "Omelet de verduras", confidence: 0.93 }
          ]
        }
      ],
      // Página 3 - Cocina
      [
        {
          name: "COCINA",
          items: [
            { name: "1/4 Pollo al horno c/ papas", price: "$9000", description: "Cuarto de pollo al horno con papas", confidence: 0.95 },
            { name: "1/4 Pollo provenzal c/ fritas", price: "$10000", description: "Pollo provenzal con papas fritas", confidence: 0.94 },
            { name: "Matambre al verdeo c/ fritas", price: "$12000", description: "Matambre al verdeo con fritas", confidence: 0.93 },
            { name: "Matambre a la pizza c/ fritas", price: "$12000", description: "Matambre a la pizza con fritas", confidence: 0.92 },
            { name: "Bondiola al ajillo c/ fritas", price: "$12000", description: "Bondiola al ajillo con fritas", confidence: 0.94 },
            { name: "Bondiola al verdeo c/ papas", price: "$12000", description: "Bondiola al verdeo con papas", confidence: 0.93 },
            { name: "Costillitas (2) a la riojana", price: "$18000", description: "2 costillitas a la riojana", confidence: 0.91 },
            { name: "Vacío al horno c/ papas", price: "$14000", description: "Vacío al horno con papas", confidence: 0.95 },
            { name: "Vacío a la parrilla c/ guarnición", price: "$15000", description: "Vacío a la parrilla con ensalada", confidence: 0.96 },
            { name: "Peceto horneado al vino c/ f. españolas", price: "$15000", description: "Peceto al vino con papas españolas", confidence: 0.94 }
          ]
        }
      ],
      // Página 4 - Sándwiches y Entradas  
      [
        {
          name: "SÁNDWICHES FRÍOS",
          items: [
            { name: "Francés jamón y queso", price: "$6000", description: "Pan francés con jamón y queso", confidence: 0.96 },
            { name: "Francés salame y queso", price: "$6000", description: "Pan francés con salame y queso", confidence: 0.95 },
            { name: "Francés jamón crudo y queso", price: "$7000", description: "Pan francés con jamón crudo", confidence: 0.94 },
            { name: "Sandwich de matambre casero", price: "$7000", description: "Matambre casero en pan", confidence: 0.93 }
          ]
        },
        {
          name: "SÁNDWICHES CALIENTES",
          items: [
            { name: "Sw. milanesa simple", price: "$5000", description: "Sándwich de milanesa simple", confidence: 0.96 },
            { name: "Sw. milanesa LyT", price: "$6000", description: "Milanesa con lechuga y tomate", confidence: 0.95 },
            { name: "Sw. milanesa completo", price: "$7000", description: "Milanesa completa", confidence: 0.94 },
            { name: "Sw. lomito solo simple", price: "$8000", description: "Lomito simple", confidence: 0.93 },
            { name: "Sw. lomito completo", price: "$10000", description: "Lomito completo", confidence: 0.92 },
            { name: "Sw. bondiola completo", price: "$10000", description: "Bondiola completa", confidence: 0.91 }
          ]
        },
        {
          name: "ENTRADAS",
          items: [
            { name: "Picada para 1", price: "$10000", description: "Picada individual", confidence: 0.95 },
            { name: "Picada para 2", price: "$19000", description: "Picada para dos personas", confidence: 0.94 },
            { name: "Matambre casero c/ rusa", price: "$10000", description: "Matambre con ensalada rusa", confidence: 0.93 },
            { name: "Empanadas Carne/Pollo/JyQ", price: "$1600", description: "Empanadas c/u", confidence: 0.96 },
            { name: "Empanadas Atún", price: "$1800", description: "Empanadas de atún c/u", confidence: 0.95 }
          ]
        }
      ]
    ];
    
    return realMenuData[imageIndex % realMenuData.length];
  };

  const handleSaveMenu = async () => {
    if (!processedMenu?.categories.length) return;
    
    try {
      // Guardar datos procesados
      console.log('Saving processed menu data:', processedMenu);
      
      // Guardar en localStorage para el demo
      localStorage.setItem('demo-processed-menu', JSON.stringify(processedMenu));
      
      // Redirección según contexto
      if (isDemo) {
        alert('¡Menú procesado correctamente! Continuando al editor...');
        router.push('/demo/editor');
      } else {
        alert('¡Menú digitalizado correctamente! Continuando al editor...');
        router.push('/editor');
      }
      
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Error guardando el menú. Intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DevBanner />
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <span>←</span>
                <span>Volver</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold">📷 MenuQR</h1>
                <p className="text-gray-400 text-sm">
                  Paso 2 de 4 - Tu carta/menú digital QR
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm">
                🌙
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progreso del Setup</span>
              <span>50% completado</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" style={{width: '50%'}}></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm text-blue-400">1. Datos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-sm text-white font-medium">2. Scanner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-600 text-gray-300 rounded-full flex items-center justify-center text-xs">3</div>
              <span className="text-sm text-gray-400">3. Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-600 text-gray-300 rounded-full flex items-center justify-center text-xs">4</div>
              <span className="text-sm text-gray-400">4. Carta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Panel de carga */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📸 Subir Imagen de la Carta
            </h2>
            
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-700 transition-all duration-200"
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
                    <p className="text-sm text-gray-300 mb-2">
                      +{selectedImages.length - 4} imágenes más...
                    </p>
                  )}
                  <p className="text-green-600 font-medium">
                    ✅ {selectedImages.length} imagen{selectedImages.length > 1 ? 'es' : ''} cargada{selectedImages.length > 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl text-gray-400 mb-4">📷</div>
                  <p className="text-gray-300 mb-2">Haz clic para seleccionar imágenes</p>
                  <p className="text-sm text-gray-400">PNG, JPG hasta 10MB • Múltiples archivos permitidos</p>
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

            {/* Botón Demo para presentación */}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <button
                onClick={loadDemoImages}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                🚀 Cargar Demo con Fotos Reales
              </button>
              <p className="text-xs text-gray-400 mt-1 text-center">
                Perfecto para presentaciones • Datos reales de restaurante
              </p>
            </div>
            
            {/* Barra de progreso */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>
                    Procesando imagen {currentImageIndex + 1} de {selectedImages.length}...
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Instrucciones */}
            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">💡 Tips para mejores resultados:</h3>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Usa buena iluminación</li>
                <li>• Mantén la carta plana y recta</li>
                <li>• Evita reflejos y sombras</li>
                <li>• Asegúrate que el texto sea legible</li>
              </ul>
            </div>
          </div>

          {/* Panel de resultados */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              🤖 Datos Extraídos por IA
            </h2>
            
            {extractedData.length > 0 ? (
              <div className="space-y-4">
                {extractedData.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                    <h3 className="font-bold text-lg text-white mb-3 border-b border-gray-600 pb-2">
                      {category.name}
                    </h3>
                    
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-start p-3 bg-gray-800 rounded border border-gray-600">
                          <div className="flex-1">
                            <div className="font-medium text-white">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-300">{item.description}</div>
                            )}
                            <div className="text-xs text-green-400 font-medium">
                              Confianza: {(item.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="font-bold text-blue-400 ml-4">
                            {item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Botón para procesar inteligentemente */}
                {extractedData.length > 0 && !processedMenu && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={processIntelligentMenu}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      🧠 Procesar con IA - Eliminar Duplicados
                    </button>
                    <p className="text-sm text-gray-300 mt-2">
                      Optimiza automáticamente tu menú eliminando repeticiones y organizando categorías
                    </p>
                  </div>
                )}

                {/* Resumen Inteligente */}
                {processedMenu && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-700">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                      🧠 Procesamiento Inteligente Completado
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-400">{processedMenu.summary.totalItems}</div>
                        <div className="text-xs text-gray-300">Elementos finales</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-400">{processedMenu.summary.duplicatesRemoved}</div>
                        <div className="text-xs text-gray-300">Duplicados eliminados</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-400">{processedMenu.summary.categoriesFound}</div>
                        <div className="text-xs text-gray-300">Categorías detectadas</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">{processedMenu.summary.processingTime}</div>
                        <div className="text-xs text-gray-300">Tiempo procesamiento</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        onClick={processIntelligentMenu}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                      >
                        🔄 Re-procesar datos
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Botones de acción */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveMenu}
                    disabled={!processedMenu && extractedData.length === 0}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    ✅ Guardar Menú {processedMenu ? 'Optimizado' : 'Digital'}
                  </button>
                  <button
                    onClick={() => {
                      setExtractedData([]);
                      setProcessedMenu(null);
                      setSelectedImages([]);
                      setShowDemoImages(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    🔄 Reiniciar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="font-medium">Los datos extraídos aparecerán aquí</p>
                <p className="text-sm">Sube una imagen para comenzar el análisis OCR</p>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            🚀 ¿Cómo funciona el Scanner OCR?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-900/30 rounded-lg border border-blue-700">
              <div className="text-3xl mb-2">📷</div>
              <h3 className="font-semibold text-blue-300 mb-2">1. Captura</h3>
              <p className="text-sm text-blue-200">Sube la foto de tu carta física</p>
            </div>
            
            <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-700">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold text-green-300 mb-2">2. Procesamiento IA</h3>
              <p className="text-sm text-green-200">OCR extrae texto y precios automáticamente</p>
            </div>
            
            <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="text-3xl mb-2">💾</div>
              <h3 className="font-semibold text-gray-300 mb-2">3. Menú Digital</h3>
              <p className="text-sm text-gray-300">Se genera tu menú digital listo para usar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar - Footer fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 mb-2">
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-blue-500 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
          </div>
          <div className="text-center text-sm text-gray-400">
            Setup → Scanner → Editor → Personalización → QR
          </div>
        </div>
      </div>
    </div>
  );
}