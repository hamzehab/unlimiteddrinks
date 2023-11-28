<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";

import { ref, onMounted, onUnmounted } from "vue";
import { api } from "src/boot/axios";

import { useCustomerStore } from "src/stores/customer-store";
import { useCartStore } from "src/stores/cart-store";
import { useAuth0 } from "@auth0/auth0-vue";

import { states } from "src/assets/usStates";

const auth0 = useAuth0();
const customerStore = useCustomerStore();
const cartStore = useCartStore();

// Retrieve Cart and Product Information
const subtotal = ref(0);
const taxesAndFees = ref(0);
const items = ref([]);
const quantities = ref([]);
const fetchProductsInCart = async () => {
  items.value = [];
  quantities.value = [];
  subtotal.value = 0;
  taxesAndFees.value = 0;

  for (const product of cartStore.items) {
    try {
      const response = await api.get(`/product/${product.product_id}`);
      items.value.push(response.data);
      quantities.value.push(product.quantity);
      subtotal.value += response.data.price * product.quantity;
    } catch (error) {
      console.error(error);
    }
  }
  taxesAndFees.value = subtotal.value * 0.06625;
};

const checkout = async () => {
  if (selected.value === null) {
    const addressData = {
      first_name: firstName.value,
      last_name: lastName.value,
      street: street.value,
      street2: apt.value,
      city: city.value,
      state: state.value,
      zip_code: zip_code.value,
    };
    try {
      console.log("test1");
      const response = await api.post(
        `address/add/${auth0.user.value.sub.split("|")[1]}`,
        addressData
      );
      console.log("test2");
      selected.value = {
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        street: response.data.street,
        street2: response.data.street2,
        city: response.data.city,
        state: response.data.state,
        zip_code: response.data.zip_code,
      };
    } catch (e) {
      console.error(e);
    }
  }

  const data = {
    cartItems: cartStore.items,
    address_id: selected.value.id,
  };

  try {
    const response = await api.post(
      `checkout/session?customer_email=${auth0.user.value.email}`,
      data
    );

    console.log(response.data);
    window.location.href = response.data.url;
  } catch (e) {
    console.error(e);
  }
};

const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  await fetchProductsInCart();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const addresses = [
  customerStore.getSelectedAddress,
  ...customerStore.getAddresses,
];
const addressFormat = (address) => {
  return `${address.street}${address.street2 ? " " + address.street2 : ""}, ${
    address.city
  } ${address.state} ${address.zip_code} ${address.country}`;
};

const newAddress = ref(false);
const selected = ref(addresses[0]);
const viewMore = ref(null);

const usStates = states;

const firstName = ref(null);
const lastName = ref(null);
const street = ref(null);
const apt = ref(null);
const city = ref(null);
const state = ref(null);
const zip_code = ref(null);

const populateFields = (address) => {
  selected.value = address;
  newAddress.value = false;
  firstName.value = address.first_name;
  lastName.value = address.last_name;
  street.value = address.street;
  apt.value = address.street2 ? address.street2 : null;
  city.value = address.city;
  state.value = address.state;
  zip_code.value = address.zip_code;
};

const clearFields = () => {
  selected.value = null;
  newAddress.value = true;
  firstName.value = null;
  lastName.value = null;
  street.value = null;
  apt.value = null;
  city.value = null;
  state.value = null;
  zip_code.value = null;
};
</script>

<template>
  <NavBar />
  <div
    class="q-my-xl main"
    :class="windowWidth > 1000 ? 'row justify-around' : ''"
  >
    <q-card
      :class="windowWidth > 1000 ? '' : 'q-mx-xl q-mb-xl'"
      style="height: fit-content"
      :style="windowWidth > 1000 ? 'width: 100%; max-width: 60%;' : ''"
    >
      <q-card-section class="text-center">
        <img src="static/logo.png" alt="" style="width: 100px" />
        <div class="row justify-center items-center ys">
          <div>
            <span class="cursor-pointer" @click="$router.push('/cart')">
              Cart
            </span>
            <q-icon name="chevron_right" size="24px" />
          </div>
          <div>
            <span class="text-deep-purple-14 text-bold">Information</span>
            <q-icon name="chevron_right" size="24px" />
          </div>
          <div>Payment</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 ys">Shipping Addresses</div>
        <div class="text-caption">
          Select an address where order is to be delivered
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-btn
          v-if="!newAddress"
          class="full-width"
          style="border: 2px solid grey; border-radius: 1rem"
          flat
          color="grey-6"
          @click="clearFields()"
        >
          <div class="text-center">
            <q-icon name="add" size="30px" />
            <div>Add Address</div>
          </div>
        </q-btn>
        <div
          class="cursor-pointer q-my-md q-pa-lg"
          :class="
            address.id === (selected ? selected.id : selected)
              ? 'selected-address'
              : 'address'
          "
          v-for="address in addresses.slice(0, viewMore ? addresses.length : 3)"
          :key="address.id"
          @click="populateFields(address)"
        >
          <div class="text-body1">
            <div class="text-bold">
              {{ address.first_name }} {{ address.last_name }}
            </div>
            {{ addressFormat(address) }}
          </div>
        </div>
      </q-card-section>
      <q-card-section
        v-if="addresses.length > 3"
        class="q-pt-none"
        align="right"
      >
        <div
          class="q-pa-sm text-grey-6 text-caption cursor-pointer"
          style="width: fit-content"
          @click="viewMore = !viewMore"
        >
          {{ viewMore ? "View Less" : "View More..." }}
        </div>
      </q-card-section>
      <q-card-section v-if="newAddress" class="q-py-none">
        <q-btn
          class="full-width"
          label="Cancel"
          color="red"
          flat
          @click="(newAddress = false), (selected = addresses[0])"
        />
      </q-card-section>
      <q-card-section v-if="newAddress" class="q-pt-none">
        <q-input
          class="q-my-md"
          label="First Name"
          v-model.trim="firstName"
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          dense
        />
        <q-input
          label="Last Name"
          v-model.trim="lastName"
          standout="bg-grey-3 text-deep-purple-14 "
          input-class="text-dark"
          dense
        />
        <q-input
          class="q-my-md"
          label="Street Address"
          v-model.trim="street"
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          dense
        />
        <q-input
          label="Apt, suite, unit, building, floor, etc."
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="apt"
          dense
        />
        <q-input
          class="q-my-md"
          label="City"
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="city"
          dense
        />
        <div class="row justify-between">
          <q-select
            standout="bg-grey-3 text-deep-purple-14"
            style="width: 100%; max-width: 49%"
            label="State"
            emit-value
            map-options
            v-model="state"
            :options="usStates"
            dense
          >
            <template v-slot:selected-item="scope">
              <span class="text-dark">
                {{ scope.opt.label }}
              </span>
            </template>
          </q-select>

          <q-input
            label="ZIP Code"
            v-model.trim="zip_code"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            mask="#####"
            dense
            style="width: 100%; max-width: 49%"
          />
        </div>
      </q-card-section>
    </q-card>
    <div
      :class="windowWidth > 1000 ? '' : 'q-mx-xl'"
      :style="windowWidth > 1000 ? 'width: 100%; max-width: 30%;' : ''"
    >
      <q-card class="oswald" style="height: fit-content" bordered>
        <q-card-section class="q-mx-xs">
          <q-card-section class="text-h6 q-pa-none">
            Checkout Details:
          </q-card-section>
          <q-separator />
          <q-card-section v-for="(item, index) in items" :key="index">
            <q-card-section horizontal>
              <q-img
                :src="`static/${item.image}`"
                width="48px"
                height="48px"
                :ratio="1"
                style="border-radius: 0.5rem"
              />
              <q-card-section class="text-body2 q-pa-none q-pl-md">
                {{ item.name }}
                <div class="text-caption text-grey-6">
                  {{ quantities[index] }} @ {{ item.price }} each
                </div>
              </q-card-section>
            </q-card-section>
          </q-card-section>
          <q-separator />
          <q-card-section class="row justify-between q-pa-none q-pt-sm">
            <div>
              <div class="text-body1">Subtotal:</div>
              <div class="text-caption">Before Taxes and Fees</div>
            </div>
            <div class="text-subtitle1">
              <span class="text-bold">$</span>
              {{ subtotal.toFixed(2) }}
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section class="q-mx-sm">
          <div class="row justify-between">
            <div class="text-body1">Taxes and Fees:</div>
            <div class="text-subtitle1">
              <span class="text-bold">$</span>

              {{ taxesAndFees.toFixed(2) }}
            </div>
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="q-mx-sm">
          <div class="row justify-between text-h6">
            <div>Total:</div>
            <div>
              <span class="text-bold">$</span>
              {{ (subtotal * 1.06625).toFixed(2) }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row justify-center q-mt-xl">
        <q-btn
          class="full-width rounded-borders q-mb-md"
          label="Continue Shopping"
          color="dark"
          push
          @click="$router.push('/')"
        />
        <q-btn
          class="full-width rounded-borders"
          label="Place Order"
          icon="confirmation_number"
          color="deep-purple-14"
          push
          @click="checkout()"
        />
      </div>
    </div>
  </div>
  <FooterComponent />
</template>
