const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
    meta: { title: "Unlimited Drinks" },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
