<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductListing from "src/components/ProductListing.vue";

import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

const $route = useRoute();

const currentPage = ref(1);
const products = ref(null);
const getProductsBySearch = async (query) => {
  try {
    const response = await api.get(`/product/search/${query}`);
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
    <div class="oswald text-body1 q-mx-auto" style="max-width: 70%">
      <div v-if="products && products.length > 0">
        Showing
        {{ products.slice((currentPage - 1) * 10, currentPage * 10).length }}
        of {{ products.length }}
        {{ products.length > 1 ? "results" : "result" }} for search: "{{
          $route.query.q
        }}"
      </div>
      <div v-else>No results found for search: {{ $route.query.q }}</div>
    </div>

    <div v-if="products && products.length > 0">
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
