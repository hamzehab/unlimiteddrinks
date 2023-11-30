import { api } from "boot/axios";
import { authGuard } from "@auth0/auth0-vue";

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
    path: "/search",
    component: () => import("pages/SearchProductResults.vue"),
    meta: { title: `Unlimited Drinks Search Result:` },
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
    beforeEnter: authGuard,
  },
  {
    path: "/cart",
    component: () => import("pages/ViewCartPage.vue"),
    meta: { title: "Shopping Cart" },
  },
  {
    path: "/checkout",
    component: () => import("pages/OrderCheckout.vue"),
    meta: { title: "Checkout" },
    beforeEnter: authGuard,
  },
  {
    path: "/success",
    component: () => import("pages/OrderPlacedSuccess.vue"),
    meta: { title: "Thank you for placing an order!" },
    beforeEnter: authGuard,
  },
  {
    path: "/setup",
    component: () => import("pages/SetupAccount.vue"),
    meta: { title: "Setup Account" },
    beforeEnter: authGuard,
  },
  {
    path: "/orders",
    component: () => import("pages/ViewOrdersPage.vue"),
    meta: { title: "Unlimited Drinks: Orders" },
    beforeEnter: authGuard,
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
