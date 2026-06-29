import { createAuth0 } from "@auth0/auth0-vue";

export default ({ app }) => {
  app.use(
    createAuth0({
      domain: "dev-f7hoszot0iiwwsko.us.auth0.com",
      clientId: "f3xx5JCIUbCKrsQLXZtOfgmKW4RoFlVR",
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })
  );
};
