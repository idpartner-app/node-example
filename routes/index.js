const express = require('express');
const jose = require('node-jose');
const IDPartner = require('@idpartner/node-oidc-client');

const keyStore = jose.JWK.createKeyStore();
keyStore.generate('RSA', 2048, { alg: 'RSA-OAEP', enc: 'A256CBC-HS512', use: 'enc' });
keyStore.generate('RSA', 2048, { alg: 'PS256', use: 'sig' });

const getIdPartnerClient = jwks => new IDPartner({
  jwks,
  client_id: 'qJ2qZRlmXUkBZ4aOQEls-',
  callback: 'https://9d97476bea2e.ngrok.io/auth/callback',
  trust_directory_service_url: 'https://auth-api.idpartner-dev.com/trust-directory',
  oidc_proxy_service_url: 'https://auth-api.idpartner-dev.com/oidc-proxy',
});

const router = express.Router();

router.get('/', async (req, res, next) => {
  const jwks = keyStore.toJSON(true);
  const idPartner = getIdPartnerClient(jwks);
  res.render('index', { title: 'RP Example' });
});

router.get('/jwks', async (req, res, next) => {
  const jwks = keyStore.toJSON(false);
  res.json(jwks);
});

router.get('/auth', async (req, res, next) => {
  const jwks = keyStore.toJSON(true);
  const idPartner = getIdPartnerClient(jwks);
  const scope = ['openid', 'email', 'profile'];
  req.session.idp_proofs = idPartner.generateProofs();
  const authorizationUrl = await idPartner.getAuthorizationUrl(req.query, req.session.idp_proofs, scope);
  return res.redirect(authorizationUrl);
});

router.get('/auth/callback', async (req, res, next) => {
  const jwks = keyStore.toJSON(true);
  const idPartner = getIdPartnerClient(jwks);
  const { idp_response_code, identity_provider } = await idPartner.unpackProxyResponse(req.query);
  const claims = await idPartner.claims(idp_response_code, req.session.idp_proofs);
  return res.send(claims);
});

module.exports = router;
