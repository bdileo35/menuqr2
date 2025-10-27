"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoMenuData } from "@/lib/demo-data";

interface MenuItem {
  id?: string;
  name: string;
  price: string; // "$12000"
  description?: string;
  isAvailable?: boolean;
}

interface MenuCategory {
  id?: string;
  name: string;
  items: MenuItem[];
}

interface RestaurantData {
  restaurantName: string;
  address: string;
  phone: string;
  categories: MenuCategory[];
}

export default function CartaMenuPage() {
  const router = useRouter();

  // UI/state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalidad, setModalidad] = useState<"salon" | "retiro" | "delivery">("delivery");

  // Data
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [cartItems, setCartItems] = useState<Array<{ item: MenuItem; quantity: number; code: string }>>([]);

  // Helpers
  const parsePrice = (p: string) =>
    Number(String(p).replace("$", "").replace(/\./g, "").replace(",", ".").trim()) || 0;

  const filteredCategories = useMemo(() => {
    if (!menuData) return [];
    const term = searchTerm.trim().toLowerCase();

    const filterItems = (items: MenuItem[]) =>
      !term
        ? items
        : items.filter(
            (i) =>
              i.name.toLowerCase().includes(term) ||
              (i.description && i.description.toLowerCase().includes(term))
          );

    return menuData.categories
      .map((c) => ({ ...c, items: filterItems(c.items) }))
      .filter((c) => c.items.length > 0 || term.length === 0);
  }, [menuData, searchTerm]);

  const totalItems = useMemo(
    () => cartItems.reduce((t, it) => t + it.quantity, 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () =>
      cartItems.reduce((t, it) => t + parsePrice(it.item.price) * it.quantity, 0),
    [cartItems]
  );

  // Data loader (API → localStorage → demo)
  useEffect(() => {
    const loadMenuFromAPI = async () => {
      try {
        const res = await fetch("/api/menu/5XJ1J37F", { cache: "no-store" });
        const data = await res.json();
        if (data?.success && data?.menu) {
          const restaurantInfo: RestaurantData = {
            restaurantName: data.menu.restaurantName,
            address: data.menu.contactAddress || "Av. Fernández de la Cruz 1100",
            phone: data.menu.contactPhone || "+54 11 1234-5678",
            categories: data.menu.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              items: (cat.items || []).map((item: any) => ({
                id: item.id,
                name: item.name,
                price: `$${item.price}`,
                description: item.description,
                isAvailable: item.isAvailable,
              })),
            })),
          };
          setMenuData(restaurantInfo);
          return;
        }
        throw new Error("No hay menú");
      } catch {
        // localStorage fallback
        try {
          const savedMenu = localStorage.getItem("editor-menu-data");
          const setupData = localStorage.getItem("setup-comercio-data");
          if (savedMenu && setupData) {
            const menu = JSON.parse(savedMenu);
            const setup = JSON.parse(setupData);
            setMenuData({
              restaurantName: setup.nombreComercio || "Mi Restaurante",
              address: setup.direccion || "Dirección no especificada",
              phone: setup.telefono || "Teléfono no especificado",
              categories: menu.categories || menu || [],
            });
            return;
          }
        } catch {}
        // demo fallback
        const demo = getDemoMenuData();
        setMenuData({
          restaurantName: demo.restaurantName,
          address: "Av. Corrientes 1234, Buenos Aires",
          phone: "+54 11 1234-5678",
          categories: demo.categories,
        });
      } finally {
        setLoading(false);
      }
    };
    loadMenuFromAPI();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Cargando carta digital...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando tu menú personalizado</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">⚠️ No hay datos del menú</h1>
          <p className="text-gray-400 mb-6">Completa el proceso de configuración</p>
          <button
            onClick={() => router.push("/setup-comercio")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Ir a Configuración →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      {/* Header: logo + toggles + search */}
      <header className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} sticky top-0 z-40`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo (Maps) */}
          <img
            src="/demo-images/logo.png?v=2"
            alt="Esquina Pompeya"
            className="w-[180px] h-auto rounded-lg object-contain cursor-pointer hover:opacity-80"
            onClick={() => setShowMapsModal(true)}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/demo-images/Logo.jpg?v=2";
            }}
            title="Ver ubicación en Google Maps"
          />

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onClick={() => setShowReviews((v) => !v)}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"}`}
              title="Reseñas"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
              Reseñas
            </button>

            <button
              onClick={() => setIsDarkMode((v) => !v)}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${isDarkMode ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"}`}
              title="Cambiar tema"
            >
              <span>☀️</span>
              {isDarkMode ? "Claro" : "Oscuro"}
            </button>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? "bg-gray-700 border border-gray-600" : "bg-white border border-blue-300"} w-[320px]`}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar platos..."
                className={`bg-transparent outline-none text-sm flex-1 ${isDarkMode ? "placeholder-gray-400" : "placeholder-blue-400"}`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-blue-700 hover:text-blue-900"}`}
                  title="Limpiar"
                >
                  ✕
                </button>
              )}
            </div}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 py-4">
        {filteredCategories.map((category, idx) => {
          const isPromo = category.name.toUpperCase().includes("PROMO");
          const count = category.items.length;

          return (
            <section
              key={category.id || `cat-${idx}`}
              className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-blue-300"} border rounded-lg mb-5 overflow-hidden`}
            >
              {/* Header de categoría */}
              <div className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-blue-100 border-blue-300"} border-b px-4 py-2 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`${isDarkMode ? "bg-gray-600 text-gray-200" : "bg-white text-blue-700"} w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center`}>
                    {count}
                  </div>
                  <h2 className={`${isDarkMode ? "text-white" : "text-gray-900"} text-base font-bold`}>
                    {category.name}
                  </h2>
                </div>
                <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-xs`}>▲</div>
              </div>

              {/* Lista / Grilla */}
              <div className={`${isPromo ? "px-3 py-3" : ""}`}>
                {isPromo ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {category.items.map((item, j) => (
                      <div
                        key={item.id || `promo-${j}`}
                        className={`${isDarkMode ? "border-blue-400 bg-gradient-to-b from-blue-900/30 to-blue-800/20" : "border-blue-300 bg-gradient-to-b from-blue-50 to-blue-100"} rounded-lg overflow-hidden border`}
                        onDoubleClick={() => setModalItem(item)}
                        title="Doble click para ver detalles"
                      >
                        <div className="h-28 overflow-hidden">
                          <img
                            src={["/platos/milanesa-completa.jpg", "/platos/vacio-papas.jpg", "/platos/rabas.jpg"][j % 3]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.currentTarget.style.display = "none"))}
                          />
                        </div>
                        <div className="p-2">
                          <h3 className={`${isDarkMode ? "text-blue-200" : "text-blue-800"} font-bold text-xs text-center mb-1`}>
                            🔥 {item.name}
                          </h3>
                          {item.description && (
                            <p className={`${isDarkMode ? "text-blue-300" : "text-blue-600"} text-xs text-center mb-2`}>
                              {item.description}
                            </p>
                          )}
                          <div className={`${isDarkMode ? "text-blue-100 bg-blue-600 border-blue-400" : "text-blue-700 bg-blue-100 border-blue-400"} text-xs font-bold px-2 py-1 rounded border text-center`}>
                            {item.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/20">
                    {category.items.map((item, k) => (
                      <div
                        key={item.id || `it-${k}`}
                        className={`flex items-center ${isDarkMode ? "border-gray-700" : "border-gray-200"} px-2 py-1 hover:opacity-90 ${item.isAvailable === false ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={() => item.isAvailable !== false && setModalItem(item)}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 mx-2 my-1">
                          <img
                            src={["/platos/albondigas.jpg", "/platos/rabas.jpg", "/platos/IMG-20250926-WA0005.jpg"][k % 3]}
                            alt={item.name}
                            className={`w-full h-full object-cover ${item.isAvailable === false ? "grayscale" : ""}`}
                            onError={(e) => ((e.currentTarget.style.display = "none"))}
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className={`text-xs font-medium ${item.isAvailable === false ? "text-gray-400" : isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {item.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.isAvailable === false && (
                            <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-gray-700 border border-rose-300">
                              AGOTADO
                            </div>
                          )}
                          <