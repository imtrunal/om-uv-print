import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
    persist(
        (set, get) => ({
            carts: [],
            addCart: (cart) =>
                set((state) => ({
                    carts: [...state.carts, cart],
                })),
            removeCart: (id) =>
                set((state) => ({
                    carts: state.carts.filter((cart) => cart.id !== id),
                })),
            clearCart: () => set({ carts: [] }),
        }),
        {
            name: "cart",
        }
    )
);

export default useCartStore;
