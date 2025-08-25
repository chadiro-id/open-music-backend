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

  async setAlbum(albumId, value, expirationInSecond = 1800) {
    const key = `albums:${albumId}`;
    await client.set(key, JSON.stringify(value), { EX: expirationInSecond });
  }

  async getAlbum(albumId) {
    const key = `albums:${albumId}`;
    const result = await client.get(key);
    if (result) {
      return JSON.parse(result);
    }
    return result;
  }

  async deleteAlbum(albumId) {
    const albumKey = `albums:${albumId}`;
    const albumSongsKey = `albums:${albumId}:songs`;
    await client.unlink(albumKey, albumSongsKey);
  }

  async setAlbumLikesCount(albumId, value, expirationInSecond = 1800) {
    const key = `albums:${albumId}:likes_count`;
    await client.set(key, value, { EX: expirationInSecond });
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

  async addAlbumSongs(albumId, values) {
    const mainKey = `albums:${albumId}`;
    const isMainKeyExists = await client.exists(mainKey);
    if (!isMainKeyExists) {
      return;
    }

    const key = `albums:${albumId}:songs`;
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

  async getAlbumSongs(albumId) {
    const key = `albums:${albumId}:songs`;
    const result = await client.sMembers(key);
    return result.map((member) => JSON.parse(member));
  }

  async removeAlbumSongs(albumId, values) {
    const key = `albums:${albumId}:songs`;
    await client.sRem(key, ...values.map((val) => JSON.stringify(val)));
  }

  async setPlaylist(playlistId, value, expirationInSecond = 1800) {
    const key = `playlists:${playlistId}`;
    await client.set(key, JSON.stringify(value), { EX: expirationInSecond });
  }

  async getPlaylist(playlistId) {
    const key = `playlists:${playlistId}`;
    const result = await client.get(key);
    if (result) {
      return JSON.parse(result);
    }
    return result;
  }

  async deletePlaylist(playlistId) {
    const playlistKey = `playlists:${playlistId}`;
    const playlistSongsKey = `${playlistKey}:songs`;
    const playlistSongActivitiesKey = `${playlistKey}:song_activities`;
    await client.unlink(playlistKey, playlistSongsKey, playlistSongActivitiesKey);
  }

  async addPlaylistSongs(playlistId, values) {
    const mainKey = `playlists:${playlistId}`;
    const isMainKeyExists = await client.exists(mainKey);
    if (!isMainKeyExists) {
      return;
    }

    const key = `${mainKey}:songs`;
    await pool.execute(async (_client) => {
      await _client.watch(mainKey);
      const mainKeyTTL = await _client.ttl(mainKey);

      const multi =  _client.multi()
        .sAdd(key, ...values.map((val) => JSON.stringify(val)));

      values.forEach((val) => {
        multi.sAdd(`songs:${val.id}:playlists`, key);
        multi.expire(`songs:${val.id}:playlists`, mainKeyTTL);
      });

      const ttl = await _client.ttl(key);
      if (ttl < 0) {
        multi.expire(key, mainKeyTTL);
      }

      return multi.exec();
    });
  }

  async getPlaylistSongs(playlistId) {
    const key = `playlists:${playlistId}:songs`;
    const result = await client.sMembers(key);
    return result.map((member) => JSON.parse(member));
  }

  async removePlaylistSongs(playlistId, values) {
    const key = `playlists:${playlistId}:songs`;
    await client.sRem(key, ...values.map((val) => JSON.stringify(val)));
  }

  async invalidatePlaylistsBySong(songId) {
    const keys = await client.sMembers(`songs:${songId}:playlists`);
    if (keys.length) {
      await client.unlink(...keys);
    }
  }

  async addPlaylistSongActivities(playlistId, values) {
    const mainKey = `playlists:${playlistId}`;
    const isMainKeyExists = await client.exists(mainKey);
    if (!isMainKeyExists) {
      return;
    }

    const key = `playlists:${playlistId}:song_activities`;
    await pool.execute(async (_client) => {
      _client.watch(mainKey);

      const multi = _client.multi()
        .rPush(key, ...values.map((val) => JSON.stringify(val)));

      const ttl = await _client.ttl(key);
      if (ttl < 0) {
        multi.expire(key, await _client.ttl(mainKey));
      }

      return multi.exec();
    });
  }

  async getPlaylistSongActivities(playlistId, start = 0, stop = -1) {
    const key = `playlists:${playlistId}:song_activities`;
    const result = await client.lRange(key, start, stop);
    return result.map((element) => JSON.parse(element));
  }
}

module.exports = CacheService;