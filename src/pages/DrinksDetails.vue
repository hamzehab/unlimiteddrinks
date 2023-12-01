<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductCard from "src/components/ProductCard.vue";

import { ref, onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { api } from "src/boot/axios";
import { useCartStore } from "src/stores/cart-store";

const cartStore = useCartStore();
const recProducts = ref([]);

const rating = ref(0);
const quantity = ref(1);

const isLoading = ref(false);
const addedToCart = ref(null);

const id = parseInt(window.location.href.split("/").at(-1));
const product = ref(null);
const getProductDetails = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);

    product.value = response.data;
    rating.value = response.data.rating;
  } catch (err) {
    console.error(err);
  }
};

const addToCart = (event) => {
  if (event && event.stopPropagation) event.stopPropagation();
  isLoading.value = true;

  cartStore.addItem(product.value.id, quantity.value);
  addedToCart.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  setTimeout(() => {
    addedToCart.value = null;
  }, 3000);
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value = parseInt(quantity.value) - 1;
  }
};

const increaseQuantity = () => {
  if (quantity.value < 25) {
    quantity.value = parseInt(quantity.value) + 1;
  }
};

const getRecommended = async () => {
  try {
    const response = await api.get("/roulette");
    recProducts.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    getProductDetails(to.params.id);
  }
});

onMounted(async () => {
  getRecommended();
  getProductDetails(id);

  const fadeIn = document.querySelectorAll(".fade");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("animated", entry.isIntersecting);
        entry.target.classList.toggle("fadeIn", entry.isIntersecting);
        entry.target.classList.toggle("slower", entry.isIntersecting);
        if (entry.isIntersecting) observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  fadeIn.forEach((entry) => {
    observer.observe(entry);
  });
});
</script>

<template>
  <NavBar />

  <div class="q-mx-xl">
    <div
      class="fade q-ma-xl cursor-pointer row items-center text-deep-purple-14"
    >
      <q-icon name="keyboard_arrow_left" size="30px" />
      <div class="text-h6 underline ys" @click="$router.back()">Back</div>
    </div>

    <div v-if="product" class="row justify-evenly" style="width: 100%">
      <img
        :src="`/static/products/${product.image}`"
        style="width: 100%; max-width: 800px; height: 100%"
        alt=""
      />

      <div
        v-if="product"
        class="fade oswald q-mt-xl"
        style="width: 100%; max-width: 800px"
      >
        <div class="text-caption fade">
          {{
            product.category_name[0].toUpperCase() +
            product.category_name.substring(1)
          }}
        </div>
        <div class="text-h4 ys fade">
          {{ product.name }}
          <span class="text-caption">by {{ product.brand }}</span>
        </div>
        <div class="cursor-pointer row items-center oswald">
          <div class="text-overline q-mr-xs">{{ rating.toFixed(1) }}</div>
          <q-rating
            v-model="rating"
            max="5"
            size="sm"
            color="deep-purple-14"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            readonly
          />
          <div class="on-right">{{ product.reviews.length }} Reviews</div>
        </div>

        <q-separator class="q-my-md" />
        <div class="text-h3 ys q-mb-xl">$ {{ product.price.toFixed(2) }}</div>
        <div class="text-body1 q-mb-xl">{{ product.description }}</div>

        <div class="row justify-end items-center q-mr-md q-mb-md no-wrap">
          <q-icon
            class="cursor-pointer on-left"
            name="remove"
            size="20px"
            @click="decreaseQuantity()"
          />
          <q-input
            class="rounded-borders"
            input-class="ys text-bold text-h6 text-center"
            style="width: 5rem"
            v-model="quantity"
            mask="##"
            dense
            borderless
            unmasked-value
            readonly
          />
          <q-icon
            class="cursor-pointer on-right"
            name="add"
            size="20px"
            @click="increaseQuantity()"
          />

          <q-btn
            class="q-ml-xl"
            style="width: 80%"
            :loading="isLoading"
            :color="product.quantity === 0 ? 'negative' : 'deep-purple-14'"
            :label="product.quantity === 0 ? 'OUT OF STOCK' : 'Add to Cart'"
            rounded
            push
            :disable="product.quantity === 0"
            @click="addToCart()"
          >
            <q-icon
              v-if="product.quantity !== 0"
              name="mdi-cart-outline on-right"
            />
          </q-btn>
        </div>

        <div class="row justify-end items-center q-mr-md text-body1">
          <div v-if="cartStore.items.find((item) => item.product_id === id)">
            <div
              v-if="
                cartStore.items.find((item) => item.product_id === id)
                  .quantity +
                  quantity <=
                25
              "
            >
              <transition
                appear
                enter-active-class="animated zoomIn"
                leave-active-class="animated zoomOut"
              >
                <div v-if="addedToCart" class="text-positive animated zoomIn">
                  {{ product.name }} successfully added to cart!
                </div>
              </transition>
              <transition
                appear
                enter-active-class="animated zoomIn"
                leave-active-class="animated zoomOut"
              >
                <div
                  v-if="addedToCart == false"
                  class="text-negative animated zoomIn slow"
                >
                  Something went wrong adding item to cart!
                </div>
              </transition>
            </div>
            <transition
              appear
              enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut"
            >
              <div
                v-if="
                  cartStore.items.find((item) => item.product_id === id)
                    .quantity +
                    quantity >
                    25 && addedToCart === null
                "
                class="text-amber-8"
              >
                Quantity exceeds limit
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
  <q-separator class="q-my-xl" inset />
  <div class="ys fade text-center text-bold text-h4 text-weight-light q-ma-xl">
    Recommended Beverages
  </div>
  <div class="q-mx-xl q-mb-xl row justify-evenly">
    <ProductCard
      class="fade"
      v-for="(product, index) in recProducts"
      :key="index"
      :product="product"
    />
  </div>

  <FooterComponent />
</template>
