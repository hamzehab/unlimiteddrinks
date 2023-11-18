<script setup>
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { computed, ref, watchEffect, onMounted } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import router from "src/router";

const auth0 = useAuth0();
const $router = useRouter();
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

const loading = ref(false);
const isRegistrationDisabled = computed(() => {
  return !(
    firstName.value &&
    lastName.value &&
    street.value &&
    city.value &&
    state.value &&
    (zip.value === null ? zip.value : zip.value.length === 5)
  );
});

const email = ref(auth0.user.value.email);
const firstName = ref(null);
const lastName = ref(null);

const street = ref(null);
const apt = ref(null);
const city = ref(null);
const state = ref(null);
const zip = ref(null);

const createAccount = async () => {
  loading.value = true;
  try {
    const id = auth0.user._rawValue.sub.split("|")[1];
    const data = {
      customer: {
        id: id,
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
      },
      address: {
        first_name: firstName.value,
        last_name: lastName.value,
        street: street.value,
        street2: apt.value,
        city: city.value,
        state: state.value,
        zip_code: zip.value,
      },
    };
    await api.post("/create/customer", data);
    $router.push("/");
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
};

const logout = async () => {
  await auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  sessionStorage.removeItem("cart");
  sessionStorage.removeItem("customer");
};

onMounted(() => {
  if (sessionStorage.getItem("customer")) {
    $router.back();
  }
});

watchEffect(() => {
  email.value = auth0.user.value.email;
});
</script>

<template>
  <div style="pointer-events: none">
    <NavBar />
  </div>

  <div class="main">
    <div class="q-mx-auto q-my-xl" style="width: 60%">
      <q-card class="q-pa-md">
        <q-card-section :horizontal="!$q.platform.is.mobile">
          <q-card-section
            class="row items-center justify-center q-mx-auto"
            style="width: 50%"
          >
            <img
              src="/static/logo.png"
              alt="Unlimited Drinks Logo"
              style="width: 100%; max-width: 400px"
            />
          </q-card-section>
          <q-separator vertical inset />
          <q-card-section :style="$q.platform.is.mobile ? '' : 'width: 70%'">
            <q-card-section class="ys text-h4 flex nowrap items-center">
              <q-icon name="mdi-account-circle-outline" size="50px" />
              <span class="on-right">Create Profile</span>
            </q-card-section>
            <q-card-section class="q-mx-auto">
              <q-input
                label="Email"
                standout="bg-grey-3 text-deep-purple-14"
                v-model.trim="email"
                input-class="text-dark "
                rounded
                disable
                dense
              />
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

            <q-card-section align="center">
              <q-btn
                class="text-bold"
                label="Cancel"
                color="dark"
                flat
                style="width: 100%; max-width: 250px"
                @click="logout"
              />
              <q-btn
                :loading="loading"
                :disabled="isRegistrationDisabled"
                class="text-bold"
                label="Complete Registration"
                color="deep-purple-14"
                push
                style="width: 100%; max-width: 250px"
                @click="createAccount"
              />
            </q-card-section>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <div style="pointer-events: none">
    <FooterComponent />
  </div>
</template>
