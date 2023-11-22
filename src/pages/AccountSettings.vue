<script setup>
import AddressModal from "src/components/AddressModal.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";

import { ref } from "vue";
import { useCustomerStore } from "src/stores/customer-store";

const customerStore = useCustomerStore();

const editName = ref(true);
const deletetion = ref(false);
const newAddress = ref(false);

const email = customerStore.customer.email;

const first_name = ref(customerStore.customer.firstName);
const last_name = ref(customerStore.customer.lastName);

const street = ref("");
const apt = ref("");
const city = ref("");
const state = ref("");
const zip_code = ref("");

const model = ref(null);
const addresses = sessionStorage.getItem("customer")
  ? [customerStore.getSelectedAddress, ...customerStore.getAddresses]
  : [];

const addressStrings = addresses.map((address) => {
  return `${address.street}${
    address.street2 ? " " + address.street2 + ", " : ", "
  }${address.city}, ${address.state}, ${address.zip_code}`;
});

const handleClick = () => {
  if (!editName.value) {
    editName.value = true;
  }
};

const deleteAccount = () => {
  deletetion.value = false;
};

const updateSelectedAddress = (value) => {
  const selectedAddressObject = addresses.find((address) => {
    return (
      `${address.street} ${address.street2 ? address.street2 + ", " : ""}${
        address.city
      }, ${address.state}, ${address.zip_code}` === value
    );
  });

  if (selectedAddressObject) {
    street.value = selectedAddressObject.street;
    apt.value = selectedAddressObject.street2 || "";
    city.value = selectedAddressObject.city;
    state.value = selectedAddressObject.state;
    zip_code.value = selectedAddressObject.zip_code;
  }
};
</script>

<template>
  <NavBar />
  <div class="main">
    <div class="q-mx-auto q-my-xl" style="width: 70%">
      <div class="ys text-h4 row items-center">
        <q-icon name="mdi-account-circle-outline" size="50px" />
        <div class="on-right">
          <div>Your Account</div>
          <div class="text-body1 on-right">
            Welcome, {{ customerStore.getFullName }}
          </div>
          <div class="text-caption on-right">
            Member Since: {{ customerStore.customer.memberSince }}
          </div>
        </div>
      </div>

      <q-separator class="q-mt-lg q-mb-xl" />

      <q-card class="q-pa-md">
        <q-card-section class="oswald" style="width: 100%; max-width: 60%">
          <div class="ys text-h6 q-mb-sm">Email</div>
          <q-input
            class="q-mb-sm"
            label="Email Address"
            v-model.trim="email"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            disable
          />
          <div class="row justify-end text-grey-6 text-body2">
            Email cannot be edited
          </div>
        </q-card-section>
      </q-card>

      <q-separator class="q-my-xl" />
      <q-card class="q-pa-lg">
        <q-card-section class="row justify-between">
          <div class="oswald" style="width: 100%; max-width: 60%">
            <div class="row ys q-mb-md">
              <div class="text-h6 on-left">Name</div>
              <div
                class="oswald underline row items-center text-deep-purple-14 text-body2"
              >
                <div
                  class="cursor-pointer"
                  v-if="editName"
                  @click="editName = false"
                >
                  Edit Name
                </div>
              </div>
            </div>
            <q-input
              class="q-mb-lg"
              label="First Name"
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
              v-model.trim="first_name"
              :disable="editName"
            />
            <q-input
              label="Last Name"
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
              v-model.trim="last_name"
              :disable="editName"
            />
          </div>
        </q-card-section>

        <q-card-section class="row justify-center oswald">
          <q-btn
            v-if="!editName"
            class="q-mt-lg on-left"
            label="Cancel"
            color="dark"
            flat
            @click="editName = true"
          />
          <q-btn
            v-if="!editName"
            class="q-mt-lg on-right"
            label="Confirm Changes"
            color="deep-purple-14"
            push
            @click="handleClick"
          />
        </q-card-section>
      </q-card>

      <q-separator class="q-my-xl" />
      <q-card class="q-pa-md">
        <q-card-section class="oswald">
          <div class="q-mb-sm row items-center">
            <div class="ys text-h6 on-left">Addresses</div>
          </div>
          <div class="row justify-between">
            <q-select
              outlined
              v-model.trim="model"
              :options="addressStrings"
              label="Select Address"
              style="width: 60%"
              @update:model-value="updateSelectedAddress"
            />

            <q-btn flat color="grey-6" @click="newAddress = true">
              <div class="text-center">
                <q-icon name="add" size="30px" />
                <div>Add Address</div>
              </div>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>

      <div class="row justify-end q-mt-xl">
        <q-btn
          class="q-pa-md"
          flat
          label="Delete Account"
          color="negative"
          @click="deletetion = true"
        />
      </div>
    </div>
    <q-dialog v-model="deletetion">
      <q-card style="width: 100%; max-width: 700px">
        <q-card-section class="text-h6 ys bg-deep-purple-14 text-white">
          Are you sure you want to permanently delete your account?
        </q-card-section>
        <q-card-section class="oswald text-body1 q-mx-xl">
          <div>By deleting your account:</div>
          <div class="q-ml-md">
            <div>
              <q-icon name="remove" />
              You will lose access to your order history and any saved cart
              items.
            </div>
            <div>
              <q-icon name="remove" />
              Any active subscriptions or membership benefits will be canceled.
            </div>
            <div>
              <q-icon name="remove" />
              You will lose access to your order history and any saved cart
              items.
            </div>
            <div>
              <q-icon name="remove" />
              You won't be able to track the status of current or future orders.
            </div>
            <div>
              <q-icon name="remove" />
              Your personal information will be permanently removed from our
              system and will not be used for future transactions.
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="q-pb-md" align="right">
          <q-btn
            label="cancel"
            push
            color="dark"
            style="width: 100%; max-width: 150px"
            v-close-popup
          />
          <q-btn
            label="delete"
            style="width: 100%; max-width: 150px"
            flat
            color="negative"
            @click="deleteAccount"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <AddressModal v-model="newAddress" />
  </div>
  <FooterComponent />
</template>
