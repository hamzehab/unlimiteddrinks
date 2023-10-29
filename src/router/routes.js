import { api } from "boot/axios";

const checkIfCategoryExists = async (category) => {
  try {
    const response = await api.get(`/category/${category}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
    meta: { title: "Unlimited Drinks" },
  },
  {
    path: "/:category",
    component: () => import("pages/CategoryDrinks.vue"),
    meta: { title: "Unlimited Drinks" },
    beforeEnter: async (to, from, next) => {
      const categoryExists = await checkIfCategoryExists(to.params.category);
      if (categoryExists) {
        next();
      } else {
        next({ name: "NotFound" });
      }
    },
  },
  {
    path: "/:category/:id",
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
    name: "NotFound",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
