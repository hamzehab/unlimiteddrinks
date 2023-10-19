const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
    meta: { title: "Unlimited Drinks" },
  },
  {
    path: "/:drinks/:drinkId",
    component: () => import("pages/DrinksDetails.vue"),
    meta: { title: "Drink Name" },
  },
  {
    path: "/cart",
    component: () => import("pages/ViewCartPage.vue"),
    meta: { title: "View Cart" },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
