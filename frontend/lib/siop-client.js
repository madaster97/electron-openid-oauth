const { Issuer } = require('openid-client');
const fs = require('fs');
const path = require('path');
const sk = require('./pass-app/signing');
const ek = require('./pass-app/encryption');
const didPath = path.join(__dirname,'pass-app','did.txt');
const didLong = fs.readFileSync(didPath,{
    encoding: 'ascii'
});

sk.kid = `${didLong}#signing-key-1`;
ek.kid = `${didLong}#encryption-key-1`;

const jwks = {
    key: [ek,sk]
};

const siop = new Issuer({
    "authorization_endpoint": "http://localhost:8080",
    "issuer": "https://self-issued.me",
    "scopes_supported": [
        "openid",
        "did_authn"
    ],
    "response_types_supported": [
        "id_token"
    ],
    "subject_types_supported": [
        "pairwise"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "request_object_signing_alg_values_supported": [
        "RS256"
    ],
    "registration_endpoint": "https://self-issued.me/registration/1.0/"
});

const siopRegistration = {
    "id_token_signed_response_alg": "ES256",
    "id_token_encrypted_response_alg": "ECDH-ES",
    "id_token_encrypted_response_enc": "A256GCM"
};

const client_id = "http://localhost/callback";

const client = new siop.Client({
    client_id,
    request_object_signing_alg: "ECDH-ES",
    response_types: ["id_token"],
    ...siopRegistration
}, jwks);

const verifierDid = didLong;
const scope = "openid did_authn";

async function generateRequest() {
    client.requestObject({
        iss: verifierDid,
        response_type: "id_token",
        scope,
        response_mode: "fragment",
        registration: siopRegistration,
        claims: {
            id_token: {
                "https://healthwallet.cards#covid19": { "essential": true },
            }
        }
    }).then(request => {
        return client.authorizationUrl({
            request,
            scope,
            client_id 
        })
    });
}

module.exports = {
    generateRequest    
};
