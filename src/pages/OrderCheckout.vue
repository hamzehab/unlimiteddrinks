<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";

import { ref } from "vue";
import { useCustomerStore } from "src/stores/customer-store";
import { useCartStore } from "src/stores/cart-store";

const customerStore = useCustomerStore();
const cartStore = useCartStore();

const addressFormat = (address) => {
  return `${address.street}, ${address.city} ${address.state} ${address.zip_code} ${address.country}`;
};

const newAddress = ref(false);
const selected = ref(0);

const populateFields = (address) => {
  console.log(address);
};
</script>

<template>
  <NavBar />
  <div class="row reverse justify-around q-my-xl main">
    <q-card style="width: 40%; max-width: 200px; height: fit-content">
      <q-card-section> Items and price </q-card-section>
    </q-card>
    <q-card style="width: 70%; max-width: 1500px; height: fit-content">
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
          @click="(newAddress = true), (selected = null)"
        >
          <div class="text-center">
            <q-icon name="add" size="30px" />
            <div>Add Address</div>
          </div>
        </q-btn>
        <div
          class="cursor-pointer q-my-md q-pa-lg"
          :class="
            address && index === selected ? 'selected-address' : 'address'
          "
          v-for="(address, index) in [
            customerStore.getSelectedAddress,
            ...customerStore.getAddresses,
          ]"
          :key="index"
          @click="
            (selected = index), (newAddress = false), populateFields(address)
          "
        >
          <div class="text-body1">
            <div class="text-bold">
              {{ address.first_name }} {{ address.last_name }}
            </div>
            {{ addressFormat(address) }}
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="newAddress" class="q-py-none">
        <q-btn
          class="full-width"
          label="Cancel"
          color="red"
          flat
          @click="newAddress = false"
        />
      </q-card-section>
      <q-card-section v-if="newAddress" class="q-pt-none">
        <q-input
          class="q-my-md"
          label="First Name"
          v-model.trim="firstName"
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          rounded
          dense
        />
        <q-input
          label="Last Name"
          v-model.trim="lastName"
          standout="bg-grey-3 text-deep-purple-14 "
          input-class="text-dark"
          rounded
          dense
        />
        <q-input
          class="q-my-md"
          label="Street Address"
          v-model.trim="street"
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          rounded
          dense
        />
        <q-input
          label="Apt, suite, unit, building, floor, etc."
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="apt"
          rounded
          dense
        />
        <q-input
          class="q-my-md"
          label="City"
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="city"
          rounded
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
            rounded
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
            v-model.trim="zip"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            mask="#####"
            rounded
            dense
            style="width: 100%; max-width: 49%"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
  <FooterComponent />
</template>
