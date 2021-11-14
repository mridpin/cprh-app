import mongoose from 'mongoose';
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

// we dont want to save all the Album properties yet
const albumQuerySchema = mongoose.Schema(
  {
    spotifyId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    copyright: {
      type: String,
      required: true,
    }
  },
  {
    strict: 'throw',
    timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' },
  }
);

// compile schema to a model
const AlbumQueryModel = mongoose.model('Album Query', albumQuerySchema);

// Add index
AlbumQueryModel.schema.index({
  name: 1,
});

export default AlbumQueryModel;
