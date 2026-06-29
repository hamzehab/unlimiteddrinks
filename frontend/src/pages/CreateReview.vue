<script setup>
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";

import { api } from "src/boot/axios";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

const auth0 = useAuth0();
const route = useRoute();
const $router = useRouter();

const isLoading = ref(false);
const created = ref(false);
const alreadyCreated = ref(false);

const title = ref(null);
const comment = ref(null);

const emptyOrInvalid = computed(() => {
  return (
    reviewRating.value === 0 ||
    title.value === null ||
    !title.value ||
    comment.value === null ||
    !comment.value
  );
});

const message = ref(null);
const createReview = async () => {
  isLoading.value = true;
  alreadyCreated.value = false;
  message.value = null;
  try {
    const data = {
      title: title.value,
      rating: reviewRating.value,
      comment: comment.value,
    };
    const response = await api.post(
      `/review/${product.value.id}/${auth0.user.value.sub.split("|")[1]}`,
      data
    );

    if (response.status === 200) {
      created.value = true;
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
      setTimeout(() => {
        $router.push(`/${route.params.category}/${route.params.id}`);
      }, 3000);
    } else if (response.status === 202) {
      alreadyCreated.value = true;
      message.value = response.data.detail;
    }
  } catch (e) {
    console.error(e);
  }
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

const product = ref(null);
const reviewRating = ref(0);
const getProduct = async () => {
  try {
    const response = await api.get(`/product/${route.params.id}`);
    product.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  await getProduct();
});
</script>
<template>
  <div class="main">
    <NavBar />

    <div class="q-mx-auto q-my-lg" style="width: 60%">
      <div class="ys text-h4 q-mb-lg">Create Review</div>
      <div v-if="product">
        <div class="flex items-center">
          <q-img
            class="rounded-borders q-mr-lg"
            :src="`static/products/${product.image}`"
            :alt="product.name + 'Image'"
            style="width: 150px; height: 150px"
            :ratio="1"
          />
          <div class="text-h5 oswald text">
            {{ product.name }}
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-h5 ys q-mb-md">Overall Rating</div>
        <q-rating
          v-model="reviewRating"
          max="5"
          size="xl"
          color="deep-purple-14"
          icon="star_border"
          icon-selected="star"
          icon-half="star_half"
        />

        <q-separator class="q-my-md" />
        <div class="text-h6 ys q-mb-md">Add a headline or title</div>
        <q-input
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="title"
          placeholder="What's most import to know?"
          autogrow
        />

        <q-separator class="q-my-md" />

        <div class="text-h6 ys q-mb-md">Add a written review</div>
        <q-input
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          v-model.trim="comment"
          placeholder="What did you like or dislike? What did you use this product for?"
          type="textarea"
          height="200px"
        />

        <q-separator class="q-my-md" />
        <div class="q-mb-xl" align="right">
          <q-btn
            color="deep-purple-14"
            :disable="emptyOrInvalid"
            push
            @click="createReview()"
          >
            <div v-if="!isLoading">Submit</div>
            <div v-else>
              <q-spinner color="white" size="1em" :thickness="8" />
            </div>
          </q-btn>
          <div v-if="created" class="text-positive text-body1 q-mt-md oswald">
            Created Review! Redirecting back to product page...
          </div>
          <div
            v-if="alreadyCreated && message"
            class="text-negative text-body1 q-mt-md oswald"
          >
            {{ message }}!
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>
