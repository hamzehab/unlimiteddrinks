<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { onBeforeRouteUpdate, useRoute } from "vue-router";

const $route = useRoute();
const category = ref(
  $route.params.category
    .split("-")
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ")
);

const products = ref(null);
const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/${category}`);
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
  }
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
        {{ products.length }} results found for category: {{ category }}
      </div>
      <div v-else>No results found for category: {{ category }}</div>
    </div>

    <ProductListing
      class="fade"
      v-for="(product, n) in products"
      :key="n"
      :product="product"
    />
  </div>
  <FooterComponent />
</template>
