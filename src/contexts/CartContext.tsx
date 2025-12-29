import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number | null;
  quantity: number;
  image?: string | null;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  itemsCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  decreaseItem: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  buildWhatsappLink: () => string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const WHATSAPP_NUMBER = "966570135200";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("elex_cart");
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("elex_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseItem = (id: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const setQuantity = (id: number, quantity: number) => {
    const qty = Math.max(1, Math.min(999, Math.floor(quantity || 1)));
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setItems([]);

  const itemsCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [items]
  );

  const buildWhatsappLink = () => {
    const lines = items.map(
      (item) =>
        `- ${item.name} x${item.quantity}${item.price ? ` = ${item.price * item.quantity} SAR` : ""}`
    );
    const message = [
      "أرغب في طلب المنتجات التالية:",
      ...lines,
      `الإجمالي: ${total} SAR`,
      `الرابط: ${typeof window !== "undefined" ? window.location.origin : ""}`,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemsCount,
        total,
        addItem,
        decreaseItem,
        setQuantity,
        removeItem,
        clearCart,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        buildWhatsappLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
