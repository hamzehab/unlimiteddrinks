import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(sessionStorage.getItem("cart")) || [],
  }),
  getters: {
    totalQuantity: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),
  },
  actions: {
    async update(index, quantity) {
      try {
        const response = await api.get(
          `product/cart/${this.items[index].product_id}?quantity=${quantity}`
        );

        if (response.data["can_add"] === true) {
          this.items[index].quantity = quantity;
        }
      } catch (e) {
        console.error(e);
      }

      sessionStorage.setItem("cart", JSON.stringify(this.items));
    },
    async addItem(product_id, quantity) {
      const existingItem = this.items.find(
        (cartItem) => cartItem.product_id === product_id
      );

      if (existingItem) {
        try {
          const response = await api.get(
            `product/cart/${product_id}?quantity=${
              quantity + existingItem.quantity
            }`
          );

          if (response.data["can_add"] === true) {
            existingItem.quantity =
              existingItem.quantity + quantity <= 25
                ? existingItem.quantity + quantity
                : 25;
          } else {
            existingItem.quantity = response.data.quantity;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        this.items.push({ product_id, quantity });
      }
      sessionStorage.setItem("cart", JSON.stringify(this.items));
    },
    removeItem(product_id) {
      const existingItem = this.items.find(
        (cartItem) => cartItem.product_id === product_id
      );
      this.items.splice(this.items.indexOf(existingItem), 1);
      sessionStorage.setItem("cart", JSON.stringify(this.items));
    },
  },
});
