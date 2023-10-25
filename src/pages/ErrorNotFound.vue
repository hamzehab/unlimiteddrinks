<script setup>
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/FooterComponent.vue";
</script>

<template>
  <NavBar />
  <div class="main">
    <div class="q-mt-xl row items-center justify-center">
      <div class="on-left">
        <div class="ys text-h3 q-mt-xl">Something's wrong here...</div>
        <div class="oswald text-h6 text-grey-8">
          <div>Oops, it seems we can't find the page you're looking for</div>
          <div>Head back to home</div>
        </div>
        <div class="q-mt-lg text-center">
          <q-btn
            class="full-width"
            label="Home"
            color="deep-purple-14"
            push
            @click="$router.push('/')"
          />
        </div>
      </div>
      <img
        class="q-mt-lg on-right"
        src="/static/ghost.png"
        alt="Error Not Found 404"
      />
    </div>
  </div>
  <FooterComponent />
</template>
