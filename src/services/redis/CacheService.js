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
    const key = `albums:${albumId}:songs`;
    const pool = this._client.createPool();
    try {
      await pool.execute(async (client) => {
        await client.watch(`albums:${albumId}`);

        const multi = client.multi();

        const members = values.map((val) => {
          JSON.stringify(val);
          console.dir(val);
        });
        console.log('Members length:', members.length);

        multi.sAdd(key, ...values.map((value) => JSON.stringify(value)));
        const ttl = await client.ttl(key);
        const albumTTL = await client.ttl(`albums:${albumId}`);
        console.log('[Cache Service] songs ttl:', ttl);
        console.log('[Cache Service] album ttl:', albumTTL);
        if (ttl < 0) {
          multi.expire(key, albumTTL);
        }

        await multi.exec();
      });
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

  async addUserPlaylists(userId, values) {
    const key = `playlists:${userId}`;

    const multi = this._client.multi().rPush(key, ...values.map((val) => JSON.stringify(val)));

    const ttl = await this._client.TTL(key);
    if (ttl < 0) {
      multi.expire(key, 1800);
    }

    const result = await multi.exec();
    console.log(...result);
  }

  async getUserPlaylists(userId, start = 0, stop = -1) {
    const key = `playlists:${userId}`;
    const result = await this._client.lRange(key, start, stop);
    console.log(result);
    return result.map((element) => JSON.parse(element));
  }

  async removeUserPlaylist(userId, element, count = 0) {
    const key = `playlists:${userId}`;
    const result = await this._client.lRem(key, count, element);
    console.log(result);
  }

  async addPlaylistSongActivities(playlistId, values) {
    const key = `playlists:${playlistId}:song-activities`;
    const multi = this._client.multi().rPush(key, ...values.map((val) => JSON.stringify(val)));
    const ttl = await this._client.ttl(key);
    if (ttl < 0) {
      multi.expire(key, 1800);
    }
    const result = await multi.exec();
    console.log(result);
  }

  async getPlaylistSongActivities(playlistId, start = 0, stop = -1) {
    const key = `playlists:${playlistId}`;
    const result = await this._client.lRange(key, start, stop);
    console.log(result);
    return result.map((element) => JSON.parse(element));
  }

  async removePlaylistSongActivity(playlistId, element, count = 0) {
    const key = `playlists:${playlistId}`;
    const result = await this._client.lRem(key, count, element);
    console.log(result);
  }
}

module.exports = CacheService;