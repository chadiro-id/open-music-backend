const { client, pool } = require('../../infras/redis/client');

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

  async setAlbum(id, value, expirationInSecond = 1800) {
    const key = `albums:${id}`;
    await client.set(key, JSON.stringify(value), { EX: expirationInSecond });
  }

  async getAlbum(id) {
    const key = `albums:${id}`;
    const result = await client.get(key);
    if (result) {
      return JSON.parse(result);
    }
    return result;
  }

  async deleteAlbum(id) {
    const albumKey = `albums:${id}`;
    const albumSongsKey = `albums:${id}:songs`;
    await client.unlink(albumKey, albumSongsKey);
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

  async addAlbumSongs(id, values) {
    const mainKey = `albums:${id}`;
    const isMainKeyExists = await client.exists(mainKey);
    if (!isMainKeyExists) {
      return;
    }

    const key = `albums:${id}:songs`;
    await pool.execute(async (_client) => {
      await _client.watch(mainKey);

      const multi =  _client.multi()
        .sAdd(key, ...values.map((val) => JSON.stringify(val)));

      const ttl = await _client.ttl(key);
      if (ttl < 0) {
        multi.expire(key, await _client.ttl(mainKey));
      }

      return multi.exec();
    });
  }

  async getAlbumSongs(id) {
    const key = `albums:${id}:songs`;
    const result = await client.sMembers(key);
    return result.map((member) => JSON.parse(member));
  }

  async removeAlbumSongs(id, values) {
    const key = `albums:${id}:songs`;
    await client.sRem(key, ...values.map((val) => JSON.stringify(val)));
  }

  async addPlaylistSongActivities(playlistId, values) {
    const key = `playlists:${playlistId}:song_activities`;
    await pool.execute(async (_client) => {
      _client.watch(key);

      const multi = _client.multi()
        .rPush(key, ...values.map((val) => JSON.stringify(val)));

      const ttl = await _client.ttl(key);
      if (ttl < 0) {
        multi.expire(key, 1800);
      }

      return multi.exec();
    });
  }

  async getPlaylistSongActivities(playlistId, start = 0, stop = -1) {
    const key = `playlists:${playlistId}:song_activities`;
    const result = await client.lRange(key, start, stop);
    return result.map((element) => JSON.parse(element));
  }

  async deletePlaylistSongActivities(playlistId) {
    const key = `playlists:${playlistId}:song_activities`;
    await client.del(key);
  }
}

module.exports = CacheService;