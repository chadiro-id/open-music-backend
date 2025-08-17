const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumsService,
    albumCoversService,
    albumLikesService,
    albumsValidator,
    uploadsValidator
  }) => {
    const handler = new AlbumsHandler(
      albumsService,
      albumCoversService,
      albumLikesService,
      albumsValidator,
      uploadsValidator
    );
    server.route(routes(handler));
  }
};