const PlaylistsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistsService, songsService, playlistSongsService, validator }) => {
    const handler = new PlaylistsHandler(playlistsService, songsService, playlistSongsService, validator);
    server.route(routes(handler));
  },
};

module.exports = plugin;