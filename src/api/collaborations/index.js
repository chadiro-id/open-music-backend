const CollaborationsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationsService,
    playlistsService,
    usersService,
    validator
  }) => {
    const handler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      usersService,
      validator
    );

    server.route(routes(handler));
  },
};

module.exports = plugin;