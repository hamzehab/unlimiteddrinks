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

const pageLoad = ref(false);
onMounted(async () => {
  pageLoad.value = true;
  getProductsBySearch($route.query.q);
  pageLoad.value = false;
});

onBeforeRouteUpdate(async (to, from) => {
  if (to.query.q !== from.query.q) {
    getProductsBySearch(to.query.q);
  }
});
</script>

<template>
  <NavBar />
  <div></div>
  <div v-if="products && !pageLoad" class="main q-my-xl">
    <div class="q-ml-xl q-mb-xl ys text-h4">
      Search Results for: {{ $route.query.q }}
    </div>
    <div class="fade oswald text-body1 q-mx-auto" style="max-width: 70%">
      <div v-if="products && products.length > 0">
        Showing
        {{ products.slice((currentPage - 1) * 10, currentPage * 10).length }}
        of {{ products.length }}
        {{ products.length > 1 ? "results" : "result" }} for search: "{{
          $route.query.q
        }}"
      </div>
      <div v-else class="fade">
        No results found for search: {{ $route.query.q }}
      </div>
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
  <div v-else class="main flex flex-center">
    <q-spinner-tail color="deep-purple-14 q-pb-xl" size="20rem" />
  </div>
  <FooterComponent />
</template>
