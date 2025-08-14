const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    producerService,
    validator
  }) => {
    const handler = new ExportsHandler(
      playlistsService,
      producerService,
      validator
    );
    server.route(routes(handler));
  },
};