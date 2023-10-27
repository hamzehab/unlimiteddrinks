<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted } from "vue";

const capitalizeCategory = (category) => {
  const updated_category_name = category.toLowerCase().split(" ");
  return updated_category_name
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

const getProductsByCategory = async () => {};
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
