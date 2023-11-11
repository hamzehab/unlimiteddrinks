import { defineStore } from "pinia";

export const useCustomerStore = defineStore("customerStore", {
  state: () => ({
    customer: {
      firstName: sessionStorage.getItem("customer")
        ? JSON.parse(sessionStorage.getItem("customer")).firstName
        : null,
      lastName: sessionStorage.getItem("customer")
        ? JSON.parse(sessionStorage.getItem("customer")).lastName
        : null,
      email: sessionStorage.getItem("customer")
        ? JSON.parse(sessionStorage.getItem("customer")).email
        : null,
      addresses: sessionStorage.getItem("customer")
        ? JSON.parse(sessionStorage.getItem("customer")).addresses
        : [],
      memberSince: sessionStorage.getItem("customer")
        ? JSON.parse(sessionStorage.getItem("customer")).memberSince
        : null,
    },
  }),
  getters: {
    getFirstName: (state) => state.customer.firstName,
    getLastName: (state) => state.customer.lastName,
    getFullName: (state) =>
      `${state.customer.firstName} ${state.customer.lastName}`,
    getEmail: (state) => state.customer.email,
    getMainAddress: (state) => state.customer.addresses.main_address,
    getAddresses: (state) => state.customer.addresses.addresses,
    getMemberSince: (state) => state.customer.memberSince,
  },
  actions: {
    initCustomer(customerData) {
      this.customer.firstName = customerData.first_name;
      this.customer.lastName = customerData.last_name;
      this.customer.email = customerData.email;
      this.customer.addresses = customerData.addresses;

      const dateObj = new Date(customerData.created_at);
      const formattedDate = `${dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;

      this.customer.memberSince = formattedDate;
      sessionStorage.setItem("customer", JSON.stringify(this.customer));
    },
  },
});
