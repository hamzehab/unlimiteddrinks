<script setup>
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";
import { useCartStore } from "src/stores/cart-store";
import { ref } from "vue";

const cartStore = useCartStore();
const items = cartStore.items;
const deleteModal = ref(false);

const quantities = ref([]);
const removed = ref([]);
const updated = ref([]);

for (let i = 0; i < items.length; i++) {
  quantities.value.push(items[i].quantity);
  removed.value[i] = false;
  updated.value[i] = false;
}

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

const updateQuantity = (index) => {
  const newQuantity = quantities.value[index];
  if (newQuantity !== items[index].quantity) {
    updated.value[index] = true;
    cartStore.update(index, newQuantity);
    setTimeout(() => {
      updated.value[index] = false;
    }, 1000);
  }
};

const removeItem = (product_id) => {
  cartStore.removeItem(product_id);
  deleteModal.value = false;
};
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
          @click="removeItem(item.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="q-ma-xl main">
    <div class="row justify-between items-center q-mt-xl q-mb-lg">
      <div class="flex items-center">
        <q-icon name="work_outline" size="40px" />
        <div class="ys on-right text-h5">Shopping Cart</div>
      </div>
      <div v-if="cartStore.totalQuantity > 0" class="ys text-h5">
        Payment Summary
      </div>
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
      <q-card class="q-py-lg" bordered style="width: 70%; height: fit-content">
        <div v-for="(item, index) in items" :key="(item.id, index)">
          <q-card-section
            class="q-mx-auto row justify-between items-center oswald"
            style="width: 95%"
          >
            <div class="flex items-center">
              <img
                class="rounded-borders q-mr-lg"
                src="/static/pepsi.jpg"
                alt=""
                style="width: 150px; height: 150px"
              />
              <div class="q-ml-lg">
                <div class="text-h6">{{ item.name }}</div>
                <div class="text-caption">
                  {{
                    item.category[0].toUpperCase() + item.category.substring(1)
                  }}
                </div>
              </div>
            </div>
            <div class="row items-center">
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
                      Succesfully removed from cart
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
                  @click="deleteModal = true"
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
      <div style="width: 25%">
        <q-card class="oswald" bordered>
          <q-card-section class="q-mx-sm">
            <div class="row justify-between">
              <div>
                <div class="text-body1">Subtotal:</div>
                <div class="text-caption">Before Taxes and Fees</div>
              </div>
              <div class="text-subtitle1">
                <span class="text-bold">$</span>
                {{ cartStore.totalCostBeforeTax }}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-mx-sm">
            <div class="row justify-between">
              <div class="text-body1">Taxes and Fees:</div>
              <div class="text-subtitle1">
                <span class="text-bold">$</span>
                {{ cartStore.taxesAndFees }}
              </div>
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="q-mx-sm">
            <div class="row justify-between text-h6">
              <div>Total:</div>
              <div>
                <span class="text-bold">$</span>
                {{
                  (
                    parseFloat(cartStore.totalCostBeforeTax) +
                    parseFloat(cartStore.taxesAndFees)
                  ).toFixed(2)
                }}
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div class="row justify-center q-mt-xl">
          <q-btn
            class="rounded-borders q-mb-md"
            style="width: 400px"
            label="Continue Shopping"
            color="dark"
            push
            @click="$router.push('/')"
          />
          <q-btn
            class="rounded-borders"
            style="width: 400px"
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
      class="text-deep-purple-14 cursor-pointer row items-center q-mt-lg"
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
  </div>

  <FooterComponent />
</template>
