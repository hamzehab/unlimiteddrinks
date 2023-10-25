<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "src/stores/cart-store";

const $router = useRouter();
const cartStore = useCartStore();

const quantity = ref(0);
const rating = ref(3.2);
const isLoading = ref(false);

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

const viewFullItem = () => {
  $router.push(`/${category}/${props.product_id}`);
};

const addToCart = () => {
  isLoading.value = true;

  cartStore.addItem(
    { id: props.product_id, price: 20, name: "test", category: "category" },
    quantity.value
  );
  addedToCart.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  setTimeout(() => {
    addedToCart.value = null;
  }, 3000);
};
</script>

<template>
  <q-card class="q-mx-auto q-my-md" style="max-width: 70%" bordered>
    <q-card-section class="q-mx-lg q-my-md" horizontal>
      <img
        class="cursor-pointer"
        src="static/pepsi.jpg"
        style="width: 200px; height: 200px"
      />

      <q-card-section class="q-pb-none" style="width: 100%">
        <div class="ys text-h6">Name of product</div>
        <div class="text-grey-6 text-caption row">
          <span>Date</span>
          <q-separator vertical class="on-right on-left" />
          <span>by Company</span>
        </div>
        <div class="row items-center">
          <div class="text-overline q-mr-xs">0</div>
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
          <div class="on-right">0 Reviews</div>
        </div>
        <div class="q-mt-md cursor-pointer" @click="viewFullItem">
          <span class="ys row items-start text-body1">
            $<span class="oswald text-h5">40.00</span>
          </span>
        </div>
        <q-card-section class="q-pt-none">
          <div class="row justify-end items-center">
            <q-icon
              class="cursor-pointer on-left"
              name="remove"
              size="20px"
              @click="decreaseQuantity"
            />
            <q-input
              class="rounded-borders"
              input-class="ys text-bold text-h6 text-center"
              style="width: 2.5rem"
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
              @click="increaseQuantity"
            />
            <q-btn
              class="on-right"
              :loading="isLoading"
              color="deep-purple-14"
              rounded
              push
              label="Add to Cart"
              @click="addToCart"
            >
              <q-icon name="mdi-cart-outline on-right" />
            </q-btn>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
