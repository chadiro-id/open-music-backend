const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, songsService, playlistSongsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id } = request.params;
    const { songId } = request.payload;

    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._songsService.verifySongById(songId);
    await this._playlistSongsService.addPlaylistSong({ playlistId: id, songId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });

    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(id);
    const songs = await this._playlistSongsService.getPlaylistSongs(id);
    playlist.songs = songs;

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongBySongIdHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.deletePlaylistSong({ playlistId: id, songId });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;