<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductCard from "src/components/ProductCard.vue";

import { ref, onMounted, getCurrentInstance, computed, watch } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { api } from "src/boot/axios";
import { useCartStore } from "src/stores/cart-store";
import { useAuth0 } from "@auth0/auth0-vue";

const auth0 = useAuth0();
const route = useRoute();
const $router = useRouter();
const cartStore = useCartStore();
const { ctx } = getCurrentInstance();

const recProducts = ref([]);
const averageRating = ref(0);
const quantity = ref(1);

const currentPage = ref(1);

const isLoading = ref(false);
const addedToCart = ref(null);
const exceedsLimit = ref(null);
const exceedQuantity = ref(null);

const id = route.params.id;
const product = ref(null);
const ratings = ref([null, null, null, null, null]);
const reviews = ref(null);

const getProductDetails = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);

    product.value = response.data;
    averageRating.value = response.data.rating;
    reviews.value = response.data.reviews;
  } catch (err) {
    console.error(err);
  }
};

const getRatingPercentage = async (id) => {
  try {
    const response = await api.get(`/review/rating/${id}`);
    Object.keys(response.data).forEach((rating) => {
      ratings.value[rating - 1] = response.data[rating];
    });
  } catch (e) {
    console.error(e);
  }
};

const addToCart = async () => {
  isLoading.value = true;

  const totalQuantity =
    quantity.value +
    (cartStore.items.find((item) => item.product_id === product.value.id)
      ? cartStore.items.find((item) => item.product_id === product.value.id)
          .quantity
      : 0);

  try {
    const response = await api.get(
      `product/cart/${product.value.id}?quantity=${totalQuantity}`
    );
    if (response.data["can_add"] === true) {
      cartStore.addItem(product.value.id, quantity.value);
      addedToCart.value = true;
      exceedsLimit.value = false;
    } else {
      exceedsLimit.value = true;
      exceedQuantity.value = response.data.quantity;
    }
  } catch (e) {
    console.error(e);
  }

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  setTimeout(() => {
    addedToCart.value = null;
  }, 3000);
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value = parseInt(quantity.value) - 1;
  }
};

const increaseQuantity = () => {
  if (quantity.value < 25) {
    quantity.value = parseInt(quantity.value) + 1;
  }
};

const getRecommended = async () => {
  try {
    const response = await api.get("/product/random/roulette");
    recProducts.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

const convertDate = (date) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(date))
    .split(",");

  return `${formattedDate[0]}, ${formattedDate[1]} @ ${formattedDate[2]}`;
};

const scrollToElement = () => {
  const reviewsElement = ctx.$refs.reviews;

  if (reviewsElement) {
    const offset = 100;
    const scrollPosition = reviewsElement.offsetTop - offset;
    window.scrollTo({ top: scrollPosition, behavior: "smooth", passive: true });
  }
};

const selectedRating = ref(null);
const filteredReviews = computed(() => {
  if (selectedRating.value === null) {
    return product.value.reviews;
  }

  const filter = product.value.reviews.filter(
    (review) => review.rating === selectedRating.value
  );

  if (filter.length === 0) {
    return product.value.reviews;
  }

  return filter;
});

const handleSelectedRating = (newRating) => {
  if (newRating === null) {
    selectedRating.value = null;
  } else {
    const filter = product.value.reviews.filter(
      (review) => review.rating === newRating
    );

    if (filter.length === 0) {
      selectedRating.value = null;
    } else {
      selectedRating.value = newRating;
    }
  }
};

const reviewLeft = ref(false);
const handleReview = async () => {
  if (auth0.isAuthenticated.value && !auth0.isLoading.value) {
    try {
      const response = await api.get(
        `/review/${route.params.id}/${auth0.user.value.sub.split("|")[1]}`
      );
      if (!response.data) {
        $router.push(`/${route.params.category}/${route.params.id}/review`);
      } else {
        reviewLeft.value = true;
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    await auth0.loginWithRedirect();
  }
};

watch(selectedRating, (newRating) => {
  handleSelectedRating(newRating);
});

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    pageLoad.value = true;
    await getProductDetails(to.params.id);
    await getRatingPercentage(to.params.id);
    pageLoad.value = false;
    reviewLeft.value = false;
    ratings.value = [null, null, null, null, null];
  }
});

const pageLoad = ref(false);
onMounted(async () => {
  pageLoad.value = true;
  await getRecommended();
  await getProductDetails(id);
  await getRatingPercentage(id);
  pageLoad.value = false;
});
</script>

<template>
  <NavBar />
  <div v-if="pageLoad" class="main flex flex-center">
    <q-spinner-tail color="deep-purple-14 q-pb-xl" size="20rem" />
  </div>
  <div v-else>
    <div class="q-mx-xl">
      <div
        class="fade q-ma-xl cursor-pointer row items-center text-deep-purple-14"
      >
        <q-icon name="keyboard_arrow_left" size="30px" />
        <div class="text-h6 underline ys" @click="$router.back()">Back</div>
      </div>

      <div v-if="product" class="row justify-evenly" style="width: 100%">
        <img
          :src="`/static/products/${product.image}`"
          style="width: 100%; max-width: 800px; height: 100%"
          alt=""
        />

        <div
          v-if="product"
          class="fade oswald q-mt-xl"
          style="width: 100%; max-width: 800px"
        >
          <div class="text-caption fade">
            {{
              product.category_name[0].toUpperCase() +
              product.category_name.substring(1)
            }}
          </div>
          <div class="text-h4 ys fade">
            {{ product.name }}
            <span class="text-caption">by {{ product.brand }}</span>
          </div>
          <div
            class="cursor-pointer row items-center oswald q-py-md"
            @click="scrollToElement"
          >
            <div class="q-mr-xs">{{ averageRating.toFixed(1) }}</div>
            <q-rating
              v-model="averageRating"
              max="5"
              size="sm"
              color="deep-purple-14"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              readonly
            />
            <div class="on-right text-caption">
              {{ product.reviews.length }} rating{{
                product.reviews.length === 1 ? "" : "s"
              }}
            </div>
          </div>
          <div
            v-if="product.reviews.length === 0"
            class="text-deep-purple-14 cursor-pointer"
            @click="handleReview()"
          >
            Be the first to review!
          </div>

          <q-separator class="q-my-md" />
          <div class="text-h3 ys q-mb-xl">$ {{ product.price.toFixed(2) }}</div>
          <div class="text-body1 q-mb-xl">{{ product.description }}</div>

          <div class="row justify-end items-center q-mr-md q-mb-md no-wrap">
            <q-icon
              class="cursor-pointer on-left"
              name="remove"
              size="20px"
              @click="decreaseQuantity()"
            />
            <q-input
              class="rounded-borders"
              input-class="ys text-bold text-h6 text-center"
              style="width: 5rem"
              v-model="quantity"
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

            <q-btn
              class="q-ml-xl oswald"
              style="width: 80%"
              :color="product.quantity === 0 ? 'negative' : 'deep-purple-14'"
              rounded
              push
              :disable="product.quantity === 0"
              @click="addToCart()"
            >
              <div v-if="product.quantity === 0">OUT OF STOCK</div>
              <div v-else-if="product.quantity !== 0 && !isLoading">
                ADD TO CART
                <q-icon
                  v-if="product.quantity !== 0"
                  name="mdi-cart-outline on-right"
                />
              </div>
              <div v-else-if="isLoading">
                <q-spinner color="white" size="1em" :thickness="8" />
              </div>
            </q-btn>
          </div>

          <div class="row justify-end items-center q-mr-md text-body1">
            <transition
              appear
              enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut"
            >
              <div v-if="exceedsLimit" class="text-warning animated zoomIn">
                Cannot add to cart. Only {{ exceedQuantity }} left in stock!
              </div>
            </transition>
            <div v-if="cartStore.items.find((item) => item.product_id === id)">
              <div
                v-if="
                  cartStore.items.find((item) => item.product_id === id)
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
                    cartStore.items.find((item) => item.product_id === id)
                      .quantity +
                      quantity >
                      25 && addedToCart === null
                  "
                  class="text-amber-8"
                >
                  Quantity exceeds limit
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-separator class="q-my-xl" inset />
    <div class="row justify-around">
      <div class="q-ma-xl" ref="reviews">
        <div class="ys text-h5">Customer Reviews</div>
        <div class="row items-center q-py-md">
          <q-rating
            v-model="averageRating"
            max="5"
            size="md"
            color="deep-purple-14"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            readonly
          />
          <div class="on-right text-h6">
            {{ averageRating.toFixed(1) }} out of 5
          </div>
        </div>
        <div v-if="product" class="q-ml-sm q-mb-md">
          {{ product.reviews.length }} customer
          {{ product.reviews.length === 1 ? " rating" : "ratings" }}
        </div>

        <div v-for="n in 5" :key="n" class="q-ml-sm">
          <div
            class="row items-center progress-bar"
            @click="selectedRating = n"
          >
            <div class="on-left text-body2 cursor-pointer text-bold">
              {{ n }} star
            </div>
            <q-linear-progress
              size="20px"
              style="width: 200px"
              :value="
                ratings[n - 1]
                  ? parseFloat((ratings[n - 1]['percentage'] / 100).toFixed(2))
                  : 0
              "
              color="deep-purple-14"
              class="q-my-sm cursor-pointer"
            />
            <div class="on-right text-body2 cursor-pointer text-bold">
              {{ ratings[n - 1] ? ratings[n - 1]["percentage"].toFixed(1) : 0 }}
              %
            </div>
          </div>
        </div>
        <div
          class="text-center progress-bar cursor-pointer oswald text-body1"
          @click="selectedRating = null"
        >
          All Reviews
        </div>

        <q-btn
          class="q-mt-md full-width"
          :label="!reviewLeft ? 'Leave a review' : 'Already left review'"
          color="deep-purple-14"
          push
          rounded
          :disable="reviewLeft"
          @click="handleReview()"
        >
          <q-icon v-if="!reviewLeft" class="on-right" name="chat" />
        </q-btn>
      </div>

      <div
        v-if="product && filteredReviews.length > 0"
        style="width: 100%; max-width: 70%"
      >
        <q-card class="q-px-md q-py-md">
          <q-card-section class="ys text-h6">
            {{
              selectedRating
                ? selectedRating.toFixed(1) + " Star Rated Reviews"
                : "All customer reviews"
            }}
          </q-card-section>
          <q-card
            v-for="review in filteredReviews.slice(
              (currentPage - 1) * 5,
              currentPage * 5
            )"
            :key="review"
            bordered
          >
            <q-card-section class="ys text-bold q-pb-none">
              {{ review.title }}
            </q-card-section>
            <q-card-section class="q-pt-none oswald">
              <q-rating
                v-model="review.rating"
                max="5"
                size="xs"
                color="deep-purple-14"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                readonly
              />
              <span class="text-overline on-right">
                {{ review.rating.toFixed(1) }}
              </span>
            </q-card-section>
            <q-card-section class="oswald">{{ review.comment }}</q-card-section>
            <q-card-section class="text-grey oswald">
              {{ convertDate(review.created_at) }}
            </q-card-section>
          </q-card>
        </q-card>
        <div class="flex flex-center q-my-xl">
          <q-pagination
            v-if="filteredReviews.length > 5"
            v-model="currentPage"
            :max="Math.ceil(filteredReviews.length / 5)"
            :max-pages="5"
            boundary-numbers
            color="deep-purple-14"
            active-design="push"
            active-color="deep-purple-14"
            direction-links
          />
        </div>
      </div>
    </div>
    <q-separator class="q-my-xl" inset />
    <div
      class="ys fade text-center text-bold text-h4 text-weight-light q-ma-xl"
    >
      Recommended Beverages
    </div>
    <div class="q-mx-xl q-mb-xl row justify-evenly">
      <ProductCard
        class="fade"
        v-for="(product, index) in recProducts"
        :key="index"
        :product="product"
      />
    </div>
  </div>

  <FooterComponent />
</template>
