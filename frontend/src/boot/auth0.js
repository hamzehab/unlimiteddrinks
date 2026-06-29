import { createAuth0 } from "@auth0/auth0-vue";

export default ({ app, router }) => {
  app.use(
    createAuth0({
      domain: "dev-5imm05laojlznmbn.us.auth0.com",
      clientId: "P4lEc6GpH7OohooJ96YqYTcoLWRcNUvc",
      authorizationParams: {
        redirect_uri: window.location.origin + "/unlimiteddrinks",
      },
      onRedirectCallback: (appState) => {
        router.replace(appState?.target ?? "/");
      },
    })
  );
};
