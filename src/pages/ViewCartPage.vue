<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";

import { api } from "src/boot/axios";
import { useAuth0 } from "@auth0/auth0-vue";
import { useCartStore } from "src/stores/cart-store";

const auth0 = useAuth0();
const cartStore = useCartStore();

const items = ref([]);
const deleteModal = ref(false);
const deleteID = ref(null);

const subtotal = ref(0);
const taxesAndFees = ref(0);

const quantities = ref([]);
const removed = ref([]);
const updated = ref([]);
const itemMessages = ref([]);

const decreaseQuantity = (index) => {
  if (quantities.value[index] > 1) {
    quantities.value[index] = parseInt(quantities.value[index]) - 1;
  } else {
    deleteModal.value = true;
  }
};

const increaseQuantity = (index) => {
  if (quantities.value[index] < 25) {
    quantities.value[index] = parseInt(quantities.value[index]) + 1;
  }
};

const updateQuantity = async (index) => {
  const newQuantity = quantities.value[index];
  if (newQuantity !== items.value[index].quantity) {
    try {
      const response = await api.get(
        `product/cart/${items.value[index].id}?quantity=${newQuantity}`
      );
      if (response.data["can_add"] === true) {
        itemMessages.value[index] = null;
        cartStore.update(index, newQuantity);
        updated.value[index] = true;
        subtotal.value = items.value.reduce((total, item, i) => {
          const quantity = i === index ? newQuantity : quantities.value[i];
          return total + item.price * quantity;
        }, 0);

        setTimeout(() => {
          updated.value[index] = false;
        }, 1000);
      } else {
        itemMessages.value[
          index
        ] = `Only ${response.data.quantity} left in stock`;
        quantities.value[index] = response.data.quantity;
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const removeItem = (product_id) => {
  cartStore.removeItem(product_id);
  deleteModal.value = false;
  fetchProductsInCart();
};

const fetchProductsInCart = async () => {
  items.value = [];
  quantities.value = [];
  subtotal.value = 0;
  taxesAndFees.value = 0;

  for (const product of cartStore.items) {
    try {
      const response = await api.get(`/product/${product.product_id}`);
      items.value.push(response.data);
      quantities.value.push(product.quantity);
      itemMessages.value.push(null);
      subtotal.value += response.data.price * product.quantity;
    } catch (error) {
      console.error(error);
    }
  }
  taxesAndFees.value = subtotal.value * 0.06625;
};

const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  await fetchProductsInCart();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <NavBar />
  <q-dialog v-model="deleteModal">
    <q-card class="q-pa-md q-px-sm">
      <q-card-section class="q-pb-lg">
        <div class="ys text-h6">Are you sure you want remove this item?</div>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn label="Cancel" color="deep-purple-14" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="negative"
          @click="removeItem(deleteID)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="q-ma-xl main">
    <div class="row justify-between items-center q-mt-xl q-mb-lg"></div>
    <div
      class="flex items-center"
      :class="windowWidth > 1305 ? '' : 'q-mx-xl q-mb-xl'"
    >
      <q-icon name="work_outline" size="40px" />
      <div class="ys on-right text-h5">Shopping Cart</div>
    </div>
    <div
      v-if="cartStore.totalQuantity === 0"
      class="q-py-xl q-my-xl text-center text-h6 text-grey-6"
    >
      <div class="q-py-xl">Your Shopping Cart is Empty</div>
      <q-btn
        class="text-subtitle1 text-bold q-py-sm"
        label="Continue Shopping"
        color="deep-purple-14"
        style="width: 100%; max-width: 300px"
        push
        @click="$router.push('/')"
      />
    </div>

    <div v-else class="row justify-between">
      <q-card
        class="q-py-lg"
        :class="windowWidth > 1305 ? '' : 'q-mx-xl q-mb-xl'"
        bordered
        style="height: fit-content"
        :style="
          windowWidth > 1305 ? 'width: 100%; max-width: 70%;' : 'width:100%;'
        "
      >
        <div v-for="(item, index) in items" :key="(item.id, index)">
          <q-card-section
            class="q-mx-auto row justify-between items-center oswald"
            style="width: 95%"
          >
            <div class="flex items-center">
              <img
                class="rounded-borders q-mr-lg"
                :src="`/static/products/${item.image}`"
                :alt="item.name + 'Image'"
                style="width: 150px; height: 150px"
              />
              <div class="q-ml-lg">
                <div
                  class="text-h6 cursor-pointer text-deep-purple-14"
                  @click="
                    $router.push(
                      `/${item.category_name.split(' ').join('-')}/${item.id}`
                    )
                  "
                  style="width: 160px"
                >
                  <div class="ellipsis">
                    {{ item.name }}
                    <q-tooltip
                      class="bg-white text-dark"
                      style="width: fit-content; border: 1px solid black"
                      :delay="200"
                      :offset="[0, 20]"
                    >
                      {{ item.name }}
                    </q-tooltip>
                  </div>
                </div>
                <div class="text-caption">
                  {{
                    item.category_name
                      .split(" ")
                      .map((word) => word[0].toUpperCase() + word.substring(1))
                      .join(" ")
                  }}
                </div>
              </div>
            </div>
            <div class="row items-center ys nowrap">
              <div class="text-subtitle1">
                <span class="text-bold">$</span>
                {{ item.price.toFixed(2) }}
              </div>
              <div class="q-mx-xl">
                <div class="row items-center">
                  <q-icon
                    class="cursor-pointer on-left"
                    name="remove"
                    size="20px"
                    @click="decreaseQuantity(index)"
                  />
                  <q-input
                    class="rounded-borders"
                    input-class="ys text-bold text-subtitle1 text-center"
                    style="width: 2.5rem"
                    v-model="quantities[index]"
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
                    @click="increaseQuantity(index)"
                  />
                </div>

                <div class="text-center">
                  <transition
                    appear
                    enter-active-class="animated zoomIn"
                    leave-active-class="animated zoomOut"
                  >
                    <div v-if="updated[index]" class="text-positive">
                      Quantity updated
                    </div>
                  </transition>
                  <transition
                    appear
                    enter-active-class="animated zoomIn"
                    leave-active-class="animated zoomOut"
                  >
                    <div v-if="removed[index]" class="text-positive">
                      Successfully removed from cart
                    </div>
                  </transition>
                  <transition
                    appear
                    enter-active-class="animated zoomIn"
                    leave-active-class="animated zoomOut"
                  >
                    <div v-if="itemMessages[index]" class="text-warning">
                      {{ itemMessages[index] }}
                    </div>
                  </transition>
                </div>
              </div>
              <div
                class="underline text-center cursor-pointer text-deep-purple-14"
                @click="updateQuantity(index)"
              >
                Update
              </div>
              <div class="q-ml-xl">
                <q-btn
                  icon="delete_outline"
                  color="negative"
                  @click="(deleteModal = true), (deleteID = item.id)"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator
            v-if="index !== items.length - 1"
            class="q-mx-auto"
            style="width: 90%"
            inset
          />
        </div>
      </q-card>
      <div
        :class="windowWidth > 1305 ? '' : 'q-mx-xl'"
        :style="
          windowWidth > 1305 ? 'width: 100%; max-width: 25%;' : 'width:100%;'
        "
      >
        <div v-if="cartStore.totalQuantity > 0" class="ys text-h5">
          Payment Summary
        </div>

        <q-card class="oswald" bordered>
          <q-card-section class="q-mx-sm">
            <div class="row justify-between">
              <div>
                <div class="text-body1">Subtotal:</div>
                <div class="text-caption">Before Taxes and Fees</div>
              </div>
              <div class="text-subtitle1">
                <span class="text-bold">$</span>
                {{ subtotal.toFixed(2) }}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-mx-sm">
            <div class="row justify-between">
              <div class="text-body1">Taxes and Fees:</div>
              <div class="text-subtitle1">
                <span class="text-bold">$</span>
                {{ taxesAndFees.toFixed(2) }}
              </div>
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="q-mx-sm">
            <div class="row justify-between text-h6">
              <div>Total:</div>
              <div>
                <span class="text-bold">$</span>
                {{ (subtotal * 1.06625).toFixed(2) }}
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-btn
          class="q-mt-xl rounded-borders q-mb-md full-width"
          label="Continue Shopping"
          color="dark"
          push
          @click="$router.push('/')"
        />
        <q-btn
          class="rounded-borders full-width"
          label="Proceed to Checkout"
          icon="lock_outline"
          color="deep-purple-14"
          push
          @click="$router.push('/checkout')"
        />
      </div>
    </div>
  </div>
  <div
    v-if="cartStore.totalQuantity !== 0"
    class="text-deep-purple-14 cursor-pointer row items-center q-my-lg q-mx-xl"
    style="width: fit-content"
  >
    <q-icon name="arrow_back" size="20px" />
    <div
      class="on-right underline oswald text-body1 q-pa-md"
      @click="$router.push('/')"
    >
      Return to Previous Page
    </div>
  </div>

  <FooterComponent />
</template>
