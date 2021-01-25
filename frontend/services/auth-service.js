const client = require('../lib/client');

let accessToken = null;
let profile = null;

function getAccessToken() {
  return accessToken;
}

function getProfile() {
  return profile;
}

function getAuthenticationURL() {
  return client.authorizationUrl({
    scope: 'openid fhirUser'    
  });
}

async function loadTokens(callbackURL) {
  const cbParams = client.callbackParams(callbackURL);
  try {
    const tokenSet = await client.callback(client.metadata.redirect_uris[0], cbParams)

    accessToken = tokenSet.access_token;
    profile = tokenSet.claims();

  } catch (error) {

    throw error;
  }
}

function logout() {
  accessToken = null;
  profile = null;
  refreshToken = null;
}

module.exports = {
  getAccessToken,
  getAuthenticationURL,
  getProfile,
  loadTokens,
  logout
};
