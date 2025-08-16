class UserAlbumLikesService {
  async addLikeToAlbum({ userId, albumId }) {
    console.log(userId, albumId);
  }

  async getLikesFromAlbum(albumId) {
    console.log(albumId);
  }

  async deleteLikeFromAlbum({ userId, albumId }) {
    console.log(userId, albumId);
  }
}

module.exports = UserAlbumLikesService;