<script setup>
import NavBar from "components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
import ProductCard from "src/components/ProductCard.vue";
import { ref, onMounted, onUnmounted } from "vue";

const windowWidth = ref(window.innerWidth);

const roulette = () => {

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

const slide = ref(1);
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
  <div class="ys text-center text-bold text-h4 text-weight-light q-mt-xl">
    Available Products
  </div>
  <div class="q-ma-xl row justify-evenly">
    <img src="static/logos/coca-cola.png" alt="Coca Cola Logo" />
    <img src="static/logos/monster.png" alt="Monster Logo" />
    <img src="static/logos/sprite.png" alt="Sprite Logo" />
    <img src="static/logos/vitamin-water.png" alt="Vitamin Water Logo" />
    <img src="static/logos/redbull.png" alt="Red Bull Logo" />
    <img src="static/logos/lacroix.png" alt="Lacroix Logo" />
    <img src="static/logos/gatorade.png" alt="Gatorade Logo" />
    <img src="static/logos/celcius.png" alt="Celcius Logo" />
    <img src="static/logos/snapple.png" alt="Snapple Logo" />
    <img src="static/logos/pellegrino.png" alt="Pellegrino Logo" />
  </div>
 <q-separator inset/>
  <div class="ys text-center text-bold text-h4 text-weight-light q-my-xl">
    Try out Drink Roulette!
    <q-icon class="cursor-pointer" name="replay" size="40px" @click="roulette"/>
  </div>
  <ProductCard/>

  <FooterComponent />
</template>
