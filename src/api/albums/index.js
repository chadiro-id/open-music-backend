const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumsService,
    albumCoversService,
    albumLikesService,
    songsService,
    albumsValidator,
    uploadsValidator
  }) => {
    const handler = new AlbumsHandler(
      albumsService,
      albumCoversService,
      albumLikesService,
      songsService,
      albumsValidator,
      uploadsValidator
    );
    server.route(routes(handler));
  }
};