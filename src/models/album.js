
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
    adapt(item) {
        return new Album(
            item.id,
            item.name,
            item.label,
            item.releaseDate,
            item.artists,
            item.copyrights,
            item.images
        );
    }
}