<script setup>
import NavBar from "components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductCard from "src/components/ProductCard.vue";
import { ref, onMounted, onUnmounted } from "vue";

const windowWidth = ref(window.innerWidth);
const slide = ref(1);

const roulette = () => {};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);

  const fadeIn = document.querySelectorAll(".fade");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("animated", entry.isIntersecting);
      entry.target.classList.toggle("fadeIn", entry.isIntersecting);
      entry.target.classList.toggle("slower", entry.isIntersecting);
    });
  });

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

  <q-carousel
    v-model="slide"
    control-color="dark"
    height="50vh"
    animated
    arrows
    infinite
    autoplay
  >
    <q-carousel-slide :name="1" img-src="static/warehouse.jpg" />
    <q-carousel-slide :name="2" img-src="static/vending.jpg" />
    <q-carousel-slide :name="3" img-src="static/shelfDrinks.jpg" />
    <q-carousel-slide :name="4" img-src="static/pepsi.jpg" />
    <q-carousel-slide :name="5" img-src="static/shelfDrinks2.jpg" />
  </q-carousel>
  <div class="ys fade text-center text-bold text-h4 text-weight-light q-mt-xl">
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
    <img class="fade" src="static/logos/monster.png" alt="Monster Logo" />
    <img class="fade" src="static/logos/redbull.png" alt="Red Bull Logo" />
    <img class="fade" src="static/logos/lacroix.png" alt="Lacroix Logo" />
    <img class="fade" src="static/logos/gatorade.png" alt="Gatorade Logo" />
    <img class="fade" src="static/logos/celcius.png" alt="Celcius Logo" />
    <img class="fade" src="static/logos/snapple.png" alt="Snapple Logo" />
    <img class="fade" src="static/logos/pellegrino.png" alt="Pellegrino Logo" />
  </div>
  <q-separator inset />
  <div class="ys q-my-xl row justify-center text-bold text-h4 text-weight-light">
    Try out Drink Roulette!
    <q-icon
      class="on-right cursor-pointer"
      name="replay"
      size="40px"
      @click="roulette"
    />
  </div>
  <div class="q-mx-xl q-mb-xl row justify-evenly">
    <ProductCard
      v-for="n in 4"
      :key="n"
      :product_id="n"
      :name="'Product Name'"
      :description="'Description'"
      :image="'static/pepsi.jpg'"
      :price="0"
    />
  </div>

  <FooterComponent />
</template>
