const config = require('../../config');
const { createClient, WatchError } = require('redis');

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: config.redis.host,
      },
    }).on('error', (err) => {
      console.error('Redis client error', err);
    });

    this._client.connect();

    this._pool = this._client.createPool();
  }

  async setRefreshToken(token, expireInSecond = 1800) {
    const key = `refresh-token:${token}`;
    await this._client.set(key, 1, {
      EX: expireInSecond,
    });
  }

  async deleteRefreshToken(token) {
    const key = `refresh-token:${token}`;
    await this._client.del(key);
  }

  async verifyRefreshToken(token) {
    const key = `refresh-token:${token}`;
    const result = await this._client.exists(key);
    return result;
  }

  async setAlbum(albumId, value, expireInSecond = 1800) {
    const key = `albums:${albumId}`;
    await this._client.multi()
      .set(key, JSON.stringify(value), { EX: expireInSecond })
      .del(`albums:${albumId}:songs`)
      .exec();
  }

  async getAlbum(albumId) {
    const key = `albums:${albumId}`;
    const result = await this._client.get(key);
    return JSON.parse(result);
  }

  async deleteAlbum(albumId) {
    const key = `albums:${albumId}`;

    const result = await this._client.multi()
      .del(key)
      .del(`albums:${albumId}:songs`)
      .exec();

    console.log('[Cache Service] delete album -> result:', ...result);
  }

  async addAlbumSongs(albumId, values) {
    const albumKey = `albums:${albumId}`;
    const key = `${albumKey}:songs`;
    try {
      await this._pool.execute(async (client) => {
        await client.watch(albumKey);

        const multi = client.multi()
          .sAdd(key, ...values.map((value) => JSON.stringify(value)));

        const ttl = await client.ttl(key);
        const albumTTL = await client.ttl(albumKey);
        console.log('[Cache Service] songs ttl:', ttl);
        console.log('[Cache Service] album ttl:', albumTTL);

        if (ttl < 0) {
          multi.expire(key, albumTTL);
        }

        return multi.exec();
      });
      const updatedTTL = await this._client.ttl(key);
      console.log('[Cache Service] songs ttl:', updatedTTL);
    } catch (err) {
      if (err instanceof WatchError) {
        console.log('[Cache Service] add album songs -> watch error:', err);
      }
      console.log('[Cache Service] add album songs -> error:', err);
    }
  }

  async getAlbumSongs(albumId) {
    const key = `albums:${albumId}:songs`;
    const result = await this._client.sMembers(key);
    return result.map((member) => JSON.parse(member));
  }

  async removeAlbumSongs(albumId, values) {
    const key = `albums:${albumId}:songs`;
    const result = await this._client.sRem(key, ...values.map((value) => JSON.stringify(value)));
    console.log('[Cache Service] remove album songs -> result:', result);
  }

  async deleteAlbumSongs(albumId) {
    const key = `albums:${albumId}:songs`;
    await this._client.del(key);
  }

  async setAlbumLikesCount(albumId, value, expireInSecond = 1800) {
    const key = `albums:${albumId}:likes-count`;
    await this._client.set(key, value, {
      EX: expireInSecond,
    });
  }

  async getAlbumLikesCount(albumId) {
    const key = `albums:${albumId}:likes-count`;
    const result = await this._client.get(key);
    return result;
  }

  async deleteAlbumLikesCount(albumId) {
    const key = `albums:${albumId}:likes-count`;
    await this._client.del(key);
  }

  async addPlaylistsToUser(credentialId, values) {
    const key = `playlists:${credentialId}`;

    const multi = this._client.multi().rPush(key, ...values.map((val) => JSON.stringify(val)));

    const ttl = await this._client.TTL(key);
    if (ttl < 0) {
      multi.expire(key, 1800);
    }

    const result = await multi.exec();
    console.log(...result);
  }

  async getPlaylistsByUser(credentialId, start = 0, stop = -1) {
    const key = `playlists:${credentialId}`;
    const result = await this._client.lRange(key, start, stop);
    console.log(result);
    return result.map((element) => JSON.parse(element));
  }

  async deletePlaylistsByUser(credentialId) {
    const key = `playlists:${credentialId}`;
    const result = await this._client.del(key);
    console.log(result);
  }

  async setPlaylist(playlistId, value, expirationInSecond = 1800) {
    const key = `playlists:${playlistId}`;
    await this._client.set(key, JSON.stringify(value), { EX: expirationInSecond });
  }

  async getPlaylist(playlistId) {
    const key = `playlists:${playlistId}`;
    const result = await this._client.get(key);

    if (result) {
      return JSON.parse(result);
    }

    return null;
  }

  async deletePlaylist(playlistId) {
    const key = `playlists:${playlistId}`;
    await this._client.del(key);
  }

  async setPlaylistSongActivities(playlistId, value) {
    const key = `playlists:${playlistId}:song-activities`;
    await this._client.set(key, JSON.stringify(value), { EX: 1800 });
  }

  async getPlaylistSongActivities(playlistId) {
    const key = `playlists:${playlistId}:song-activities`;
    const result = await this._client.get(key);
    return JSON.parse(result);
  }

  async deletePlaylistSongActivities(playlistId) {
    const key = `playlists:${playlistId}:song-activities`;
    await this._client.del(key);
  }
}

module.exports = CacheService;