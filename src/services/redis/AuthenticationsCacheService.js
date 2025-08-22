const { client } = require('../../infras/redis/client');

class AuthenticationsCacheService {
  async setRefreshToken(token, expirationInSecond = 1800) {
    const key = `refresh_token:${token}`;
    await client.set(key, 1, { EX: expirationInSecond });
  }

  async deleteRefreshToken(token) {
    const key = `refresh-token:${token}`;
    await client.del(key);
  }

  async verifyRefreshToken(token) {
    const key = `refresh-token:${token}`;
    const result = client.exists(key);
    return result;
  }
}

module.exports = AuthenticationsCacheService;