const { client, pool } = require('../../infras/redis/client');

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

  async setAlbumSongs(id, values) {
    const mainKey = `albums:${id}`;
    const isMainKeyExists = await client.exists(mainKey);
    if (!isMainKeyExists) {
      return;
    }

    const key = `albums:${id}:songs`;
    await pool.execute(async (dedicatedClient) => {
      await dedicatedClient.watch(mainKey);
      return dedicatedClient.multi()
        .sAdd(key, ...values.map((val) => JSON.stringify(val)))
        .expire(key, await dedicatedClient.ttl(mainKey));
    });
  }

  async addAlbumSongs(id, value) {
    const key = `albums:${id}:songs`;
    const exists = await client.exists(key);
    if (!exists) {
      return;
    }

    await pool.execute(async (dedicatedClient) => {
      await dedicatedClient.watch(key);
      return dedicatedClient.sAdd(key, JSON.stringify(value));
    });
  }

  async getAlbumSongs(id) {
    const key = `albums:${id}:songs`;
    const result = await client.sMembers(key);
    return result.map((member) => JSON.parse(member));
  }

  async removeAlbumSongs(id, value) {
    const key = `albums:${id}:songs`;
    await client.sRem(key, JSON.stringify(value));
  }

  async deleteAlbumSongs(id) {
    const key = `albums:${id}:songs`;
    await client.del(key);
  }
}

module.exports = AlbumsCacheService;