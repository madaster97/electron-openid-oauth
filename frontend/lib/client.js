const envVariables = require('../env-variables');
// const envVariables = require('../test');
const { Issuer } = require('openid-client');

const {clientId} = envVariables;

const redirectUri = 'http://localhost/callback';

const issuerMeta = require('./issuer');

const issuer = new Issuer(issuerMeta);

const client = new issuer.Client({
    client_id: clientId,
    redirect_uris: [redirectUri],
    response_types: ["code"],
    token_endpoint_auth_method: "none"
})

module.exports = client;