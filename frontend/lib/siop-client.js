const { Issuer } = require('openid-client');

const siop = new Issuer({
    "authorization_endpoint": "openid:",
    "issuer": "https://self-issued.me",
    "scopes_supported": [
        "openid",
        "profile",
        "email",
        "address",
        "phone"
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
        "none",
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
});

const verifierDid = "example:longform:did";
const scope = "openid did_authn";

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
})
    .then(request => {
        client.authorizationUrl({
            request,
            scope,
            client_id 
        })
    });
