const mapAlbumDataToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapSongDataToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

module.exports = {
  mapAlbumDataToModel,
  mapSongDataToModel
};