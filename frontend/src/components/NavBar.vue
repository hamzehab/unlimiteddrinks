<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const searchInput = ref("");
const windowWidth = ref(window.innerWidth);

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
</script>
<template>
  <div class="oswald bg-dark text-white fixed full-width" style="z-index: 9999">
    <div class="row justify-between items-center q-mx-xl">
      <div class="row q-gutter-x-lg">
        <img
          class="cursor-pointer"
          src="static/logo.png"
          alt="Logo"
          width="80"
          height="80"
          @click="$router.push('/')"
        />
        <div class="row items-center text-center">
          <q-icon size="24px" name="mdi-map-marker-outline" />
          <div>
            <div class="text-caption">Deliver to name</div>
            <div class="text-bold text-subtitle1">Ridgewood 07450</div>
          </div>
        </div>
      </div>

      <div style="width: 55%">
        <q-input
          class="search-form"
          dense
          dark
          standout
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
        <div>Products</div>
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
        <div class="">
          <q-icon size="30px" name="mdi-cart-outline">
            <q-badge class="text-bold" color="deep-purple-14" floating rounded>
              1
            </q-badge>
          </q-icon>
          <span class="text-caption text-bold vertical-bottom">Cart</span>
        </div>
      </div>
      <div v-else>
        <q-icon name="menu" size="30px" class="cursor-pointer" />
        <q-menu
          style="width: 200px"
          class="bg-dark text-white oswald text-body1"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[48, 23]"
        >
          <q-list dense>
            <q-item clickable>
              <q-item-section side>
                <q-icon name="keyboard_arrow_left" />
              </q-item-section>
              <q-item-section class="q-py-md"> Products </q-item-section>
              <q-menu
                fit
                class="bg-dark text-white oswald"
                anchor="top end"
                self="top start"
              >
                <q-list>
                  <q-item v-for="n in 5" :key="n" dense clickable>
                    <q-item-section class="q-py-md">
                      Submenu Label
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item clickable>
              <q-item-section class="q-py-md">
                <div class="row justify-betweem items-center flex flex-center">
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
                class="bg-dark text-white"
                anchor="top end"
                self="top start"
              >
                <q-list class="text-center">
                  <q-item clickable>
                    <q-item-section> Orders </q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section> Account Settings </q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section> Logout </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section class="q-py-md">
                <div class="text-center">
                  <q-icon size="30px" name="mdi-cart-outline">
                    <q-badge
                      class="text-bold"
                      color="deep-purple-14"
                      floating
                      rounded
                    >
                      1
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
      </div>
    </div>
  </div>
</template>
