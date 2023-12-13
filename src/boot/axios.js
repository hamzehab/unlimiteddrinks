import { boot } from "quasar/wrappers";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.API_URL,
  timeout: 1800,
  withCredentials: false,
});

// // Request interceptor
// api.interceptors.request.use((config) => {
//   config.metadata = { startTime: new Date() };
//   const url = new URL(config.url, config.baseURL).href;
//   console.log(`axios ${config.method.toUpperCase()} ${url}`);
//   return config;
// });

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     const endTime = new Date();
//     const duration = endTime - response.config.metadata.startTime;
//     const url = new URL(response.config.url, response.config.baseURL).href;
//     const status = `${response.status} ${response.statusText}`;
//     console.log(
//       `axios ${status} (${response.config.method.toUpperCase()} ${url}) +${duration}ms`
//     );

//     // Handle redirects
//     if (
//       response.status >= 300 &&
//       response.status < 400 &&
//       response.headers.location
//     ) {
//       const redirectUrl = new URL(
//         response.headers.location,
//         response.config.baseURL
//       ).href;
//       console.log(`Redirected to: ${redirectUrl}`);
//     }

//     return response;
//   },
//   (error) => {
//     const endTime = new Date();
//     const duration = endTime - error.config.metadata.startTime;
//     const url = new URL(error.config.url, error.config.baseURL).href;
//     const status = error.response
//       ? `${error.response.status} ${error.response.statusText}`
//       : "Error";
//     console.log(
//       `axios ${status} (${error.config.method.toUpperCase()} ${url}) +${duration}ms`
//     );

//     throw error;
//   }
// );

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
