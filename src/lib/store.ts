import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';
interface CartItem extends Product {
  selectedSize: number;
  quantity: number;
}
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: number) => void;
  removeItem: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size) => {
        const items = get().items;
        const existing = items.find(i => i.id === product.id && i.selectedSize === size);
        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id && i.selectedSize === size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, selectedSize: size, quantity: 1 }] });
        }
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(i => !(i.id === productId && i.selectedSize === size)),
        });
      },
      updateQuantity: (productId, size, delta) => {
        set({
          items: get().items.map(i => {
            if (i.id === productId && i.selectedSize === size) {
              const newQty = Math.max(1, i.quantity + delta);
              return { ...i, quantity: newQty };
            }
            return i;
          }),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: 'urbanstep-cart' }
  )
);