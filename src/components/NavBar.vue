<script setup>
import AddressModal from "./AddressModal.vue";
import { ref, onMounted, onUnmounted, watchEffect, watch } from "vue";
import { useCartStore } from "src/stores/cart-store";
import { useCustomerStore } from "src/stores/customer-store";

import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

const auth0 = useAuth0();
const $router = useRouter();
const categories = ref([]);

const cartStore = useCartStore();
const cartItemCount = ref(cartStore.totalQuantity);
const selected = ref(0);

const customerStore = useCustomerStore();

const searchInput = ref("");
const searchFailed = ref(false);

const windowWidth = ref(window.innerWidth);
const addressModal = ref(false);
const newAddress = ref(false);

const isLoggedIn = ref(false);

const search = async () => {
  if (searchInput.value.trim().length > 0) {
    const new_query = searchInput.value.trim();
    $router.push({ path: "/search", query: { q: new_query } });
  } else {
    searchFailed.value = true;
    setTimeout(() => {
      searchFailed.value = false;
    }, 1000);
  }
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

const capitalizeCategory = (category) => {
  const updated_category_name = category.toLowerCase().split(" ");
  return updated_category_name
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    categories.value = response.data;
  } catch (err) {
    console.error(error);
  }
};

const login = async () => {
  await auth0.loginWithRedirect();
};

const logout = async () => {
  await auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  sessionStorage.removeItem("cart");
  sessionStorage.removeItem("customer");
};

const userExists = async () => {
  try {
    const response = await api.get(
      `/customer/exists/${auth0.user._rawValue.sub.split("|")[1]}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
const loggedIn = async () => {
  if (auth0.isAuthenticated.value && !auth0.isLoading.value) {
    try {
      const response = await userExists();
      isLoggedIn.value = response;
      if (!response) {
        $router.push("/setup");
      } else {
        try {
          const customerData = await api.get(
            `/customer/${auth0.user._rawValue.sub.split("|")[1]}`
          );
          customerStore.initCustomer(customerData.data);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const addressFormat = (address) => {
  return `${address.street}, ${address.city} ${address.state} ${address.zip_code} ${address.country}`;
};

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  getCategories();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

watchEffect(async () => {
  cartItemCount.value = cartStore.totalQuantity;
  await loggedIn();
});
</script>

<template>
  <div class="oswald bg-dark text-white fixed full-width" style="z-index: 1">
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
        <q-btn
          v-if="auth0.isAuthenticated.value && isLoggedIn && windowWidth >= 465"
          no-caps
          push
          flat
          @click="addressModal = true"
        >
          <div class="row items-center no-wrap">
            <q-icon left name="mdi-map-marker-outline" />
            <div class="text-center">
              <div class="text-caption">
                Deliver to
                {{ customerStore.getMainAddress.first_name }}
              </div>
              <div class="text-bold text-subtitle1">
                {{ customerStore.getMainAddress.city }}
                {{ customerStore.getMainAddress.zip_code }}
              </div>
            </div>
          </div>
          <q-dialog v-model="addressModal">
            <q-card>
              {{ customerStore.getAddresses }}
              <q-card-section class="bg-dark text-white text-bold ys">
                Choose your location
              </q-card-section>
              <q-card-section class="oswald text-bold q-pb-none">
                <q-btn
                  class="full-width"
                  style="border: 2px solid grey; border-radius: 1rem"
                  flat
                  color="grey-6"
                  @click="newAddress = true"
                >
                  <div class="text-center">
                    <q-icon name="add" size="30px" />
                    <div>Add Address</div>
                  </div>
                </q-btn>
              </q-card-section>
              <q-card-section class="oswald text-body2 text-grey-6 q-pb-none">
                Delivery options and delivery speeds may vary for different
                locations
              </q-card-section>
              <q-card-section class="oswald text-bold q-py-none">
                <div
                  class="cursor-pointer q-my-md q-pa-lg"
                  :class="address === selected ? 'selected-address' : 'address'"
                  v-for="(address, index) in [
                    customerStore.getMainAddress,
                    ...customerStore.getAddresses,
                  ]"
                  :key="index"
                  @click="selected = address"
                >
                  <div class="text-body1">
                    <div class="text-bold">
                      {{ address.first_name }} {{ address.last_name }}
                    </div>
                    {{ addressFormat(address) }}
                  </div>
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

      <div v-if="windowWidth > 698" style="width: 100%; max-width: 40%">
        <q-input
          :class="searchFailed ? 'animated shakeX slower' : ''"
          label="Search"
          type="search"
          standout="text-deep-purple-14"
          v-model.trim="searchInput"
          dense
          dark
          rounded
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
        v-if="windowWidth >= 1300"
        class="row justify-end q-gutter-x-lg items-center"
      >
        <q-btn label="Products" padding="md" push flat>
          <q-icon name="keyboard_arrow_down" class="on-right" />
          <q-menu
            class="bg-dark text-white oswald text-body1 text-center"
            style="width: 200px"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 15]"
          >
            <q-list>
              <div v-for="(category, index) in categories" :key="category.id">
                <q-item
                  clickable
                  @click="$router.push(`/${category.name.replace(' ', '-')}`)"
                >
                  <q-item-section>{{
                    capitalizeCategory(category.name)
                  }}</q-item-section>
                </q-item>
                <q-separator v-if="index < categories.length - 1" dark />
              </div>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn v-if="auth0.isAuthenticated.value" no-caps flat>
          <div class="row items-center">
            <q-icon size="30px" name="mdi-account-circle-outline" />
            <div class="on-right">
              <div>
                <span class="text-body1 text-bold">Hello, </span>
                <span class="text-body2">{{ customerStore.getFirstName }}</span>
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
              <q-item clickable @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
              <q-separator dark />
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn v-else flat label="Login" @click="login" />
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
                  class="bg-dark text-white oswald text-center text-body1"
                  anchor="top end"
                  self="top start"
                  :offset="[0, -3]"
                >
                  <q-list>
                    <div
                      v-for="(category, index) in categories"
                      :key="category.id"
                    >
                      <q-item
                        clickable
                        @click="
                          $router.push(`/${category.name.replace(' ', '-')}`)
                        "
                      >
                        <q-item-section>
                          {{ capitalizeCategory(category.name) }}
                        </q-item-section>
                      </q-item>
                      <q-separator v-if="index < categories.length - 1" dark />
                    </div>
                  </q-list>
                </q-menu>
              </q-item>
              <q-item v-if="auth0.isAuthenticated.value" clickable>
                <q-item-section class="q-py-md">
                  <div class="row items-center flex flex-center">
                    <q-icon size="30px" name="mdi-account-circle-outline" />
                    <div class="on-right">
                      <div>
                        <span class="text-body1 text-bold">Hello, </span>
                        <span class="text-body2">
                          {{ customerStore.getFirstName }}
                        </span>
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
                    <q-item clickable @click="logout">
                      <q-item-section>Logout</q-item-section>
                    </q-item>
                    <q-separator dark />
                  </q-list>
                </q-menu>
              </q-item>
              <q-item v-else clickable @click="login">
                <q-item-section class="text-center q-py-md">
                  Login
                </q-item-section>
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

    <div
      class="q-mx-auto"
      v-if="windowWidth < 699"
      style="width: 100%; max-width: 50%"
    >
      <q-btn
        v-if="auth0.isAuthenticated.value && isLoggedIn && windowWidth < 465"
        no-caps
        push
        flat
        @click="addressModal = true"
      >
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
            <q-card-section class="oswald text-bold q-pb-none">
              <q-btn
                class="full-width"
                style="border: 2px solid grey; border-radius: 1rem"
                flat
                color="grey-6"
                @click="newAddress = true"
              >
                <div class="text-center">
                  <q-icon name="add" size="30px" />
                  <div>Add Address</div>
                </div>
              </q-btn>
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
      <q-input
        class="q-mb-lg"
        :class="searchFailed ? 'animated shakeX slower' : ''"
        label="Search"
        type="search"
        standout="text-deep-purple-14"
        v-model.trim="searchInput"
        dense
        dark
        rounded
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
  </div>
  <AddressModal v-model="newAddress" />
  <div style="padding-bottom: 5rem" />
</template>
