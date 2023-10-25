import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cart")) || [],
  }),
  getters: {
    totalQuantity: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),
    totalCostBeforeTax: (state) => {
      const total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      return total.toFixed(2);
    },
    taxesAndFees: (state) => {
      const total = state.totalCostBeforeTax * 0.0663;
      return total.toFixed(2);
    },
  },
  actions: {
    update(index, quantity) {
      this.items[index].quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
    addItem(item, quantity) {
      const existingItem = this.items.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity =
          existingItem.quantity + quantity <= 25
            ? existingItem.quantity + quantity
            : 25;
      } else {
        this.items.push({ ...item, quantity: quantity });
      }

      localStorage.setItem("cart", JSON.stringify(this.items));
    },
    removeItem(product_id) {
      const existingItem = this.items.find(
        (cartItem) => cartItem.id === product_id
      );
      this.items.splice(this.items.indexOf(existingItem), 1);
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
  },
});
