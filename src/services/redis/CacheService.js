const client = require('../../infras/redis/client');

class CacheService {
  async setAlbumLikesCount(albumId, value, expirationInSecond = 1800) {
    const key = `album:${albumId}:likes_count`;
    await client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async getAlbumLikesCount(albumId) {
    const key = `album:${albumId}:likes_count`;
    const result = await client.get(key);
    return result;
  }

  async deleteAlbumLikesCount(albumId) {
    const key = `album:${albumId}:likes_count`;
    await client.del(key);
  }
}

module.exports = CacheService;