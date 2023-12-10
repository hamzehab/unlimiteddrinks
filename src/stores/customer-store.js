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
    getAddresses: (state) => state.customer.addresses,
    getSelectedAddress: (state) => state.selectedAddress,
  },
  actions: {
    initCustomer(customerData) {
      this.customer.firstName = customerData.first_name;
      this.customer.lastName = customerData.last_name;
      this.customer.email = customerData.email;
      this.customer.addresses = customerData.addresses.addresses;
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
    updateName(firstName, lastName) {
      this.customer.firstName = firstName;
      this.customer.lastName = lastName;
      sessionStorage.setItem("customer", JSON.stringify(this.customer));
    },
    addAddress(addresses) {
      this.customer.addresses.push(addresses);
      sessionStorage.setItem("customer", JSON.stringify(this.customer));
    },
    deleteAddress(address_id) {
      const index = this.customer.addresses.findIndex(
        (item) => item.id === address_id
      );
      this.customer.addresses.splice(index, 1);
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
      if (this.selectedAddress.id == address.id) {
        this.selectedAddress = address;
        sessionStorage.setItem(
          "selectedAddress",
          JSON.stringify(this.selectedAddress)
        );
      } else {
        const index = this.customer.addresses.findIndex(
          (item) => item.id === address.id
        );

        if (index !== undefined || index !== null) {
          this.customer.addresses[index] = address;
          sessionStorage.setItem("customer", JSON.stringify(this.customer));
        }
      }
    },
  },
});
