<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductCard from "src/components/ProductCard.vue";

import { ref } from "vue";

const slide = ref(1);
const rating = ref(3.2);
const quantity = ref(1);

const addToCart = (event) => {
  event.stopPropagation();
  console.log(quantity.value);
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value = parseInt(quantity.value) - 1;
  }
};

const increaseQuantity = () => {
  if (quantity.value < 99) {
    quantity.value = parseInt(quantity.value) + 1;
  }
};
</script>

<template>
  <NavBar />
  <div class="q-mx-xl">
    <div class="q-ma-xl cursor-pointer row items-center text-deep-purple-14">
      <q-icon name="keyboard_arrow_left" size="30px" />
      <div class="text-h6 back-btn ys" @click="$router.back()">Back</div>
    </div>

    <div class="row justify-evenly" style="width: 100%">
      <q-carousel
        class="rounded-borders"
        v-model="slide"
        control-color="dark"
        style="width: 100%; max-width: 800px"
        height="600px"
        swipeable
        animated
        arrows
        thumbnails
      >
        <q-carousel-slide :name="1" img-src="/static/warehouse.jpg" />
        <q-carousel-slide :name="2" img-src="/static/vending.jpg" />
        <q-carousel-slide :name="3" img-src="/static/shelfDrinks.jpg" />
        <q-carousel-slide :name="4" img-src="/static/pepsi.jpg" />
        <q-carousel-slide :name="5" img-src="/static/shelfDrinks2.jpg" />
      </q-carousel>

      <div class="oswald q-mt-xl" style="width: 100%; max-width: 800px">
        <div class="text-caption">Category</div>
        <div class="text-h4 ys">Product Name</div>
        <div class="cursor-pointer row items-center">
          <div class="text-overline q-mr-xs">{{ rating }}</div>
          <q-rating
            v-model="rating"
            max="5"
            size="sm"
            color="orange"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            readonly
          />
          <div class="on-right">0 Reviews</div>
        </div>

        <q-separator class="q-my-md" />
        <div class="text-h3 ys q-mb-xl">$ 0.00</div>
        <div class="text-body1 q-mb-xl">Description</div>

        <div class="row justify-end items-center q-mr-md q-mb-md" style="flex-wrap: nowrap;">
          <q-icon
            class="cursor-pointer on-left"
            name="remove"
            size="20px"
            @click="decreaseQuantity"
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
            @click="increaseQuantity"
          />
          <q-btn
            class="q-ml-xl"
            style="width: 80%;"
            color="deep-purple-14"
            label="Add to Cart"
            rounded
            push
            @click="addToCart"
          >
            <q-icon name="mdi-cart-outline on-right" />
          </q-btn>
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
      v-for="n in 4"
      :key="n"
      :product_id="n"
      :name="'Product Name'"
      :description="'Description'"
      :image="'/static/pepsi.jpg'"
      :price="0"
    />
  </div>

  <FooterComponent />
</template>
