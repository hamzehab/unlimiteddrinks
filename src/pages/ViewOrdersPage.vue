<script setup>
import { onMounted, ref } from "vue";
import { api } from "src/boot/axios";
import { useAuth0 } from "@auth0/auth0-vue";
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";

const auth0 = useAuth0();
const orders = ref(null);
const currentPage = ref(1);

const showDetails = ref(false);

const getOrders = async () => {
  try {
    const response = await api.get(
      `/orders/${auth0.user.value.sub.split("|")[1]}`
    );
    orders.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await getOrders();
});
</script>

<template>
  <NavBar />

  <div class="main" v-if="orders">
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
              src="/static/pepsi.jpg"
              :ratio="1"
              style="width: 100px; border-radius: 0.5rem"
            />
            <div class="q-ml-lg">
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
              <div>{{ item.brand }}</div>
            </div>
          </div>
          <div class="row items-center ys nowrap">
            <div class="text-subtitle1">
              <span class="text-bold">$</span>
              {{ item.price.toFixed(2) }}
            </div>
          </div>
          <div class="">
            <div class="">Quantity: {{ item.quantity }}</div>
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
        v-if="orders"
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
  <FooterComponent />
</template>
