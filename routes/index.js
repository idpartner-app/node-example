const express = require('express');
const jose = require('node-jose');
const IDPartner = require('@idpartner/node-oidc-client');

let idPartnerClient = {};

!async function () {
  // This will generate a keypair however for production you will want to keep the private key secret
  const keyStore = jose.JWK.createKeyStore();
  await keyStore.generate('RSA', 2048, { alg: 'RSA-OAEP', enc: 'A256CBC-HS512', use: 'enc' });
  await keyStore.generate('RSA', 2048, { alg: 'PS256', use: 'sig' });
  
  idPartnerClient = new IDPartner({
    jwks: keyStore.toJSON(true),
    client_id: 'CHANGE_ME_CLIENT_ID',
    callback: 'https://myapplication.ngrok.io/auth/callback',
});
}();

const router = express.Router();

router.get('/', async (req, res, next) => {
  res.render('index', { title: 'RP Example' });
});

router.get('/jwks', async (req, res, next) => {
  const jwks = await idPartnerClient.getPublicJWKs();
  res.send(jwks);
});

router.get('/auth', async (req, res, next) => {
  const scope = ['openid', 'email', 'profile'];
  req.session.idp_proofs = idPartnerClient.generateProofs();
  const authorizationUrl = await idPartnerClient.getAuthorizationUrl(req.query, req.session.idp_proofs, scope);
  return res.redirect(authorizationUrl);
});

router.get('/auth/callback', async (req, res, next) => {
  const { idp_response_code, identity_provider } = await idPartnerClient.unpackProxyResponse(req.query);
  
  const claims = await idPartnerClient.claims(idp_response_code, req.session.idp_proofs);
  return res.send(claims);

});

module.exports = router;
