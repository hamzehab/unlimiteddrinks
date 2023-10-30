<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

const $route = useRoute();

const products = ref(null);
const getProductsBySearch = async (query) => {
  try {
    const response = await api.get(`/search/${query}`);
    products.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  getProductsBySearch($route.query.q);
});

onBeforeRouteUpdate(async (to, from) => {
  if (to.query.q !== from.query.q) {
    getProductsBySearch(to.query.q);
  }
});
</script>

<template>
  <NavBar />
  <div v-if="products" class="main q-my-xl">
    <div class="q-ml-xl q-mb-xl ys text-h4">
      Search Results for: {{ $route.query.q }}
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
