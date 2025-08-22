const { client } = require('../../infras/redis/client');

class AlbumsCacheService {
  async setAlbum(id, value, expirationInSecond = 1800) {
    const key = `albums:${id}`;
    await client.set(key, value, { EX: expirationInSecond });
  }

  async getAlbum(id) {
    const key = `albums:${id}`;
    const result = await client.get(key);
    return result;
  }

  async deleteAlbum(id) {
    const key = `albums:${id}`;
    await client.del(key);
  }

  async setAlbumLikesCount(id, value, expirationInSecond = 1800) {
    const key = `albums:${id}:likes_count`;
    await client.set(key, value, { EX: expirationInSecond });
  }

  async getAlbumLikesCount(id) {
    const key = `albums:${id}:likes_count`;
    const result = await client.get(key);
    return result;
  }

  async deleteAlbumLikesCount(id) {
    const key = `albums:${id}:likes_count`;
    await client.del(key);
  }

  async setAlbumSongs(id, value, expirationInSecond = 1800) {
    const key = `albums:${id}:songs`;
    await client.set(key, value, { EX: expirationInSecond });
  }

  async getAlbumSongs(id) {
    const key = `albums:${id}:songs`;
    const result = await client.get(key);
    return result;
  }

  async deleteAlbumSongs(id) {
    const key = `albums:${id}:songs`;
    await client.del(key);
  }
}

module.exports = AlbumsCacheService;