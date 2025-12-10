'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDemoMenuData, getDemoMenuDataLosToritos } from '@/lib/demo-data';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  isPromo?: boolean;
  code?: string;
  imageBase64?: string;
  imageUrl?: string;
}

interface MenuCategory {
  id?: string;
  name: string;
  items: MenuItem[];
  code?: string;
  description?: string;
}

interface RestaurantData {
  restaurantName: string;
  address?: string;
  phone?: string;
  categories: MenuCategory[];
}

export default function Editor2() {
  const router = useRouter();
  const params = useParams();
  // Leer idUnico de los parámetros - sin default para forzar que venga de la URL
  const idUnico = (params?.idUnico as string) || '';
  
  // Debug: verificar que se lee correctamente
  useEffect(() => {
    console.log('🔍 Editor - idUnico desde URL:', idUnico);
    console.log('🔍 Editor - params completo:', params);
  }, [idUnico, params]);
  
  // Si no hay idUnico, mostrar error
  if (!idUnico) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error: ID Único no encontrado</h1>
          <p className="text-gray-600">La URL debe incluir un ID único válido</p>
          <p className="text-sm text-gray-500 mt-2">Ejemplo: /editor/5XJ1J37F</p>
        </div>
      </div>
    );
  }

  // Función para generar código de categoría
  const getCategoryCode = (categoryName: string, index: number): string => {
    // Categorías fijas en orden específico
    const fixedCategories = [
      { name: 'Platos del Día', code: '01' },
      { name: 'Promociones', code: '02' },
      { name: 'Cocina', code: '03' },
      { name: 'Parrilla', code: '04' }
    ];
    
    // Buscar si es una categoría fija
    const fixedCategory = fixedCategories.find(cat => 
      categoryName.toLowerCase().includes(cat.name.toLowerCase())
    );
    
    if (fixedCategory) {
      return fixedCategory.code;
    }
    
    // Si no es fija, usar índice + 4 (después de las fijas)
    return String(index + 5).padStart(2, '0');
  };

  // Función para generar código de plato
  const getItemCode = (categoryCode: string, itemIndex: number): string => {
    return `${categoryCode}${String(itemIndex + 1).padStart(2, '0')}`;
  };
  const generateNextCodeForCategory = (category: MenuCategory | undefined): string => {
    if (!category) return '0101';
    const base = category.code || getCategoryCode(category.name, 0);
    return getItemCode(base, category.items.length);
  };
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuNotFound, setMenuNotFound] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const { isDarkMode, toggleTheme } = useAppTheme(); // ✅ USANDO HOOK
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState<string>('');
  const [allCategoriesExpanded, setAllCategoriesExpanded] = useState(true);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [showEditCategory, setShowEditCategory] = useState(false);

  // Utilitario: archivo -> dataURL (para persistir imagen en localStorage)
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Función para cargar datos desde API
  const loadMenuFromAPI = async () => {
    console.log('🔍 Cargando menú desde la base de datos...');
    console.log('🔍 ID Único usado en la petición:', idUnico);
    
    if (!idUnico) {
      console.error('❌ Error: idUnico está vacío');
      return;
    }
    
    try {
      const response = await fetch(`/api/menu/${idUnico}`);
      console.log('🔍 URL de la petición:', `/api/menu/${idUnico}`);
      console.log('🔍 Status de la respuesta:', response.status);
      
      // Si es 404, el menú no existe para este IDU
      if (response.status === 404) {
        console.log(`⚠️ No se encontró menú para IDU: ${idUnico}`);
        setMenuNotFound(true);
        setMenuData(null);
        setLoading(false);
        return;
      }
      
      // Si es 500, hay un error de conexión (NO significa que no existe)
      if (response.status === 500) {
        console.log('⚠️ Error de conexión a la base de datos (500)');
        setConnectionError(true);
        throw new Error('Error de conexión a la base de datos');
      }
      
      const data = await response.json();
      
      if (data.success && data.menu) {
        console.log('✅ Menú cargado desde API:', data.menu);
    
        let restaurantInfo: RestaurantData = {
          restaurantName: data.menu.restaurantName,
          categories: data.menu.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          code: cat.code,
          items: cat.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: `$${item.price}`,
              description: item.description,
          isAvailable: item.isAvailable
        }))
      }))
        };

        // Fusionar con ediciones locales (fotos/isAvailable) si existen
        try {
          const savedStr = localStorage.getItem('editor-menu-data');
          if (savedStr) {
            const saved = JSON.parse(savedStr) as RestaurantData;
            const savedCatMap = new Map<string, any>();
            saved.categories.forEach(sc => {
              const key = sc.id || sc.name;
              savedCatMap.set(key, sc);
            });

            restaurantInfo = {
              ...restaurantInfo,
              categories: restaurantInfo.categories.map(rc => {
                const key = rc.id || rc.name;
                const sc = savedCatMap.get(key);
                if (!sc) return rc;
                const savedItemMap = new Map<string, any>();
                sc.items.forEach((si: any) => savedItemMap.set(si.id || si.name, si));

                // Merge de items existentes
                const mergedExisting = rc.items.map(ri => {
                  const si = savedItemMap.get(ri.id || ri.name);
                  if (!si) return ri;
                  const hasLocalImageProp = Object.prototype.hasOwnProperty.call(si, 'imageBase64');
                  const mergedImage = hasLocalImageProp ? si.imageBase64 : ri.imageBase64;
                  return {
                    ...ri,
                    imageBase64: mergedImage,
                    isAvailable: typeof si.isAvailable === 'boolean' ? si.isAvailable : ri.isAvailable,
                    name: si.name || ri.name,
                    description: si.description ?? ri.description,
                    price: si.price || ri.price,
                  } as any;
                });

                // Agregar items que sólo existen en localStorage (nuevos)
                const existingIdOrName = new Set(mergedExisting.map(i => (i as any).id || (i as any).name));
                const onlyLocal = sc.items.filter((si: any) => !existingIdOrName.has(si.id || si.name));
                const mergedAll = [...mergedExisting, ...onlyLocal];

                return {
                  ...rc,
                  items: mergedAll
                };
              })
            };
          }
        } catch (mergeErr) {
          console.warn('⚠️ No se pudo fusionar ediciones locales:', mergeErr);
        }

        setMenuData(restaurantInfo);
        
        // Expandir todas las categorías por defecto
        const initialExpanded: {[key: string]: boolean} = {};
        restaurantInfo.categories.forEach(cat => {
          initialExpanded[cat.id || cat.name] = true;
        });
        setExpandedCategories(initialExpanded);
        
      } else {
          throw new Error('No se pudo cargar el menú');
      }
    } catch (error) {
        console.error('❌ Error cargando menú desde API:', error);
        
        // ⚠️ IMPORTANTE: NO mostrar datos demo a clientes en producción
        // Solo mostrar error de conexión
        console.log('⚠️ Error de conexión a la base de datos');
        console.log(`❌ Error cargando menú para ${idUnico}:`, error);
        
        // FALLBACK REMOVIDO: No mostrar datos demo a clientes
        // Los datos demo solo deben usarse en desarrollo local
        setConnectionError(true);
        setMenuData(null);
        
        // Código comentado - fallback removido por seguridad
        // Los datos demo NO deben mostrarse a clientes en producción
        
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos desde API al montar y cuando cambia idUnico
  useEffect(() => {
    loadMenuFromAPI();
  }, [idUnico]);
  
  // Recargar datos cuando la página vuelve a estar visible o cuando se hace focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadMenuFromAPI();
      }
    };
    
    const handleFocus = () => {
      loadMenuFromAPI();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [idUnico]);

  // Función para filtrar platos por término de búsqueda
  const filterItems = (items: MenuItem[]) => {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  };

  // Toggle expandir/colapsar categoría
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Toggle expandir/contraer TODAS las categorías
  const toggleAllCategories = () => {
    const newExpandedState = !allCategoriesExpanded;
    setAllCategoriesExpanded(newExpandedState);
    
    if (menuData?.categories) {
      const newExpandedCategories: {[key: string]: boolean} = {};
      menuData.categories.forEach(cat => {
        newExpandedCategories[cat.id || cat.name] = newExpandedState;
      });
      setExpandedCategories(newExpandedCategories);
    }
  };

  // Estados para el modal de plato
  const [modalData, setModalData] = useState({
    name: '',
    code: '',
    price: '',
    description: '',
    categoryId: '',
    imageFile: null as File | null,
    imagePreview: '',
    isAvailable: true,  // ✅ AGREGAR ESTADO DISPONIBLE/AGOTADO
    removeImage: false
  });

  // Guardar item
  const handleSaveItem = async (item: MenuItem) => {
    try {
      setSaving(true);
      
      if (!menuData) {
        alert('❌ No hay datos del menú');
        return;
      }
      // Procesar imagen
      let finalImageUrl: string | null = null;
      
      if (modalData.removeImage) {
        finalImageUrl = null;
      } else if (modalData.imageFile) {
        // Nueva imagen subida
        try {
          const imageDataBase64 = await fileToDataURL(modalData.imageFile);
          
          // Subir imagen al servidor
          const uploadResponse = await fetch(`/api/menu/${idUnico}/upload-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: imageDataBase64,
              itemName: item.name
            })
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            finalImageUrl = uploadData.imageUrl; // /platos/{idUnico}/nombre.jpg
            console.log('✅ Imagen subida:', finalImageUrl);
          } else {
            console.error('Error subiendo imagen, usando base64');
            finalImageUrl = imageDataBase64; // Fallback a base64
          }
        } catch (e) {
          console.error('Error convirtiendo/subiendo imagen', e);
          finalImageUrl = null; // Fallback
        }
      } else {
        // No hay nueva imagen, mantener la existente
        if (editingItem?.imageUrl && editingItem.imageUrl.startsWith('/platos/')) {
          // Si ya es una URL de archivo, mantenerla
          finalImageUrl = editingItem.imageUrl;
        } else if (editingItem?.imageBase64 && editingItem.imageBase64.startsWith('/platos/')) {
          // Si imageBase64 es una URL, mantenerla
          finalImageUrl = editingItem.imageBase64;
        } else if (editingItem?.imageBase64) {
          // Si es base64 antiguo, mantenerlo por ahora
          finalImageUrl = editingItem.imageBase64;
        } else if (editingItem?.imageUrl) {
          // Si hay imageUrl, mantenerla
          finalImageUrl = editingItem.imageUrl;
        }
      }
      
      // Guardar en base de datos
      // Si no hay categoryId o es string vacío, es un item sin categoría (discontinuado)
      let categoryIdToSend: string | null = null;
      if (modalData.categoryId && modalData.categoryId.trim() !== '' && modalData.categoryId !== '__SIN_CATEGORIA__') {
        const targetCategory = menuData.categories.find(cat => (cat.id || cat.name) === modalData.categoryId);
        if (!targetCategory) {
          alert('❌ Categoría no encontrada');
          return;
        }
        categoryIdToSend = targetCategory.id || targetCategory.name;
        if (!categoryIdToSend) {
          alert('❌ ID de categoría inválido');
          return;
        }
      }
      // Si categoryId está vacío o es '__SIN_CATEGORIA__', categoryIdToSend queda como null

      // Preparar datos para la API
      const priceValue = item.price.toString().replace(/[$,\s]/g, '');
      const itemData = {
        name: item.name,
        description: item.description || '',
        price: priceValue,
        code: item.code?.trim() || '',
        categoryId: categoryIdToSend, // null para sin categoría
        imageUrl: finalImageUrl || null,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        isPopular: item.isPopular || false,
        isPromo: item.isPromo || false
      };

      if (editingItem && editingItem.id && !editingItem.id.match(/^\d+$/)) {
        // Actualizar item existente (tiene ID de BD)
        const response = await fetch(`/api/menu/${idUnico}/items`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            ...itemData
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al actualizar item');
        }

        alert('✅ Producto actualizado correctamente');
      } else {
        // Crear nuevo item
        const response = await fetch(`/api/menu/${idUnico}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al crear item');
        }

        alert('✅ Producto agregado correctamente');
      }

      // Recargar menú desde BD para tener datos actualizados
      const menuResponse = await fetch(`/api/menu/${idUnico}`);
      if (menuResponse.ok) {
        const menuDataResponse = await menuResponse.json();
        if (menuDataResponse.success && menuDataResponse.menu) {
          const restaurantInfo: RestaurantData = {
            restaurantName: menuDataResponse.menu.restaurantName,
            address: menuDataResponse.menu.contactAddress || 'Av. Fernández de la Cruz 1100',
            phone: menuDataResponse.menu.contactPhone || '+54 11 1234-5678',
            categories: menuDataResponse.menu.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              description: cat.description,
              items: cat.items.map((item: any) => {
                // Debug: verificar imageUrl
                if (item.imageUrl) {
                  console.log(`🖼️ Item "${item.name}": imageUrl =`, item.imageUrl);
                }
                return {
                  id: item.id,
                  name: item.name,
                  price: `$${item.price}`,
                  description: item.description,
                  isAvailable: item.isAvailable,
                  isPopular: item.isPopular || false,
                  isPromo: item.isPromo || false,
                  code: item.code,
                  // Asegurar que imageUrl se mantenga si existe
                  imageUrl: item.imageUrl || null,
                  // Si imageUrl es una URL de archivo, también ponerla en imageBase64 para compatibilidad
                  imageBase64: item.imageUrl && item.imageUrl.startsWith('/platos/') 
                    ? item.imageUrl 
                    : (item.imageUrl || null)
                };
              })
            }))
          };
          setMenuData(restaurantInfo);
          const initialExpanded: {[key: string]: boolean} = {};
          restaurantInfo.categories.forEach(cat => { initialExpanded[cat.id || cat.name] = true; });
          setExpandedCategories(initialExpanded);
        }
      }
      
      setEditingItem(null);
      setShowAddItem(false);
      setModalData({
        name: '',
        code: '',
        price: '',
        description: '',
        categoryId: '',
        imageFile: null,
        imagePreview: '',
        isAvailable: true,
        removeImage: false
      });
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('❌ Error al guardar. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // Estados para interacciones táctiles
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);

  // Abrir modal para editar plato
  const openEditPlateModal = (item: MenuItem, categoryId: string) => {
    // Si es "Sin categoría", usar '' para que el dropdown muestre "Sin categoría (discontinuado)"
    const modalCategoryId = (categoryId === '__SIN_CATEGORIA__' || !categoryId) ? '' : categoryId;
    const selectedCategory = menuData?.categories.find(cat => (cat.id || cat.name) === categoryId);
    const ensuredCode = item.code && item.code.trim().length > 0 ? item.code : generateNextCodeForCategory(selectedCategory);
    setModalData({
      name: item.name,
      code: ensuredCode,
      price: item.price,
      description: item.description || '',
      categoryId: modalCategoryId, // '' para items sin categoría
      imageFile: null,
      imagePreview: item.imageBase64 || '',
      isAvailable: item.isAvailable ?? true,  // ✅ INCLUIR ESTADO DISPONIBLE
      removeImage: !item.imageBase64
    });
    setEditingItem(item);
    setShowAddItem(true);
  };

  // Abrir modal para editar categoría
  const openEditCategoryModal = (category: MenuCategory) => {
    setEditingCategory(category);
    setShowEditCategory(true);
  };

  // Manejar inicio de toque (móvil)
  const handleTouchStart = (e: React.TouchEvent, action: 'category' | 'item', data: any) => {
    e.preventDefault();
    setTouchStartTime(Date.now());
    
    const timer = setTimeout(() => {
      // Sostener por más de 500ms
      if (action === 'category') {
        openEditCategoryModal(data);
      } else if (action === 'item') {
        openEditPlateModal(data.item, data.categoryId);
      }
    }, 500);
    
    setTouchTimer(timer);
  };

  // Manejar fin de toque (móvil)
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    
    const touchDuration = Date.now() - touchStartTime;
    
    // Si fue un toque corto, no hacer nada (evitar conflicto con doble click)
    if (touchDuration < 500) {
      return;
    }
  };

  // Manejar doble click (PC)
  const handleDoubleClick = (e: React.MouseEvent, action: 'category' | 'item', data: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'category') {
      openEditCategoryModal(data);
    } else if (action === 'item') {
      openEditPlateModal(data.item, data.categoryId);
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModalData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
        removeImage: false
      }));
    }
  };

  // Manejar cambio de categoría y generar código automáticamente
  const handleCategoryChange = (categoryId: string) => {
    // Si categoryId es '' o null, es "Sin categoría"
    if (!categoryId || categoryId === '') {
      setModalData(prev => ({
        ...prev,
        categoryId: '', // Mantener como string vacío para el select
        code: prev.code || '9999' // Código genérico para sin categoría
      }));
      return;
    }
    
    const selectedCategory = menuData?.categories.find(cat => (cat.id || cat.name) === categoryId);
    if (selectedCategory) {
      const generatedCode = generateNextCodeForCategory(selectedCategory);
      setModalData(prev => ({
        ...prev,
        categoryId: categoryId,
        code: generatedCode
      }));
    } else {
      // Si no encuentra la categoría, mantener el categoryId pero no cambiar el código
      setModalData(prev => ({
        ...prev,
        categoryId: categoryId
      }));
    }
  };

  // Eliminar item
  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${itemName}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }
    
    try {
      setSaving(true);
      
      if (!itemId) {
        // Si no tiene ID, es un item nuevo que solo está en localStorage
        setMenuData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            categories: prev.categories.map(cat => ({
              ...cat,
              items: cat.items.filter(item => (item.id || item.name) !== itemId)
            }))
          };
        });
        alert('✅ Producto eliminado');
        setShowAddItem(false);
        setEditingItem(null);
        return;
      }

      // Buscar el item en el menú para obtener su categoría
      const category = menuData?.categories.find(cat => 
        cat.items.some(item => (item.id || item.name) === itemId)
      );
      
      if (!category) {
        alert('❌ No se pudo encontrar el producto');
        return;
      }

      // Llamar al API para eliminar
      // Verificar si es un ID de BD (no numérico) o un ID temporal
      if (itemId && !itemId.match(/^\d+$/)) {
        // Es un ID de BD, llamar a la API
        const response = await fetch(`/api/menu/${idUnico}/items?id=${itemId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al eliminar item');
        }

        // Recargar menú desde BD
        const menuResponse = await fetch(`/api/menu/${idUnico}`);
        if (menuResponse.ok) {
          const menuDataResponse = await menuResponse.json();
          if (menuDataResponse.success && menuDataResponse.menu) {
            const restaurantInfo: RestaurantData = {
              restaurantName: menuDataResponse.menu.restaurantName,
              address: menuDataResponse.menu.contactAddress || 'Av. Fernández de la Cruz 1100',
              phone: menuDataResponse.menu.contactPhone || '+54 11 1234-5678',
              categories: menuDataResponse.menu.categories.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                description: cat.description,
                items: cat.items.map((item: any) => ({
                  id: item.id,
                  name: item.name,
                  price: `$${item.price}`,
                  description: item.description,
                  isAvailable: item.isAvailable,
                  code: item.code,
                  imageUrl: item.imageUrl || null,
                  imageBase64: item.imageUrl || null
                }))
              }))
            };
            setMenuData(restaurantInfo);
          }
        }
      } else {
        // Es un ID temporal (solo en localStorage), eliminar del estado local
        setMenuData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            categories: prev.categories.map(cat => {
              if ((cat.id || cat.name) === (category.id || category.name)) {
                return {
                  ...cat,
                  items: cat.items.filter(item => (item.id || item.name) !== itemId)
                };
              }
              return cat;
            })
          };
        });
      }

      alert('✅ Producto eliminado correctamente');
      setShowAddItem(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      alert(`❌ Error al eliminar: ${error.message || 'Intenta nuevamente.'}`);
    } finally {
      setSaving(false);
    }
  };

  // Eliminar categoría
  const handleDeleteCategory = async (categoryId: string, categoryName: string, itemCount: number) => {
    if (itemCount > 0) {
      alert(`❌ No se puede eliminar la categoría "${categoryName}" porque tiene ${itemCount} ${itemCount === 1 ? 'plato' : 'platos'}.\n\nElimina primero todos los platos de esta categoría.`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Buscar el ID real de la categoría
      const category = menuData?.categories.find(cat => (cat.id || cat.name) === categoryId);
      if (!category || !category.id) {
        alert('❌ No se pudo encontrar la categoría');
        return;
      }

      const response = await fetch(`/api/menu/${idUnico}/categories?id=${category.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al eliminar categoría');
      }

      // Actualizar el estado local
      setMenuData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          categories: prev.categories.filter(cat => (cat.id || cat.name) !== categoryId)
        };
      });

      // Guardar en localStorage
      const updatedData = {
        ...menuData!,
        categories: menuData!.categories.filter(cat => (cat.id || cat.name) !== categoryId)
      };
      localStorage.setItem('editor-menu-data', JSON.stringify(updatedData));

      alert('✅ Categoría eliminada correctamente');
    } catch (error: any) {
      console.error('Error eliminando categoría:', error);
      alert(`❌ Error al eliminar categoría: ${error.message || 'Intenta nuevamente.'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando editor...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando tu menú</p>
        </div>
      </div>
    );
  }

  if (menuNotFound) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4 text-red-500">❌ NO EXISTE COMERCIO</h1>
          <p className="text-gray-400 mb-2">El ID único <span className="font-mono font-bold text-yellow-400">{idUnico}</span> no está registrado</p>
          <p className="text-gray-500 text-sm mb-6">Verifica que el ID sea correcto o contacta al administrador</p>
        </div>
      </div>
    );
  }

  if (connectionError && !menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4 text-yellow-500">⚠️ Error de Conexión</h1>
          <p className="text-gray-400 mb-2">No se pudo conectar a la base de datos</p>
          <p className="text-gray-500 text-sm mb-6">El comercio con ID <span className="font-mono font-bold text-yellow-400">{idUnico}</span> podría existir, pero no se puede verificar en este momento</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors text-white font-semibold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      
      
      {/* Header Reorganizado - 2 Líneas */}
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 pt-1 pb-2">
          
          {/* LÍNEA 1: Título Panel de Control */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">📝 Administrar Menú</h1>
            {saving && (
                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  <span className="animate-pulse">●</span>
                  Guardando...
              </span>
            )}
          </div>

            {/* Botones del lado derecho - Alineados horizontalmente */}
            <div className="flex items-center gap-2">
              {/* Botón Carta Menu - Icono + Texto */}
          <button 
            onClick={() => router.push(`/carta/${idUnico}`)}
                className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-colors border ${
                  isDarkMode 
                    ? 'bg-transparent border-gray-600 hover:bg-gray-700 text-gray-300' 
                    : 'bg-transparent border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
                title="Ver Carta Menu"
              >
                <span className="text-lg">👁️</span>
                <span className="text-sm font-medium">Ver Carta</span>
          </button>

              {/* Botón modo claro/oscuro */}
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg border ${
                  isDarkMode 
                    ? 'bg-transparent border-gray-600 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-transparent border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
                title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
          </div>
        </div>

          {/* LÍNEA 2: Configuración de Categorías + Funciones */}
          <div className="flex items-center justify-between">
            {/* Info Categorías y Platos - Estilo TABS */}
            <div className="flex items-center justify-between w-full gap-1">
              {/* TAB Categorías - Izquierda */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg border-t border-l border-r ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-gray-200 border-gray-300 text-gray-800'
              }`}>
                {/* Contador con ícono dentro */}
                <span className={`flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full font-medium border ${
                  isDarkMode 
                    ? 'bg-transparent border-gray-400 text-white' 
                    : 'bg-transparent border-gray-300 text-gray-800'
                }`}>
                  <span className="text-base">📂</span>
                  <span>{menuData?.categories.length || 0}</span>
                </span>
                
                {/* Botón Agregar Categoría - Al lado del contador */}
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="w-10 h-10 flex items-center justify-center transition-colors text-2xl font-bold text-white hover:text-green-300 ml-2"
                  title="Agregar categoría"
                >
                  +
                </button>
                

                {/* Botón Expandir/Contraer TODAS las categorías */}
                <button
                  onClick={toggleAllCategories}
                  className="w-6 h-6 flex items-center justify-center transition-colors text-sm text-gray-400 hover:text-gray-300 ml-1"
                  title={allCategoriesExpanded ? 'Contraer todas' : 'Expandir todas'}
                >
                  {allCategoriesExpanded ? '▲' : '▼'}
                </button>
              </div>

              {/* TAB Platos + Buscador - Derecha */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg border-t border-l border-r ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-gray-200 border-gray-300 text-gray-800'
              }`}>
                {/* Contador con ícono dentro */}
                <span className={`flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full font-medium border ${
                  isDarkMode 
                    ? 'bg-transparent border-gray-400 text-white' 
                    : 'bg-transparent border-gray-300 text-gray-800'
                }`}>
                  <span className="text-base">🍽️</span>
                  <span>{menuData?.categories.reduce((total, cat) => total + cat.items.length, 0) || 0}</span>
                </span>
                
                {/* Botón Agregar Plato */}
                <button
                  onClick={() => {
                    setEditingItem(null);
                    // Prefijar categoría y generar código automáticamente
                    const firstCategory = menuData?.categories?.[0];
                    const selectedCategoryId = firstCategory ? (firstCategory.id || firstCategory.name) : '';
                    const categoryCode = firstCategory?.code || getCategoryCode(firstCategory?.name || '', 0);
                    const nextItemNumber = firstCategory ? String(firstCategory.items.length + 1).padStart(2, '0') : '01';
                    const generatedCode = `${categoryCode}${nextItemNumber}`;
                    setModalData({
                      name: '',
                      code: generatedCode,
                      price: '',
                      description: '',
                      categoryId: selectedCategoryId,
                      imageFile: null,
                      imagePreview: '',
                      isAvailable: true,
                      removeImage: false
                    });
                    setShowAddItem(true);
                  }}
                  className="w-10 h-10 flex items-center justify-center transition-colors text-2xl font-bold text-white hover:text-green-300 ml-2"
                  title="Agregar plato"
                >
                  +
                </button>
                
                {/* Botón Editar Platos */}

                {/* Buscador integrado */}
                <div className="relative ml-2">
                <input
                  type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar platos..."
                    className={`pl-2 pr-8 py-1.5 text-sm rounded-lg transition-colors duration-300 w-36 ${
                      isDarkMode 
                        ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                        : 'bg-gray-200 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                    }`}
                  autoFocus
                />
                  {searchTerm && (
                  <button
                      onClick={() => setSearchTerm('')}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors text-xs ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-gray-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                      title="Limpiar búsqueda"
                    >
                      ✕
                  </button>
                )}
              </div>
            </div>
          </div>
                        </div>
                      </div>
                    </div>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">

        {/* Lista de Categorías */}
        {menuData.categories
          .filter(category => {
            // Filtrar categorías que contengan platos según el término de búsqueda
            if (searchTerm && filterItems(category.items).length === 0) {
              return false;
            }
            return true;
          })
          .map((category) => {
          const categoryId = category.id || category.name;
          const isExpanded = expandedCategories[categoryId];
          const filteredItems = filterItems(category.items);
          const isSinCategoria = categoryId === '__SIN_CATEGORIA__';
          
          return (
            <div 
              key={categoryId}
              className={`mb-4 rounded-lg border transition-colors duration-300 overflow-hidden ${
                isSinCategoria
                  ? (isDarkMode ? 'bg-gray-800 border-yellow-600 border-2' : 'bg-yellow-50 border-yellow-300 border-2')
                  : (isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-300')
              }`}
            >
              {/* Header de Categoría - Compacto como carta */}
              <div 
                className={`px-3 py-1 cursor-pointer transition-colors duration-300 border-b rounded-t-lg hover:opacity-80 ${
                  isSinCategoria
                    ? (isDarkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-200 border-yellow-400')
                    : (isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-200 border-gray-300')
                }`}
                onClick={() => toggleCategory(categoryId)}
                onTouchStart={(e) => handleTouchStart(e, 'category', category)}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={(e) => handleDoubleClick(e, 'category', category)}
              >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 pl-1">
                  <span className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full border ${
                    isDarkMode 
                      ? 'bg-transparent border-gray-500 text-white' 
                      : 'bg-transparent border-gray-300 text-gray-800'
                  }`}>
                    {filteredItems.length}
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold leading-tight">{category.name}</h3>
                    {category.description && (
                      <span className={`text-[11px] leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category.description}</span>
                    )}
                  </div>
                </div>
                  <div className="flex items-center justify-end gap-2">
                    {/* Botón eliminar categoría (oculto para "Sin categoría") */}
                    {!isSinCategoria && (
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(categoryId, category.name, filteredItems.length);
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        title="Eliminar categoría"
                      >
                        🗑️
                      </button>
                    )}
                    
                    {/* Triangulito de expandir/colapsar esta categoría */}
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center text-lg text-gray-400 hover:text-gray-300 transition-colors active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(categoryId);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      title={isExpanded ? 'Contraer categoría' : 'Expandir categoría'}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                            </div>
                    </div>
                            </div>
                            
              {/* Items de la Categoría */}
              {isExpanded && (
                <div className="p-3 space-y-2">
                  {filteredItems.map((item, itemIndex) => (
                    <div 
                      key={item.id || itemIndex}
                      className={`flex items-center transition-opacity duration-300 py-1 border-b ${
                        isDarkMode 
                          ? (item.isAvailable === false ? 'opacity-50 border-gray-700' : 'hover:opacity-90 border-gray-700')
                          : (item.isAvailable === false ? 'opacity-50 border-gray-200' : 'hover:opacity-90 border-gray-200')
                      } cursor-pointer`}
                      onClick={() => openEditPlateModal(item, categoryId)}
                      onTouchStart={(e) => handleTouchStart(e, 'item', { item, categoryId })}
                      onTouchEnd={handleTouchEnd}
                      onDoubleClick={(e) => handleDoubleClick(e, 'item', { item, categoryId })}
                    >
                      {/* Imagen sin marco */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 mr-2">
                        {(() => {
                          // Determinar la URL de la imagen a mostrar
                          let imageSrc = '';
                          if (item.imageUrl && item.imageUrl.startsWith('/platos/')) {
                            imageSrc = item.imageUrl;
                          } else if (item.imageBase64) {
                            imageSrc = item.imageBase64;
                          } else if (item.imageUrl) {
                            imageSrc = item.imageUrl;
                          }
                          
                          // Debug: solo para el item que se está editando
                          if (editingItem?.id === item.id && imageSrc) {
                            console.log(`🖼️ Mostrando imagen para "${item.name}":`, imageSrc);
                          }
                          
                          return imageSrc ? (
                            <img 
                              src={imageSrc}
                              alt={item.name}
                              className={`w-full h-full object-cover ${
                                item.isAvailable === false ? 'grayscale' : ''
                              }`}
                              onError={(e) => {
                                console.error(`❌ Error cargando imagen para "${item.name}":`, imageSrc);
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent && !parent.querySelector('.icon-cubiertos')) {
                                  const icon = document.createElement('div');
                                  icon.className = 'icon-cubiertos w-full h-full flex items-center justify-center bg-gray-200';
                                  icon.innerHTML = '<span class="text-xs">🍽️</span>';
                                  parent.appendChild(icon);
                                }
                              }}
                              onLoad={() => {
                                // Debug: confirmar que la imagen se cargó
                                if (editingItem?.id === item.id) {
                                  console.log(`✅ Imagen cargada correctamente para "${item.name}"`);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-xs">🍽️</span>
                            </div>
                          );
                        })()}
                      </div>
                            
                      {/* Contenido sin marco */}
                      <div className="flex-1 flex items-center justify-between">
                        
                        {/* Texto del plato */}
                        <div className="flex-1">
                          <h4 className={`font-medium text-xs leading-tight transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {category.name.includes('Platos del Día') && (
                              <span className="text-yellow-400 mr-1">⭐</span>
                            )}
                            {item.name}
                          </h4>
                        </div>
                            
                        {/* Precio sin marco */}
                        <div className="flex items-center gap-2">
                          
                          {/* Precio sin marco */}
                          <span className={`text-xs font-bold transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode 
                                ? 'text-blue-300' 
                                : 'text-blue-600'
                          }`}>
                            {item.price}
                          </span>
                    </div>
                    </div>
                        </div>
                      ))}
                  
                  {filteredItems.length === 0 && searchTerm && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No se encontraron resultados para "{searchTerm}"</p>
                    </div>
                  )}
              </div>
            )}
          </div>
          );
        })}
        </div>

      {/* Modal agregar/editar plato */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} rounded-xl p-6 max-w-md w-full border`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingItem ? 'Editar Plato' : 'Agregar Plato'}
              </h3>
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setEditingItem(null);
                  setSelectedCategoryForItem('');
                  setModalData({
                    name: '',
                    code: '',
                    price: '',
                    description: '',
                    categoryId: '',
                    imageFile: null,
                    imagePreview: '',
                    isAvailable: true,
                    removeImage: false
                  });
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const item: MenuItem = {
                id: editingItem?.id || '',
                name: formData.get('name') as string,
                price: formData.get('price') as string,
                description: formData.get('description') as string,
                code: modalData.code,
                isAvailable: modalData.isAvailable  // ✅ USAR ESTADO DEL MODAL
              };
              handleSaveItem(item);
            }}>
              <div className="space-y-4">
                {/* Foto + Código + Precio en layout horizontal */}
                <div className="flex gap-4">
                  {/* Cuadro de imagen - 60% ancho */}
                  <div className="w-[60%]">
                    <div className="relative">
                      {/* Input cámara */}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                        id="cameraInput"
                      />
                      {/* Input galería */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="galleryInput"
                      />

                      <div className={`w-full h-32 border-2 rounded-lg flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                        {modalData.imagePreview && !modalData.removeImage ? (
                          <img 
                            src={modalData.imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <span className={`text-2xl block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>🍽️</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sin imagen</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <label htmlFor="cameraInput" title="Tomar foto" className={`flex-1 py-1.5 text-center rounded-lg cursor-pointer text-lg ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}>📷</label>
                        <label htmlFor="galleryInput" title="Galería" className={`flex-1 py-1.5 text-center rounded-lg cursor-pointer text-lg ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}>🖼️</label>
                        <button type="button" title="Sin imagen" className={`flex-1 py-1.5 text-center rounded-lg text-lg ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`} onClick={() => setModalData(prev => ({...prev, imageFile: null, imagePreview: '', removeImage: true }))}>🍽️</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Código + Precio + Estado al lado de la foto - alineados con altura de foto */}
                  <div className="flex-1 h-32 flex flex-col justify-between">
                    {/* Código - label e input en misma línea */}
                    <div className="flex items-center gap-3">
                      <label className={`text-sm font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Código:</label>
                      <input
                        type="text"
                        value={modalData.code || ''}
                        readOnly
                        className={`w-36 p-2 border rounded cursor-not-allowed text-sm ${isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                        placeholder={modalData.code ? modalData.code : "Automático"}
                      />
                    </div>
                    
                    {/* Precio */}
                    <div className="flex items-center gap-3">
                      <label className={`text-sm font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Precio:</label>
                      <input
                        name="price"
                    type="text"
                    required
                        value={modalData.price}
                        onChange={(e) => setModalData(prev => ({ ...prev, price: e.target.value }))}
                        className={`w-36 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Ej: $9000"
                  />
                </div>
                
                    {/* Estado - debajo del Precio */}
                    <div className="flex items-center gap-3">
                      <label className={`text-sm font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Estado:</label>
                      <button
                        type="button"
                        onClick={() => setModalData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                        className={`relative inline-flex h-8 w-36 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          modalData.isAvailable ? 'bg-green-300' : 'bg-red-500'
                        }`}
                      >
                        <span className={`absolute left-2 text-xs font-medium ${
                          modalData.isAvailable ? 'text-gray-800' : 'text-white'
                        }`}>
                          {modalData.isAvailable ? 'Disponible' : 'Agotado'}
                        </span>
                        <span
                          className={`absolute right-1 top-1 inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Combo de categorías */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Categoría *</label>
                  <select
                    name="category"
                    value={modalData.categoryId || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleCategoryChange(value === '' ? '' : value);
                    }}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="">Sin categoría (discontinuado)</option>
                    {menuData?.categories
                      .filter(cat => (cat.id || cat.name) !== '__SIN_CATEGORIA__') // Excluir "Sin categoría" del dropdown
                      .map((category) => (
                        <option key={category.id || category.name} value={category.id || category.name}>
                          {category.name} ({category.code})
                        </option>
                      ))}
                  </select>
                </div>
                
                {/* Nombre del plato */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre del plato *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={modalData.name}
                    onChange={(e) => setModalData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Ej: Milanesa con papas"
                  />
                </div>
                
                {/* Descripción */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descripción</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={modalData.description}
                    onChange={(e) => setModalData(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Descripción opcional del plato..."
                  />
                </div>

              </div>
              
              <div className="flex gap-3 mt-6">
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingItem.id) {
                        handleDeleteItem(editingItem.id, editingItem.name);
                      } else {
                        handleDeleteItem(editingItem.name, editingItem.name);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    🗑️ Eliminar
                  </button>
                )}
                
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium border ${
                    isDarkMode 
                      ? 'bg-transparent border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'bg-transparent border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {editingItem ? 'Guardar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal agregar categoría */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} rounded-xl p-6 max-w-md w-full border`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Agregar Categoría</h3>
              <button
                onClick={() => setShowAddCategory(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const categoryName = formData.get('name') as string;
              const description = formData.get('description') as string;
              
              // TODO: Implementar guardado en base de datos
              try {
                alert('✅ Categoría "' + categoryName + '" creada exitosamente (guardada en localStorage)');
                // Guardar en localStorage como fallback
                if (menuData) {
                  const newCategory = {
                    id: Date.now().toString(),
                    name: categoryName,
                    description: description || '',
                    items: []
                  };
                  const updatedData = {
                    ...menuData,
                    categories: [...menuData.categories, newCategory]
                  };
                  setMenuData(updatedData);
                  localStorage.setItem('editor-menu-data', JSON.stringify(updatedData));
                }
              } catch (error) {
                console.error('Error creando categoría:', error);
                alert('❌ Error al crear categoría');
              }
              
              setShowAddCategory(false);
            }}>
              <div className="space-y-4">
                {/* Nombre de la categoría */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre de la categoría *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Ej: Platos del Día, Promos, Bebidas..."
                  />
                </div>
                
                {/* Descripción opcional */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descripción (opcional)</label>
                  <textarea
                    name="description"
                    rows={3}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Descripción de la categoría..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors font-medium text-white"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar categoría */}
      {showEditCategory && editingCategory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} rounded-xl p-6 max-w-md w-full border`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Editar Categoría</h3>
              <button
                onClick={() => {
                  setShowEditCategory(false);
                  setEditingCategory(null);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const categoryName = formData.get('name') as string;
              const description = formData.get('description') as string;
              
              try {
                // Actualizar categoría en la API dinámicamente por idUnico
                const res = await fetch(`/api/menu/${idUnico}/categories`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: editingCategory?.id, name: categoryName, description })
                });
                if (!res.ok) throw new Error('Error HTTP ' + res.status);
                alert('✅ Categoría "' + categoryName + '" guardada exitosamente');
                await loadMenuFromAPI();
              } catch (error) {
                console.error('Error actualizando categoría:', error);
                alert('❌ Error al guardar categoría');
              }
              
              setShowEditCategory(false);
              setEditingCategory(null);
            }}>
              <div className="space-y-4">
                {/* Nombre de la categoría */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={editingCategory.name}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
                
                {/* Descripción */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descripción</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingCategory.description || ''}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Descripción de la categoría..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCategory(false);
                    setEditingCategory(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-white"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* NavBar fija en la parte inferior */}
      <NavBar idUnico={idUnico} />
    </div>
  );
}

