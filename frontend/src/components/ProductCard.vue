<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

const props = defineProps({
  product_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const quantity = ref(1);
const addFailed = ref(false);

const category = "TBD";

const viewFullItem = () => {
  $router.push(`/${category}/${props.product_id}`);
};

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
  <q-card class="q-my-lg oswald q-mx-xl" style="width: 100%; max-width: 350px">
    <img class="cursor-pointer" :src="image" @click="viewFullItem" />

    <q-card-section class="q-pb-none" @click="viewFullItem">
      <span class="text-h6 cursor-pointer" @click="viewFullItem">{{
        name
      }}</span>
    </q-card-section>

    <q-card-section class="q-py-none">
      <div>{{ description }}</div>
    </q-card-section>

    <q-card-section class="q-pb-none row justify-end items-center">
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
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-caption row justify-end">Max limit 25</div>
    </q-card-section>
    <q-card-section class="row justify-between items-center">
      <div class="ys text-h6 cursor-pointer" @click="viewFullItem">
        $ {{ parseFloat(price).toFixed(2) }}
      </div>

      <q-btn
        :class="addFailed ? 'animated shakeX slower' : ''"
        color="deep-purple-14"
        rounded
        push
        label="Add to Cart"
        @click="addToCart"
      >
        <q-icon name="mdi-cart-outline on-right" />
      </q-btn>
    </q-card-section>
  </q-card>
</template>
