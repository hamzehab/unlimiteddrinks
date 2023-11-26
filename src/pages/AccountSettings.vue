<script setup>
import AddressModal from "src/components/AddressModal.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";

import { useAuth0 } from "@auth0/auth0-vue";
import { ref, computed } from "vue";
import { useCustomerStore } from "src/stores/customer-store";
import { api } from "src/boot/axios";

const customerStore = useCustomerStore();
const auth0 = useAuth0();

const editName = ref(false);
const deletetion = ref(false);
const newAddress = ref(false);

const isError = ref(null);
const message = ref(null);

const email = customerStore.customer.email;

const first_name = ref(customerStore.customer.firstName);
const last_name = ref(customerStore.customer.lastName);

const address_first_name = ref("");
const address_last_name = ref("");
const street = ref("");
const apt = ref("");
const city = ref("");
const state = ref("");
const zip_code = ref("");

const disableAddressSave = computed(() => {
  return !(
    address_first_name.value &&
    address_last_name.value &&
    street.value &&
    city.value &&
    state.value &&
    (zip_code.value === null ? zip_code.value : zip_code.value.length === 5)
  );
});

const disableNameSave = computed(() => {
  return !(first_name.value && last_name.value);
});

const model = ref(null);

const handleClick = async () => {
  const customer_name = {
    first_name: first_name.value,
    last_name: last_name.value,
  };
  try {
    const response = await api.post(
      `/customer/editName/${auth0.user.value.sub.split("|")[1]}`,
      customer_name
    );
    console.log(response.status);
    if (response.status === 204) {
      isError.value = true;
      message.value = "No changes were made since there were no edits made!";
    } else if (response.status === 200) {
      isError.value = false;
      message.value = "Name changed successfully";
      first_name.value = response.data.first_name;
      last_name.value = response.data.last_name;
      setTimeout(() => {
        isError.value = null;
        message.value = null;
      }, 2000);
      editName.value = false;
    } else {
      isError.value = true;
      message.value = "Something went wrong!";
    }
  } catch (err) {
    isError.value = true;
    message.value = "Something went wrong!";
    console.error(err);
  }
};

const deleteAccount = () => {
  deletetion.value = false;
};

const addresses = sessionStorage.getItem("customer")
  ? [customerStore.getSelectedAddress, ...customerStore.getAddresses]
  : [];

const addressStrings = addresses.map((address) => {
  return {
    id: address.id,
    label: {
      first_name: `${address.first_name}`,
      last_name: `${address.last_name}`,
    },
    value: {
      street: `${address.street}`,
      apt: `${address.street2 ? " " + address.street2 + ", " : ""}`,
      city: `${address.city}`,
      state: `${address.state}`,
      zip_code: `${address.zip_code}`,
    },
  };
});

const updateSelectedAddress = (value) => {
  model.value = value;

  address_first_name.value = value.label.first_name;
  address_last_name.value = value.label.last_name;
  street.value = value.value.street;
  apt.value = value.value.apt;
  city.value = value.value.city;
  state.value = value.value.state;
  zip_code.value = value.value.zip_code;
};

const closeAddressModal = () => {
  newAddress.value = false;
  location.reload();
};

const saveAddressUpdates = async () => {
  const data = {
    first_name: address_first_name.value,
    last_name: address_last_name.value,
    street: street.value,
    street2: apt.value !== "" ? apt.value : undefined,
    city: city.value,
    state: state.value,
    zip_code: zip_code.value,
  };
  try {
    const response = await api.post(
      `/address/update/${auth0.user.value.sub.split("|")[1]}/${model.value.id}`,
      data
    );

    if (response.status === 200) {
      isError.value = false;
      message.value = "Address Updated!";

      customerStore.updateAddress(response.data);
      setTimeout(() => {
        isError.value = null;
        message.value = null;
        location.reload(true);
      }, 2000);
    } else if (response.status === 204) {
      isError.value = true;
      message.value =
        "Address not updated were made since there were no changes!";
    } else {
      isError.value = true;
      message.value = "Something went wrong!";
    }
  } catch (e) {
    isError.value = true;
    message.value = "Something went wrong!";
    console.error(e);
  }
};

const usStates = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];
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
                  v-if="!editName"
                  @click="editName = true"
                >
                  Edit Name
                </div>
              </div>
            </div>
            <transition
              appear
              enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut"
            >
              <q-card-section
                v-if="message"
                class="q-pa-none q-pb-md"
                :class="isError ? 'text-red' : 'text-green'"
              >
                {{ message }}
              </q-card-section>
            </transition>
            <q-input
              class="q-mb-lg"
              label="First Name"
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
              v-model.trim="first_name"
              :disable="!editName"
            />
            <q-input
              label="Last Name"
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
              v-model.trim="last_name"
              :disable="!editName"
            />
          </div>
        </q-card-section>

        <q-card-section v-if="editName" class="row justify-center oswald">
          <q-btn
            class="q-mt-lg on-left"
            label="Cancel"
            color="dark"
            flat
            @click="editName = false"
          />
          <q-btn
            class="q-mt-lg on-right"
            label="Confirm Changes"
            color="deep-purple-14"
            push
            :disable="disableNameSave"
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
              ref="addressSelect"
              outlined
              v-model.trim="model"
              :options="addressStrings"
              label="Select Address"
              style="width: 60%"
            >
              <template v-slot:option="scope">
                <q-item
                  clickable
                  v-close-popup
                  @click="updateSelectedAddress(scope.opt)"
                >
                  <q-item-section>
                    <div class="text-bold text-body2">
                      {{ scope.opt.label.first_name }}
                      {{ scope.opt.label.last_name }}
                    </div>
                    <span class="text-caption">
                      {{ scope.opt.value.street }}{{ scope.opt.value.apt }},

                      {{ scope.opt.value.city }}
                      {{ scope.opt.value.state }}
                      {{ scope.opt.value.zip_code }}
                    </span>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <q-item class="q-pa-none">
                  <q-item-section>
                    <div class="text-bold text-body1">
                      {{ scope.opt.label.first_name }}
                      {{ scope.opt.label.last_name }}
                    </div>
                    <span class="text-body2">
                      {{ scope.opt.value.street }}{{ scope.opt.value.apt }}
                      {{ scope.opt.value.city }}
                      {{ scope.opt.value.state }}
                      {{ scope.opt.value.zip_code }}
                    </span>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-btn flat color="deep-purple-14" @click="newAddress = true">
              <div class="text-center">
                <q-icon name="add" size="30px" />
                <div>Add Address</div>
              </div>
            </q-btn>
          </div>
          <q-card-section v-if="model" class="q-pa-none q-pt-lg">
            <q-input
              class="q-my-md"
              label="First Name"
              v-model.trim="address_first_name"
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
            />
            <q-input
              label="Last Name"
              v-model.trim="address_last_name"
              standout="bg-grey-3 text-deep-purple-14 "
              input-class="text-dark"
            />
            <q-input
              class="q-my-md"
              label="Street Address"
              v-model.trim="street"
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
            />
            <q-input
              label="Apt, suite, unit, building, floor, etc."
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
              v-model.trim="apt"
            />
            <q-input
              class="q-my-md"
              label="City"
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
              v-model.trim="city"
            />
            <div class="row justify-between">
              <q-select
                standout="bg-grey-3 text-deep-purple-14"
                style="width: 100%; max-width: 49%"
                label="State"
                emit-value
                map-options
                options-dense
                v-model="state"
                :options="usStates"
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
                style="width: 100%; max-width: 49%"
              />
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section v-if="message && model" class="q-pb-none">
          <div
            class="text-center text-body2 oswald"
            :class="isError ? 'text-red' : 'text-green'"
          >
            {{ message }}
          </div>
        </q-card-section>
        <q-card-section v-if="model" class="flex flex-center oswald">
          <div
            class="text-center text-body1 cursor-pointer underline"
            style="width: 200px"
            @click="model = null"
          >
            Cancel
          </div>
          <q-btn
            label="Save Changes"
            color="deep-purple-14"
            style="width: 200px"
            push
            :disable="disableAddressSave"
            @click="saveAddressUpdates"
          />
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

    <AddressModal v-model="newAddress" @add-address="closeAddressModal" />
  </div>
  <FooterComponent />
</template>
