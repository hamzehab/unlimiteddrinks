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
    selectedAddress: sessionStorage.getItem("selectedAddress")
      ? JSON.parse(sessionStorage.getItem("selectedAddress"))
      : null,
  }),
  getters: {
    getFullName: (state) =>
      `${state.customer.firstName} ${state.customer.lastName}`,
    getAddresses: (state) => state.customer.addresses.addresses,
    getSelectedAddress: (state) => state.selectedAddress,
  },
  actions: {
    initCustomer(customerData) {
      this.customer.firstName = customerData.first_name;
      this.customer.lastName = customerData.last_name;
      this.customer.email = customerData.email;
      this.customer.addresses = customerData.addresses;
      this.selectedAddress = customerData.addresses.main_address;

      const dateObj = new Date(customerData.created_at);
      const formattedDate = `${dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;

      this.customer.memberSince = formattedDate;
      sessionStorage.setItem("customer", JSON.stringify(this.customer));
      sessionStorage.setItem(
        "selectedAddress",
        JSON.stringify(this.selectedAddress)
      );
    },
    addAddress(addresses) {
      this.customer.addresses.addresses.push(addresses);
      sessionStorage.setItem("customer", JSON.stringify(this.customer));
    },
    changeSelectedAddress(address) {
      this.selectedAddress = address;
      sessionStorage.setItem(
        "selectedAddress",
        JSON.stringify(this.selectedAddress)
      );
    },
    updateAddress(address) {
      const existingAddress = this.customer.addresses.addresses.find(
        (a) => a.id === address.id
      );
      if (existingAddress) {
        Object.assign(existingAddress, address);

        if (this.selectedAddress.id === address.id) {
          this.changeSelectedAddress(existingAddress);
        }
        sessionStorage.setItem("customer", JSON.stringify(this.customer));
      }
    },
  },
});
