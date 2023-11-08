<script setup>
import { ref } from "vue";

const firstName = ref("");
const lastName = ref("");
const streetAddress = ref("");
const city = ref("");
const state = ref("");
const zip_code = ref("");

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
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
              use-input
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
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
