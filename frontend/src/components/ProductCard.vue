<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "src/stores/cart-store";

const cartStore = useCartStore();
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
const isLoading = ref(false);
const addedToCart = ref(null);

const category = "TBD";

const viewFullItem = () => {
  $router.push(`/${category}/${props.product_id}`);
};

const addToCart = (event) => {
  event.stopPropagation();
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
</script>

<template>
  <q-card class="q-my-lg oswald q-mx-xl" style="width: 100%; max-width: 350px">
    <img class="cursor-pointer" :src="image" @click="viewFullItem" />

    <q-card-section class="q-pb-none" @click="viewFullItem">
      <span class="text-h6 cursor-pointer" @click="viewFullItem">
        {{ name }}
      </span>
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
    <q-card-section
      class="q-py-none"
      v-if="cartStore.items.find((item) => item.id === product_id)"
    >
      <div
        class="row justify-end"
        v-if="cartStore.items.find((item) => item.id === product_id)"
      >
        <div
          v-if="
            cartStore.items.find((item) => item.id === product_id).quantity +
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
              Product Name successfully added to cart!
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
        <!-- assuming Animate.css is included on the page -->
        <transition
          appear
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
        >
          <div
            v-if="
              cartStore.items.find((item) => item.id === product_id).quantity +
                quantity >
              25
            "
            class="text-amber-8"
          >
            Quantity exceeds limit
          </div>
        </transition>
      </div>
    </q-card-section>
    <q-card-section class="row justify-between items-center">
      <div class="ys text-h6 cursor-pointer" @click="viewFullItem">
        $ {{ parseFloat(price).toFixed(2) }}
      </div>
      <q-btn
        :loading="isLoading"
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
