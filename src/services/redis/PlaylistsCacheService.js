const { client } = require('../../infras/redis/client');

class PlaylistsCacheService {
  async addPlaylistsToUser(userId, values) {
    const key = `playlists:${userId}`;

    const multi = client.multi().rPush(key, ...values.map((val) => JSON.stringify(val)));

    const ttl = await client.TTL(key);
    if (ttl < 0) {
      multi.expire(key, 1800);
    }

    const result = await multi.exec();
    console.log(...result);
  }

  async getPlaylistsByUser(userId, start = 0, stop = -1) {
    const key = `playlists:${userId}`;
    const result = await client.lRange(key, start, stop);
    console.log(result);
    return result.map((element) => JSON.parse(element));
  }

  async deletePlaylistsForUser(userId) {
    const key = `playlists:${userId}`;
    const result = await this._client.del(key);
    console.log(result);
  }

  async setPlaylist(playlistId, value) {
    console.log(playlistId, value);
  }

  async getPlaylist(playlistId) {
    console.log(playlistId);
  }

  async deletePlaylist(playlistId) {
    console.log(playlistId);
  }

  async setPlaylistSongActivities(playlistId, values) {
    console.log(playlistId, values);
  }

  async getPlaylistSongActivities(playlistId) {
    console.log(playlistId);
  }

  async deletePlaylistSongActivities(playlistId) {
    console.log(playlistId);
  }
}

module.exports = PlaylistsCacheService;