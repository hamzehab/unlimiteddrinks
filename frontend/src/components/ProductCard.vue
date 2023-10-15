<template>
  <div class="oswald q-mx-xl row justify-evenly">
    <q-card
      v-for="n in 4"
      :key="n"
      class="q-my-lg"
      style="width: 100%; max-width: 400px; height: inherit"
    >
      <img src="static/pepsi.jpg" />

      <q-card-section>
        <div class="text-h6">Product Name</div>

      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>Description</div>
      </q-card-section>
      <q-card-section class="row justify-end items-center">
        <div class="ys `text-subtitle1 q-mr-lg">$0.00</div>
        <q-btn color="deep-purple-14" rounded>
          Add to Cart
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>
