const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });
    console.log(`[Albums Handler] post album -> albumId: ${albumId}`);

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      }
    });
    response.code(201);
    console.log(`[Albums Handler] post album -> response: ${response.statusCode}`);

    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    console.log(`[Albums Handler] get albums -> albums: ${albums}`);

    return {
      status: 'success',
      data: {
        albums,
      }
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    console.log(`[Albums Handler] get album by id -> album: ${album}`);

    return {
      status: 'success',
      data: {
        album,
      }
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;