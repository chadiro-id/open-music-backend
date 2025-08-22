class PlaylistsCacheService {
  async addPlaylistsToUser(userId, values) {
    console.log(userId, values);
  }

  async getPlaylistsByUser(userId) {
    console.log(userId);
  }

  async deletePlaylistsForUser(userId) {
    console.log(userId);
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