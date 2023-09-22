declare namespace Spicetify {
    type AlbumTracks = {
        tracks: {
            "totalCount": 1,
            "items": Track[]
        }
    }

    type Track = {
        uid: string,
        track: TrackMetadata
    }
}