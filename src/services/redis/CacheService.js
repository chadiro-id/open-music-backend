const client = require('../../infras/redis/client');

class CacheService {
  async setRefreshToken(token, expirationInSecond = 1800) {
    const key = `refresh_token:${token}`;
    await client.set(key, 1, {
      EX: expirationInSecond,
    });
  }

  async deleteRefreshToken(token) {
    const key = `refresh_token:${token}`;
    await client.del(key);
  }

  async verifyRefreshToken(token) {
    const key = `refresh_token:${token}`;
    const result = await client.exists(key);
    return result;
  }

  async setAlbumLikesCount(albumId, value, expirationInSecond = 1800) {
    const key = `albums:${albumId}:likes_count`;
    await client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async getAlbumLikesCount(albumId) {
    const key = `albums:${albumId}:likes_count`;
    const result = await client.get(key);
    return result;
  }

  async deleteAlbumLikesCount(albumId) {
    const key = `albums:${albumId}:likes_count`;
    await client.del(key);
  }
}

module.exports = CacheService;