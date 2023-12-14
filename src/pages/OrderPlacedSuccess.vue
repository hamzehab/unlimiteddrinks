<script setup>
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";

import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useAuth0 } from "@auth0/auth0-vue";
import { useRouter } from "vue-router";

const auth0 = useAuth0();
const $router = useRouter();

const address = ref(null);
const fullName = ref(null);
const items = ref([]);

onMounted(async () => {
  const response = await api.get(
    `/order/recent/${auth0.user.value.sub.split("|")[1]}`
  );
  if (!response.data) {
    $router.push("/cart");
  } else {
    address.value = response.data.shipAddress;
    fullName.value = response.data.full_name;
    items.value = response.data.orderItems;
    window.sessionStorage.removeItem("cart");
  }
});
</script>

<template>
  <NavBar />
  <div class="main q-mx-auto" style="width: 90%">
    <q-card class="q-mx-xl bg-grey-2" flat>
      <q-card-section class="q-pa-md">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-positive ys">
              <q-icon name="check_circle" size="48px" />
              <span class="text-bold on-right text-h6">
                Thank you, your order has been placed!
              </span>
            </div>
          </q-card-section>
          <q-card-section class="oswald text-weight-medium text-body1">
            Shipping to {{ fullName }} {{ address }}
          </q-card-section>
          <q-separator inset />

          <q-card-section class="q-ml-xl" v-for="item in items" :key="item">
            <q-card-section horizontal>
              <q-img
                :src="`static/products/${item.image}`"
                width="96px"
                height="96px"
                :ratio="1"
                style="border-radius: 0.5rem"
              />
              <q-card-section
                class="oswald text-body1 q-pa-none q-pl-md column justify-center"
              >
                <div
                  class="cursor-pointer text-deep-purple-14"
                  style="width: fit-content"
                  @click="
                    $router.push(
                      `/${item.category.toLowerCase().split(' ').join('-')}/${
                        item.id
                      }`
                    )
                  "
                >
                  {{ item.name }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ item.quantity }} @ {{ item.price.toFixed(2) }} each
                </div>
              </q-card-section>
            </q-card-section>
          </q-card-section>
          <q-card-section class="q-ml-xl">
            <q-btn
              label="View Orders"
              color="deep-purple-14"
              style="width: 100%; max-width: 300px"
              push
              @click="$router.push('/orders')"
            />
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </div>
  <FooterComponent />
</template>
