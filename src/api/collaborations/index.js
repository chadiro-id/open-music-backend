const CollaborationsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { services, validator }) => {
    const handler = new CollaborationsHandler(services, validator);

    server.route(routes(handler));
  },
};

module.exports = plugin;