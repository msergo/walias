module.exports = {
    clientUrl: process.env.CLIENT_URL,
    oidc: {
        gatewayUri: process.env.OIDC_GATEWAY_URI,
        clientId: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        redirectUris: process.env.OIDC_REDIRECT_URIS
    },
    wildDuck: {
        url: process.env.WILDDUCK_URL,
        token: process.env.WILDDUCK_TOKEN,
        domain: process.env.WILDDUCK_DOMAIN
    }
};