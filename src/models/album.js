export class Album {
  constructor(id, name, label, releaseDate, artists, copyrights, images) {
    this.id = id;
    this.name = name;
    this.label = label;
    this.releaseDate = releaseDate;
    this.artists = artists;
    this.copyrights = copyrights;
    this.images = images;
  }
}

export class AlbumAdapter {
  static adapt(data) {
    return new Album(
      data.albums[0].id,
      data.albums[0].name,
      data.albums[0].copyrights,
      data.albums[0].release_date,
      data.albums[0].artists,
      data.albums[0].copyrights,
      data.albums[0].images[0]
    );
  }
}
