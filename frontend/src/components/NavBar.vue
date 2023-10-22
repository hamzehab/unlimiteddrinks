<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useCartStore } from "src/stores/cart-store";

const cartStore = useCartStore();
const cartItemCount = ref(cartStore.totalQuantity);
const selected = ref(0);

const searchInput = ref("");
const windowWidth = ref(window.innerWidth);
const addressModal = ref(false);

const search = () => {
  console.log("Hello");
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

watchEffect(() => {
  cartItemCount.value = cartStore.totalQuantity;
});
</script>

<template>
  <div class="oswald bg-dark text-white fixed full-width" style="z-index: 9999">
    <div class="row justify-between items-center q-mx-xl">
      <div class="row items-center q-gutter-x-lg">
        <q-btn flat class="q-pa-none">
          <img
            class="cursor-pointer row"
            src="/static/logo.png"
            alt="Logo"
            width="80"
            height="80"
            @click="$router.push('/')"
          />
        </q-btn>
        <q-btn no-caps push flat @click="addressModal = true">
          <div class="row items-center no-wrap">
            <q-icon left name="mdi-map-marker-outline" />
            <div class="text-center">
              <div class="text-caption">Deliver to Name</div>
              <div class="text-bold text-subtitle1">Ridgewood 07450</div>
            </div>
          </div>
          <q-dialog v-model="addressModal">
            <q-card>
              <q-card-section class="bg-dark text-white text-bold ys">
                Choose your location
              </q-card-section>
              <q-card-section class="oswald text-body2 text-grey-6 q-pb-none">
                Delivery options and delivery speeds may vary for different
                locations
              </q-card-section>
              <q-card-section class="oswald text-bold q-py-none">
                <div
                  class="cursor-pointer q-my-md q-pa-lg"
                  :class="n === selected ? 'selected-address' : 'address'"
                  v-for="n in 3"
                  :key="n"
                  @click="selected = n"
                >
                  <div>Address {{ n }}</div>
                </div>
              </q-card-section>
              <q-separator inset />
              <q-card-actions class="oswald" align="right">
                <q-btn label="Close" color="dark" v-close-popup />
                <q-btn label="Done" color="deep-purple-14" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-btn>
      </div>

      <div style="width: 55%">
        <q-input
          type="search"
          dense
          dark
          rounded
          standout="text-deep-purple-14"
          v-model="searchInput"
          label="Search"
          @keydown.enter.prevent="search"
        >
          <template v-slot:append>
            <q-icon
              name="search"
              @click="search"
              class="search-btn bg-deep-purple-14 q-pa-sm text-white"
            />
          </template>
        </q-input>
      </div>
      <div
        v-if="windowWidth >= 1310"
        class="row justify-end q-gutter-x-lg items-center"
      >
        <q-btn label="Products" padding="md" push flat>
          <q-icon name="keyboard_arrow_down" class="on-right" />
          <q-menu
            fit
            class="bg-dark text-white oswald text-body1"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 15]"
          >
            <q-list>
              <div v-for="n in 4" :key="n">
                <q-item clickable @click="$router.push(`/${category}`)">
                  <q-item-section>Category {{ n }}</q-item-section>
                </q-item>
                <q-separator dark />
              </div>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn no-caps flat>
          <div class="row items-center">
            <q-icon size="30px" name="mdi-account-circle-outline" />
            <div class="on-right">
              <div>
                <span class="text-body1 text-bold">Hello, </span>
                <span class="text-body2">name</span>
              </div>
              <div class="text-body2 text-weight-medium">Account</div>
            </div>
          </div>
          <q-menu
            fit
            class="bg-dark text-white oswald text-body1"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 15]"
          >
            <q-list>
              <q-item clickable>
                <q-item-section>Orders</q-item-section>
              </q-item>
              <q-item clickable @click="$router.push('/account')">
                <q-item-section>Account Settings</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Logout</q-item-section>
              </q-item>
              <q-separator dark />
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn padding="md" no-caps flat @click="$router.push('/cart')">
          <div>
            <q-icon size="30px" name="mdi-cart-outline">
              <q-badge
                class="text-bold"
                color="deep-purple-14"
                floating
                rounded
              >
                {{ cartItemCount }}
              </q-badge>
            </q-icon>
            <span class="text-caption text-bold vertical-bottom">Cart</span>
          </div>
        </q-btn>
      </div>

      <div v-else>
        <q-btn flat>
          <q-icon name="menu" size="30px" class="cursor-pointer" />
          <q-menu
            style="width: 200px"
            class="bg-dark text-white oswald text-body1"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[48, 20]"
          >
            <q-list dense>
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_left" />
                </q-item-section>
                <q-item-section class="q-py-md q-ml-lg">
                  Products
                </q-item-section>
                <q-menu
                  fit
                  class="bg-dark text-white oswald text-center"
                  anchor="top end"
                  self="top start"
                  :offset="[0, -3]"
                >
                  <q-list>
                    <div v-for="n in 4" :key="n">
                      <q-item clickable @click="$router.push(`/${category}`)">
                        <q-item-section>Category {{ n }}</q-item-section>
                      </q-item>
                      <q-separator dark />
                    </div>
                  </q-list>
                </q-menu>
              </q-item>
              <q-item clickable>
                <q-item-section class="q-py-md">
                  <div
                    class="row justify-betweem items-center flex flex-center"
                  >
                    <q-icon size="30px" name="mdi-account-circle-outline" />
                    <div class="on-right">
                      <div>
                        <span class="text-body1 text-bold">Hello, </span>
                        <span class="text-body2">name</span>
                      </div>
                      <div class="text-body2 text-weight-medium">Account</div>
                    </div>
                  </div>
                </q-item-section>
                <q-menu
                  fit
                  class="bg-dark text-white text-center oswald text-body1"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                  anchor="top end"
                  self="top start"
                >
                  <q-list>
                    <q-item clickable>
                      <q-item-section>Orders</q-item-section>
                    </q-item>
                    <q-item clickable @click="$router.push('/account')">
                      <q-item-section>Account Settings</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Logout</q-item-section>
                    </q-item>
                    <q-separator dark />
                  </q-list>
                </q-menu>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/cart')">
                <q-item-section class="q-py-md">
                  <div class="text-center">
                    <q-icon size="30px" name="mdi-cart-outline">
                      <q-badge
                        class="text-bold"
                        color="deep-purple-14"
                        floating
                        rounded
                      >
                        {{ cartItemCount }}
                      </q-badge>
                    </q-icon>
                    <span class="text-caption text-bold vertical-bottom">
                      Cart
                    </span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </div>
  <div style="padding-bottom: 5rem" />
</template>
