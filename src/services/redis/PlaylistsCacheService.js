const { client } = require('../../infras/redis/client');

class PlaylistsCacheService {
  async setPlaylistSongActivities(playlistId, values) {
    const key = `playlists:${playlistId}:song_activities`;
    await client.rPush(key, ...values.map((val) => JSON.stringify(val)));
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

module.exports = PlaylistsCacheService;