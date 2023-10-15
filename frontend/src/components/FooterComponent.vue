<script setup>
import { ref } from "vue";

const name = ref(null);
const email = ref(null);
const subject = ref(null);
const message = ref(null);
</script>

<template>
  <div class="text-white bg-dark">
    <div class="q-pa-xl q-mx-xl">
      <div class="ys text-weight-bolder text-h3 text-center">
        Quenching Convenience: Simplifying Student Life, One Sip at a Time
        <img class="" src="static/footerCola.png" alt="Pastel Cola" />
      </div>
      <div class="row justify-between q-mt-xl items-center">
        <div class="oswald text-center" style="width: 20%">
          <div class="ys text-h6 q-mb-md">SHOP</div>
          <div v-for="n in 5" :key="n" class="text-body1 q-my-md">
            Category {{ n }}
          </div>
        </div>

        <div style="width: 35%">
          <div class="ys text-h5 q-mb-md">About Unlimited Drinks</div>
          <div class="oswald text-h6 text-weight-regular">
            Unlimited Drinks is a beverage company that provides convenience and
            pleasure on the go. We provide a variety of drinks for our customers
            to choose from. We work hard to fullfill our customers. Our mission
            is to provide our custoemrs with a refreshing beverage that can be
            purchased in bulk or individually. We began our journey during the
            pandemic in the year 2020 and we are striving and pushing to provide
            the best services.
          </div>
        </div>
        <div style="width: 35%">
          <div class="ys text-h6">Contact Us</div>
          <div class="oswald contact-form">
            <q-input
              class="q-my-lg"
              type="text"
              label="Preferred Name"
              v-model="name"
              dense
              standout
              dark
            />
            <q-input
              class="q-my-lg"
              type="text"
              label="Email"
              v-model="email"
              dense
              dark
              standout
            />
            <q-input
              class="q-my-lg"
              type="text"
              label="Subject"
              v-model="subject"
              dense
              dark
              standout
            />
            <q-input
              class="q-my-lg"
              label="Your Message"
              v-model="message"
              autogrow
              standout
              dark
              dense
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
