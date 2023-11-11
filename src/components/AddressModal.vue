<script setup>
import { ref } from "vue";

const addressAdded = ref(false);

const firstName = ref("");
const lastName = ref("");
const streetAddress = ref("");
const city = ref("");
const state = ref("");
const zip_code = ref("");

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

const addAddress = () => {
  console.log("address added");
};
</script>

<template>
  <q-dialog>
    <q-card style="width: 100%; max-width: 500px">
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
            />
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
      <q-card-actions align="right">
        <q-btn label="Close" flat v-close-popup />
        <q-btn
          label="Confirm"
          color="deep-purple-14"
          push
          @click="addAddress"
          v-close-popup="addressAdded"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
