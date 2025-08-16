const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumsService,
    albumCoversService,
    userAlbumLikesService,
    albumsValidator,
    uploadsValidator
  }) => {
    const handler = new AlbumsHandler(
      albumsService,
      albumCoversService,
      userAlbumLikesService,
      albumsValidator,
      uploadsValidator
    );
    server.route(routes(handler));
  }
};