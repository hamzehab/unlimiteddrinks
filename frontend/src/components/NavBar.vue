<script setup>
import { ref } from "vue";

const searchInput = ref("");

function search() {
  console.log("Hello");
}
</script>
<template>
  <div class="bg-dark text-white">
    <div class="row justify-between items-center q-mx-xl">
      <img
        class="cursor-pointer"
        src="static/logo.png"
        alt="Logo"
        width="96"
        height="96"
        @click="$router.push('/')"
      />
      <div class="nav-bar-items row items-center text-center">
        <q-icon size="30px" name="mdi-map-marker-outline"></q-icon>
        <div>
          <div class="text-caption">Deliver to name</div>
          <div class="text-bold text-subtitle1">Ridgewood 07450</div>
        </div>
      </div>

      <div style="width: 45%">
        <q-input
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
              class="cursor-pointer bg-deep-purple-14 q-pa-md rounded-borders text-white"
            />
          </template>
        </q-input>
      </div>
      <div class="row justify-end q-gutter-x-lg items-center">
        <div class="nav-bar-items">Products</div>
        <div class="nav-bar-items row items-center">
          <q-icon size="36px" name="mdi-account-circle-outline" />
          <div class="on-right">
            <div>
              <span class="text-body1 text-bold">Hello, </span>
              <span class="text-body2">name</span>
            </div>
            <div class="text-body2 text-weight-medium">Account</div>
          </div>
        </div>
        <div class="nav-bar-items">
          <q-icon size="36px" name="mdi-cart-outline">
            <q-badge class="text-bold" color="deep-purple-14" floating rounded>
              1
            </q-badge>
          </q-icon>
          <span class="text-caption text-bold vertical-bottom">Cart</span>
        </div>
      </div>
    </div>
  </div>
</template>
