<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "src/stores/cart-store";

const $router = useRouter();
const cartStore = useCartStore();

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const quantity = ref(1);
const rating = props.product.rating;
const isLoading = ref(false);
const addedToCart = ref(null);

const decreaseQuantity = (event) => {
  event.stopPropagation();
  if (quantity.value > 1) {
    quantity.value = parseInt(quantity.value) - 1;
  }
};

const increaseQuantity = (event) => {
  event.stopPropagation();
  if (quantity.value < 25) {
    quantity.value = parseInt(quantity.value) + 1;
  }
};

const viewFullItem = () => {
  $router.push(`/${props.product.category_name}/${props.product.id}`);
};

const addToCart = (event) => {
  event.stopPropagation();
  isLoading.value = true;

  cartStore.addItem(props.product.id, quantity.value);
  addedToCart.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  setTimeout(() => {
    addedToCart.value = null;
  }, 3000);
};

const formatDate = (date) => {
  const dateObj = new Date(date);
  const formattedDate = `${dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
  return formattedDate;
};
</script>

<template>
  <q-card
    class="q-mx-auto q-my-md cursor-pointer"
    style="max-width: 70%"
    bordered
    @click="viewFullItem()"
  >
    <q-card-section class="q-mx-lg q-my-md" horizontal>
      <img
        class="cursor-pointer"
        :src="`static/${product.image}`"
        style="width: 200px; height: 200px"
      />

      <q-card-section class="q-pb-none" style="width: 100%">
        <div class="ys text-h6">{{ product.name }}</div>
        <div class="text-grey-6 text-caption row oswald">
          <span>{{ formatDate(product.created_at) }}</span>
          <q-separator vertical class="on-right on-left" />
          <span class="on-left">by &nbsp; {{ product.brand }}</span>
        </div>
        <div class="row items-center oswald">
          <div class="q-mr-xs text-overline">{{ rating.toFixed(1) }}</div>
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
          <div class="on-right">
            <div v-if="product.reviews.length > 0">
              {{ product.reviews.length }} reviews
            </div>
            <div v-else class="on-right">No reviews</div>
          </div>
        </div>
        <div class="row justify-between">
          <div class="q-mt-md cursor-pointer" @click="viewFullItem()">
            <span class="ys row items-start text-body1">
              $<span class="oswald text-h5">
                {{ product.price.toFixed(2) }}
              </span>
            </span>
          </div>
          <div class="row justify-end items-center q-pr-sm">
            <q-icon
              class="cursor-pointer on-left"
              name="remove"
              size="20px"
              @click="decreaseQuantity()"
            />
            <q-input
              class="rounded-borders"
              input-class="ys text-bold text-h6 text-center"
              style="width: 2.5rem"
              v-model.trim="quantity"
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
          </div>
        </div>

        <q-card-section
          class="oswald row justify-end items-center q-px-none q-pb-none"
        >
          <div
            class="q-py-none on-left"
            v-if="
              cartStore.items.find((item) => item.product_id === product.id)
            "
          >
            <div
              class="row justify-end"
              v-if="
                cartStore.items.find((item) => item.product_id === product.id)
              "
            >
              <div
                v-if="
                  cartStore.items.find((item) => item.product_id === product.id)
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
                    cartStore.items.find(
                      (item) => item.product_id === product.id
                    ).quantity +
                      quantity >
                    25
                  "
                  class="text-amber-8"
                >
                  Quantity exceeds limit
                </div>
              </transition>
            </div>
          </div>
          <q-btn
            :loading="isLoading"
            color="deep-purple-14"
            rounded
            push
            label="Add to Cart"
            @click="addToCart()"
          >
            <q-icon name="mdi-cart-outline on-right" />
          </q-btn>
        </q-card-section>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
