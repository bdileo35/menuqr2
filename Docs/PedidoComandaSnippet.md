```tsx
{modalItem && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    onClick={() => setModalItem(null)}
  >
    <div
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full rounded-xl p-6`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
          {modalItem.name}
        </h2>
        <button
          onClick={() => setModalItem(null)}
          className={`${isDarkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center`}
        >
          ✕
        </button>
      </div>

      <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={modalItemImage || '/platos/albondigas.jpg'}
          alt={modalItem.name}
          className="w-full h-full object-cover"
        />
      </div>

      {modalItem.description && (
        <div className="mb-4">
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            {modalItem.description}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
            className={`${isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold`}
          >
            -
          </button>
          <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>
            {modalQuantity}
          </span>
          <button
            onClick={() => setModalQuantity(modalQuantity + 1)}
            className={`${isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold`}
          >
            +
          </button>
        </div>
        <div
          className={`${isDarkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-transparent'} text-xl font-bold px-4 py-2 rounded-lg text-blue-500`}
        >
          {modalItem.price.replace('$$', '$')}
        </div>
      </div>

      <button
        onClick={() => {
          const code = `0${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
          setCartItems((prev) => [...prev, { item: modalItem, quantity: modalQuantity, code }]);
          setModalItem(null);
          setModalQuantity(1);
        }}
        className={`${isDarkMode
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'} w-full py-3 rounded-lg font-bold text-lg`}
      >
        🛒 Agregar al Carrito
      </button>
    </div>
  </div>
)}

{showProCart && (
  <button
    onClick={() => setShowProCartModal(true)}
    className={`${isDarkMode
      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'} fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-lg border-2 flex items-center justify-center`}
    title="Ver carrito (POC)"
  >
    <span className="text-2xl">🛒</span>
    {cartItems.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
        {cartItems.reduce((t, it) => t + it.quantity, 0)}
      </span>
    )}
  </button>
)}

{showProCart && showProCartModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/60" onClick={() => setShowProCartModal(false)} />
    <div className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden bg-white border border-gray-300 text-gray-900">
      <div className="px-4 py-2 border-b bg-white border-gray-300">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            Pedido/Comanda
            <span className="text-sm font-semibold text-gray-500">
              {`${modalidad.toUpperCase()} ${orderCode}`}
            </span>
          </h3>
          <button
            onClick={() => setShowProCartModal(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 max-h-[70vh] overflow-y-auto">
        <div className="rounded-lg mb-4 bg-white border border-gray-300">
          <div className="p-3 space-y-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-6 text-gray-600">Carrito vacío</div>
            ) : (
              cartItems.map((ci, index) => {
                const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
                const subtotal = price * ci.quantity;
                return (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {ci.item.name}
                        <span className="ml-1 text-xs text-gray-600">({ci.code})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <div className="inline-flex items-center rounded-full overflow-hidden border border-gray-300 bg-white">
                        <button
                          onClick={() =>
                            setCartItems((prev) => {
                              const next = [...prev];
                              if (next[index].quantity > 1) {
                                next[index] = { ...next[index], quantity: next[index].quantity - 1 };
                              } else {
                                next.splice(index, 1);
                              }
                              return next;
                            })
                          }
                          className="w-6 h-6 text-sm hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-semibold select-none">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setCartItems((prev) =>
                              prev.map((it, i) =>
                                i === index ? { ...it, quantity: it.quantity + 1 } : it
                              )
                            )
                          }
                          className="w-6 h-6 text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="w-16 text-right text-sm font-semibold">
                        {subtotal.toLocaleString('es-AR', {
                          style: 'currency',
                          currency: 'ARS',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <button
                        onClick={() => setCartItems((prev) => prev.filter((_, i) => i !== index))}
                        className="w-6 h-6 text-sm rounded hover:bg-gray-100"
                        title="Quitar"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="px-3 py-2 border-t border-gray-300 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Total</div>
              <div className="text-base font-bold">
                {(() => {
                  const total = cartItems.reduce(
                    (sum, it) =>
                      sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g, '')) || 0) * it.quantity,
                    0
                  );
                  return total.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-200">
          <div className="flex gap-2">
            <select
              value={modalidad}
              onChange={(e) => {
                const value = e.target.value as 'delivery' | 'retiro' | 'salon';
                if (value === 'delivery' || value === 'retiro') {
                  setModalidad(value);
                  setOrderCode(generateOrderCode(value));
                  if (value === 'delivery') {
                    setProName('');
                  } else {
                    setProAddress('');
                  }
                }
              }}
              className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-1.5 h-9 text-sm text-gray-900"
            >
              <option value="delivery">Delivery</option>
              <option value="retiro">Take Away</option>
              <option value="salon" disabled>
                Salón (próx.)
              </option>
            </select>
            <input
              value={modalidad === 'delivery' ? proAddress : proName}
              onChange={(e) => (modalidad === 'delivery' ? setProAddress(e.target.value) : setProName(e.target.value))}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 h-9 text-sm text-gray-900"
              placeholder={modalidad === 'delivery' ? 'Calle y número' : 'Nombre'}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-900">Pago</span>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="pago"
                checked={proPayment === 'efectivo'}
                onChange={() => setProPayment('efectivo')}
              />
              Efectivo
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="pago"
                checked={proPayment === 'mp'}
                onChange={() => setProPayment('mp')}
              />
              MP
            </label>
            <button
              onClick={() => {
                if (cartItems.length === 0) {
                  alert('Carrito vacío');
                  return;
                }
                const mode: 'delivery' | 'retiro' = modalidad === 'retiro' ? 'retiro' : 'delivery';
                if (mode === 'delivery') {
                  if (!proAddress.trim()) {
                    alert('Ingresá la dirección para delivery');
                    return;
                  }
                } else {
                  if (!proName.trim()) {
                    alert('Ingresá tu nombre');
                    return;
                  }
                }
                if (!proPayment) {
                  alert('Seleccioná forma de pago');
                  return;
                }
                const effectiveCode = ensureOrderCodeForMode(mode);
                if (proPayment === 'mp') {
                  try {
                    const msg = buildTicketMessage(mode, effectiveCode) + '\nPago: Mercado Pago (pendiente)';
                    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                  } catch {}
                  alert('Te redirigimos a Mercado Pago para completar el pago.');
                  setTimeout(() => {
                    generateMPLink();
                  }, 300);
                } else {
                  const mensaje = buildTicketMessage(mode, effectiveCode);
                  alert(`Pedido confirmado!\n\n${mensaje}`);
                }
                setShowProCartModal(false);
                setCartItems([]);
                setProName('');
                setProAddress('');
                setProPayment(null);
                try {
                  localStorage.removeItem(storageKey);
                } catch {}
              }}
              className="ml-auto px-4 h-9 rounded-lg text-white bg-green-600 hover:bg-green-700 text-sm font-semibold"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}``

