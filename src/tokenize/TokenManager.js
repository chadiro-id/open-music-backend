const config = require('../config');
const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.tokenize.accessTokenKey),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.tokenize.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.tokenize.refreshTokenKey);

      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      console.error(error);
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;