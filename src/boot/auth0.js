import { createAuth0 } from "@auth0/auth0-vue";

export default ({ app }) => {
  app.use(
    createAuth0({
      domain: "dev-qp4jx4njpfk4xc45.us.auth0.com",
      clientId: "4BH6oYdvFf4uqZ0s3iEkdDJGZeiCOzFM",
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })
  );
};
