<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { onBeforeRouteUpdate, useRoute, onBeforeRouteLeave } from "vue-router";

const $route = useRoute();
const category = ref(
  $route.params.category
    .split("-")
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ")
);

const currentPage = ref(parseInt(localStorage.getItem("currentPage")) || 1);
const products = ref(null);
const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/product/category/${category}`);
    products.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  getProductsByCategory($route.params.category);
});

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.category !== from.params.category) {
    getProductsByCategory(to.params.category);
    category.value = to.params.category
      .split("-")
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(" ");
    currentPage.value = 1; // Reset currentPage when navigating to a new category
    localStorage.setItem("currentPage", currentPage.value.toString()); // Set localStorage value
  }
});

onBeforeRouteLeave((to, from) => {
  localStorage.removeItem("currentPage");
});

watch(currentPage, (newPage) => {
  localStorage.setItem("currentPage", newPage.toString());
});
</script>

<template>
  <NavBar />
  <div class="main q-ma-xl">
    <div class="q-mx-auto q-mb-xl ys text-h4" style="max-width: 70%">
      {{ category }}
    </div>
    <div class="oswald text-body1 q-mx-auto" style="max-width: 70%">
      <div v-if="products">
        Showing
        {{ products.slice((currentPage - 1) * 10, currentPage * 10).length }}
        of {{ products.length }}
        {{ products.length > 1 ? "results" : "result" }} for category:
        {{ category }}
      </div>
      <div v-else>No results found for category: {{ category }}</div>
    </div>

    <div v-if="products">
      <ProductListing
        class="fade"
        v-for="(product, n) in products.slice(
          (currentPage - 1) * 10,
          currentPage * 10
        )"
        :key="n"
        :product="product"
      />
      <div class="flex flex-center q-my-xl">
        <q-pagination
          v-if="products.length > 10"
          v-model="currentPage"
          :max="Math.ceil(products.length / 10)"
          :max-pages="5"
          boundary-numbers
          color="deep-purple-14"
          active-design="push"
          active-color="deep-purple-14"
          direction-links
        />
      </div>
    </div>
  </div>
  <FooterComponent />
</template>
