<script setup>
import { onMounted, ref } from "vue";
import { api } from "src/boot/axios";
import { useAuth0 } from "@auth0/auth0-vue";
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";

const auth0 = useAuth0();
const orders = ref(null);
const currentPage = ref(1);

const loading = ref(true);

const showDetails = ref(false);

const getOrders = async () => {
  try {
    const response = await api.get(
      `/orders/${auth0.user.value.sub.split("|")[1]}`
    );

    if (response.data.length > 0) orders.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await getOrders();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <NavBar />
  <div v-if="loading" class="main flex flex-center items-center">
    <q-spinner-tail color="deep-purple-14" size="10rem" :thickness="2" />
  </div>

  <div class="main" v-if="!loading && orders">
    <q-card
      v-for="order in orders.slice((currentPage - 1) * 10, currentPage * 10)"
      :key="order.id"
      class="q-mx-auto q-my-xl"
      style="width: 75%"
      bordered
    >
      <q-card-section class="bg-dark text-white oswald row justify-between">
        <div>
          <div>ORDER PLACED</div>
          {{ order.orderDate }}
        </div>
        <div>
          <div>TOTAL</div>
          <div>$ {{ (order.subtotal / 100).toFixed(2) }}</div>
        </div>
        <div>
          <div>SHIP TO</div>
          <div
            @mouseover="showDetails = true"
            @mouseleave="showDetails = false"
            class="position-relative cursor-pointer"
            style="width: fit-content"
          >
            {{ order.full_name }}
            <q-icon name="expand_more" />
            <q-tooltip
              v-if="showDetails"
              class="bg-white text-dark"
              style="width: 250px; border: 1px solid black"
              :delay="200"
              :offset="[0, 20]"
            >
              <div class="text-body2 text-bold">
                {{ order.full_name }}
              </div>
              <div class="text-body2">
                {{ order.shipAddress.split(", ")[0].toUpperCase() }}
              </div>
              <div class="text-body2">
                {{ order.shipAddress.split(", ")[1] }}
              </div>
              <div class="text-body2">United States</div>
            </q-tooltip>
          </div>
        </div>
        <div>
          <div>Order # {{ order.id }}</div>
        </div>
      </q-card-section>

      <q-card-section
        v-for="item in order.orderItems"
        :key="item.product_id"
        class="q-my-lg q-mx-lg"
        horizontal
      >
        <q-card-section
          class="q-mx-auto row justify-between items-center oswald"
          style="width: 100%"
        >
          <div class="flex items-center">
            <q-img
              :src="`/static/products/${item.image}`"
              :ratio="1"
              style="width: 100px; border-radius: 0.5rem"
            />
            <div class="q-ml-lg">
              <div
                class="cursor-pointer text-deep-purple-14 text-body1"
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
              <div class="text-caption">{{ item.brand }}</div>
            </div>
          </div>
          <div class="row items-center ys nowrap">
            <div class="text-subtitle1">
              <span class="text-bold">$</span>
              {{ item.price.toFixed(2) }}
            </div>
          </div>
          <div class="">
            <div class="">Qty: {{ item.quantity }}</div>
          </div>
          <div class="">
            <div class="text-subtitle1">${{ item.subtotal.toFixed(2) }}</div>
            <div class="text-caption">
              {{ item.quantity }} @ ${{ item.price.toFixed(2) }} each
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <div class="flex flex-center q-my-xl">
      <q-pagination
        v-if="orders && orders.length > 10"
        v-model="currentPage"
        :max="Math.ceil(orders.length / 10)"
        :max-pages="5"
        boundary-numbers
        color="deep-purple-14"
        active-design="push"
        active-color="deep-purple-14"
        direction-links
      />
    </div>
  </div>

  <div
    v-if="!loading && orders === null"
    class="q-mx-auto q-my-auto"
    style="width: 60%; min-height: 42vh"
  >
    <div class="q-mt-xl text-h6 text-grey-6">
      It looks like you haven't placed any orders with us yet! 🛍️ Don't worry,
      your shopping journey is just getting started. Feel free to explore our
      wonderful collection of products and discover something you love. When you
      find that perfect item, simply add it to your cart and proceed to checkout
      to place your first order. Happy shopping! If you have any questions or
      need assistance, our team is here to help.
    </div>
    <div class="flex flex-center q-mt-xl">
      <q-btn
        class="full-width text-subtitle1 text-bold q-py-sm"
        label="Continue Shopping"
        color="deep-purple-14"
        push
        @click="$router.push('/')"
      />
    </div>
  </div>

  <FooterComponent />
</template>
