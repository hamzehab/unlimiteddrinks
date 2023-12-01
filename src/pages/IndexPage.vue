<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductCard from "src/components/ProductCard.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { api } from "src/boot/axios";

const windowWidth = ref(window.innerWidth);
const slide = ref(1);
const rouletteProducts = ref([]);
const loading = ref(false);

const roulette = async () => {
  loading.value = true;
  try {
    const response = await api.get("/roulette");
    rouletteProducts.value = response.data;
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  } catch (err) {
    console.error(err);
  }
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(async () => {
  roulette();
  window.addEventListener("resize", handleResize);

  const fadeIn = document.querySelectorAll(".fade");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("animated", entry.isIntersecting);
        entry.target.classList.toggle("fadeIn", entry.isIntersecting);
        entry.target.classList.toggle("slower", entry.isIntersecting);
        if (entry.isIntersecting) observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  fadeIn.forEach((entry) => {
    observer.observe(entry);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <NavBar />
  <div class="main">
    <q-carousel
      v-model="slide"
      control-color="dark"
      height="50vh"
      animated
      arrows
      infinite
      autoplay
    >
      <q-carousel-slide :name="1" img-src="static/landing_page/warehouse.jpg" />
      <q-carousel-slide :name="2" img-src="static/landing_page/vending.jpg" />
      <q-carousel-slide
        :name="3"
        img-src="static/landing_page/shelfDrinks.jpg"
      />
      <q-carousel-slide :name="4" img-src="static/landing_page/pepsi.jpg" />
      <q-carousel-slide
        :name="5"
        img-src="static/landing_page/shelfDrinks2.jpg"
      />
    </q-carousel>
    <div
      class="ys fade text-center text-bold text-h4 text-weight-light q-mt-xl"
    >
      Available Products
    </div>
    <div class="q-ma-xl row justify-evenly">
      <img class="fade" src="static/logos/coca-cola.png" alt="Coca Cola Logo" />
      <img class="fade" src="static/logos/sprite.png" alt="Sprite Logo" />
      <img
        class="fade"
        src="static/logos/vitamin-water.png"
        alt="Vitamin Water Logo"
      />
      <img class="fade" src="static/logos/redbull.png" alt="Red Bull Logo" />
      <img class="fade" src="static/logos/lacroix.png" alt="Lacroix Logo" />
      <img class="fade" src="static/logos/celcius.png" alt="Celcius Logo" />
      <img class="fade" src="static/logos/snapple.png" alt="Snapple Logo" />
      <img
        class="fade"
        src="static/logos/pellegrino.png"
        alt="Pellegrino Logo"
      />
    </div>
    <q-separator inset />
    <div
      class="ys q-my-xl row justify-center text-bold text-h4 text-weight-light"
    >
      Try out Drink Roulette!
      <transition
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <q-icon
          v-if="!loading"
          class="on-right cursor-pointer"
          name="replay"
          size="40px"
          @click="roulette()"
        />
      </transition>
    </div>

    <div v-if="!loading" class="q-mx-xl q-mb-xl row justify-evenly">
      <ProductCard
        class="fade"
        v-for="(product, index) in rouletteProducts"
        :key="index"
        :product="product"
      />
    </div>
    <div v-else class="flex flex-center">
      <q-spinner-tail color="deep-purple-14 q-pb-xl" size="20rem" />
    </div>
  </div>

  <FooterComponent />
</template>
