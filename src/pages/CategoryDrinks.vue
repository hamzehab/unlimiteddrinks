<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted } from "vue";

const getProductsByCategory = async () => {};
onMounted(async () => {
  getProductsByCategory();
});
</script>

<template>
  <NavBar />
  <div class="main q-my-xl">
    <div class="q-ml-xl q-mb-xl ys text-h4">Category Name</div>

    <ProductListing
      class="fade"
      v-for="n in 4"
      :key="n"
      :product_id="n"
      :name="'Product Name'"
      :description="'Description'"
      :image="'static/pepsi.jpg'"
      :price="0"
    />
  </div>
  <FooterComponent />
</template>
