<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useRoute } from "vue-router";

const $route = useRoute();

const capitalizeCategory = (category) => {
  const updated_category_name = category.toLowerCase().split(" ");
  return updated_category_name
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

const products = ref(null);
const getProductsByCategory = async () => {
  try {
    const response = await api.get(`/products/${$route.params.category}`);
    products.value = response.data;
  } catch (err) {
    console.error(err);
  }
};
onMounted(async () => {
  getProductsByCategory();
});
</script>

<template>
  <NavBar />
  <div class="main q-my-xl">
    <div class="q-ml-xl q-mb-xl ys text-h4">
      {{ capitalizeCategory($route.params.category) }}
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
