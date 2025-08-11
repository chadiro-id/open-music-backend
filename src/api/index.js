const albums = require('./albums');
const authentications = require('./authentications');
const collaborations = require('./collaborations');
const playlists = require('./playlists');
const songs = require('./songs');
const users = require('./users');

const createApiPlugins = ({ services, validator }) => {
  return [
    {
      plugin: albums,
      options: {
        service: services.albumsService,
        validator: validator.albumsValidator,
      },
    },
    {
      plugin: authentications,
      options: {},
    },
    {
      plugin: collaborations,
      options: {},
    },
    {
      plugin: playlists,
      options: {},
    },
    {
      plugin: songs,
      options: {},
    },
    {
      plugin: users,
      options: {},
    }
  ];
};

module.exports = { createApiPlugins };