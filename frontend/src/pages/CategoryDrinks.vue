<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted } from "vue";

const items = ref([1, 2, 3]);

const getProductsByCategory = async () => {};
onMounted(async () => {
  getProductsByCategory();
});
</script>

<template>
  <NavBar />
  <div class="main q-my-xl">
    <div class="q-ml-xl q-mb-xl ys text-h4">Category Name</div>

    <ProductListing v-for="item in items" :key="item.product_id" />
  </div>
  <FooterComponent />
</template>
