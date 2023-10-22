const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
    meta: { title: "Unlimited Drinks" },
  },
  {
    path: "/:drinks/:drinkId",
    component: () => import("pages/DrinksDetails.vue"),
    meta: { title: "Unlimited Drinks" },
  },
  {
    path: "/account",
    component: () => import("pages/AccountSettings.vue"),
    meta: { title: "Account Settings" },
  },
  {
    path: "/cart",
    component: () => import("pages/ViewCartPage.vue"),
    meta: { title: "Shopping Cart" },
  },
  {
    path: "/checkout",
    component: () => import("pages/CheckoutPage.vue"),
    meta: { title: "Checkout" },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
