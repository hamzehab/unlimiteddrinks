<script setup>
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import emailjs from "@emailjs/browser";

const name = ref(null);
const email = ref(null);
const subject = ref(null);
const message = ref(null);

const isLoading = ref(false);
const submitted = ref(null);
const categories = ref([]);

const error = ref("");

const submitForm = async () => {
  if (
    !name.value.trim() ||
    !email.value.trim() ||
    !subject.value.trim() ||
    !message.value.trim()
  ) {
    error.value = "Please fill in all the fields";
    submitted.value = false;
    return;
  }
  isLoading.value = true;
  try {
    const form = {
      from_name: name.value.trim(),
      message: message.value.trim(),
      subject: subject.value.trim(),
      email: email.value.trim(),
    };

    const response = await emailjs.send(
      "service_t1v57jf",
      "template_r5gh23z",
      form,
      "LONOwLZJYS63ujYp5"
    );

    submitted.value = response.status === 200 ? true : false;
  } catch (err) {
    submitted.value = false;
    error.value = "Something went wrong! Please try again later";
    console.error(err);
  }

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  setTimeout(() => {
    submitted.value = null;
  }, 2000);
};

const capitalizeCategory = (category) => {
  const updated_category_name = category.toLowerCase().split(" ");
  return updated_category_name
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    categories.value = response.data;
  } catch (err) {
    console.error(error);
  }
};

onMounted(async () => {
  getCategories();
});
</script>

<template>
  <div class="text-white bg-dark">
    <div class="q-pa-xl q-mx-xl">
      <div class="ys text-weight-bolder text-h3 text-center">
        Quenching Convenience: Simplifying Student Life, One Sip at a Time
        <img class="" src="/static/footerCola.png" alt="Pastel Cola" />
      </div>
      <div class="row justify-between q-mt-xl items-center">
        <div class="oswald text-center" style="width: 20%">
          <div class="ys text-h6 q-mb-md">SHOP</div>
          <div
            v-for="category in categories"
            :key="category.id"
            class="text-body1 q-my-md cursor-pointer"
            @click="$router.push(`/${category.name}`)"
          >
            {{ capitalizeCategory(category.name) }}
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
          <div class="oswald">
            <q-input
              class="q-my-lg"
              type="text"
              label="Preferred Name"
              v-model="name"
              dense
              standout="text-deep-purple-14"
              dark
              rounded
            />
            <q-input
              class="q-my-lg"
              type="text"
              label="Email"
              v-model="email"
              dense
              dark
              rounded
              standout="text-deep-purple-14"
            />
            <q-input
              class="q-my-lg"
              type="text"
              label="Subject"
              v-model="subject"
              dense
              dark
              rounded
              standout="text-deep-purple-14"
            />
            <q-input
              class="q-my-lg"
              label="Your Message"
              v-model="message"
              autogrow
              standout="text-deep-purple-14"
              dark
              rounded
              dense
            />
            <q-btn
              :loading="isLoading"
              class="full-width"
              label="Contact Us"
              color="deep-purple-14"
              rounded
              push
              @click="submitForm"
            />
          </div>
          <div
            v-if="submitted"
            class="oswald text-center text-positive q-mt-sm"
          >
            Thank you for contacting us! We will get back to you shortly
            <span class="text-h6">&#128077;&#128513;</span>
          </div>
          <div
            v-if="submitted === false"
            class="oswald text-center text-negative q-mt-sm"
          >
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
