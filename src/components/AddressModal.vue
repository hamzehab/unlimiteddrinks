<script setup>
import { ref, computed } from "vue";
import { api } from "src/boot/axios";
import { useAuth0 } from "@auth0/auth0-vue";
import { useCustomerStore } from "stores/customer-store";
import { states } from "src/assets/usStates";

const auth0 = useAuth0();
const customerStore = useCustomerStore();

const emit = defineEmits(["add-address"]);
const errorMsg = ref(null);
const isSuccessful = ref(null);

const firstName = ref(null);
const lastName = ref(null);
const streetAddress = ref(null);
const apt = ref(null);
const city = ref(null);
const state = ref(null);
const zip_code = ref(null);

const usStates = states;

const isRegistrationDisabled = computed(() => {
  return !(
    firstName.value &&
    lastName.value &&
    streetAddress.value &&
    city.value &&
    state.value &&
    (zip_code.value === null ? zip_code.value : zip_code.value.length === 5)
  );
});

const addAddress = async () => {
  const data = {
    first_name: firstName.value,
    last_name: lastName.value,
    street: streetAddress.value,
    state: state.value,
    city: city.value,
    zip_code: zip_code.value,
  };
  try {
    const newAddress = await api.post(
      `/address/add/${auth0.user.value.sub.split("|")[1]}`,
      data
    );
    customerStore.addAddress(newAddress.data);
    isSuccessful.value = true;
    errorMsg.value = false;
    emit("add-address", newAddress.data);
  } catch (error) {
    errorMsg.value = true;
    isSuccessful.value = false;
    console.error(error);
  }
  setTimeout(() => {
    isSuccessful.value = null;
  }, 2000);
};
</script>

<template>
  <q-dialog>
    <q-card style="width: 100%; max-width: 600px">
      <q-card-section class="ys text-h6 bg-dark text-white">
        Add a new address
      </q-card-section>
      <q-card-section class="oswald text-body1 q-pb-none q-mx-md">
        <div class="q-mb-sm">First Name</div>
        <q-input
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="firstName"
        />
      </q-card-section>
      <q-card-section class="oswald text-body1 q-pb-none q-mx-md">
        <div class="q-mb-sm">Last Name</div>
        <q-input
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="lastName"
        />
      </q-card-section>
      <q-card-section class="oswald text-body1 q-pb-none q-mx-md">
        <div class="q-mb-sm">Street Address</div>
        <q-input
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="streetAddress"
        />
      </q-card-section>
      <q-card-section class="oswald text-body1 q-pb-none q-mx-md">
        <div class="q-mb-sm">Apt, suite, etc. (optional)</div>
        <q-input
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="apt"
        />
      </q-card-section>
      <q-card-section class="oswald text-body1 q-pb-none q-mx-md">
        <div class="q-mb-sm">City</div>
        <q-input
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="city"
        />
      </q-card-section>
      <q-card-section class="oswald text-body1 q-mx-md">
        <div class="row justify-between">
          <div style="width: 100%; max-width: 45%">
            <div class="q-mb-sm">State</div>

            <q-select
              standout="bg-grey-3 text-deep-purple-14"
              v-model.trim="state"
              :options="usStates"
              label="State"
              emit-value
              map-options
              options-dense
            >
              <template v-slot:selected-item="scope">
                <span class="text-dark">
                  {{ scope.opt.label }}
                </span>
              </template>
            </q-select>
          </div>
          <div style="width: 100%; max-width: 45%">
            <div class="q-mb-sm">ZIP Code</div>
            <q-input
              standout="bg-grey-3 text-deep-purple-14"
              input-class="text-dark"
              v-model.trim="zip_code"
              mask="#####"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="q-mr-lg q-pb-md" align="right">
        <q-btn label="Close" flat v-close-popup />
        <q-btn
          :class="errorMsg ? 'animated shakeX slower' : ''"
          label="Confirm"
          color="deep-purple-14"
          :disable="isRegistrationDisabled"
          push
          @click="addAddress()"
        />
      </q-card-actions>
      <q-card-section
        v-if="errorMsg"
        class="text-red text-bold text-caption q-mr-lg q-pt-none"
        align="right"
      >
        Something went wrong
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
