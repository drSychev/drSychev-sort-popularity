import ArtistDiscographyOverview = Spicetify.ArtistDiscographyOverview;
import ArtistDiscographyAll = Spicetify.ArtistDiscographyAll;
import Album = Spicetify.Album;
import AlbumTracks = Spicetify.AlbumTracks;
import Track = Spicetify.Track;

async function main() {
    let item = new Spicetify.ContextMenu.Item(
        "Играть по рейтенгуwwwwwwww",
        addToQueue,
        isArtist,
        `<svg role="img" height="16" width="16" viewBox="0 0 20 20" fill="currentColor"><path d="M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z"></path></svg>`
    );
    item.register();

}

async function addToQueue(uris) {
    let overview = await getArtistDiscographyOverview(uris);
    let discographyAll = await getArtistDiscographyAll(overview)
    let tracks: Track[] = [];
    let requestAlbumTracks: Promise<AlbumTracks>[] = []
    for (const releases of discographyAll.discography.all.items) {
        for (const album of releases.releases.items) {
            requestAlbumTracks.push(getTracks(album))
        }
    }

   let albumTracks: AlbumTracks[] = await Promise.all(requestAlbumTracks)
    for (const albumTrack of albumTracks) {
        tracks = tracks.concat(albumTrack.tracks.items)
    }
    let sortTracks = sortByPopularity(tracks);
    addToNext(sortTracks)
}

async function getArtistDiscographyAll(overview: ArtistDiscographyOverview): Promise<ArtistDiscographyAll> {
    let response = await Spicetify.GraphQL.Request(Spicetify.GraphQL.Definitions.queryArtistDiscographyAll,
        {
            uri: overview.uri, local: "en", limit: overview.discography.all.totalCount, offset: 0
        })
    return response.data.artistUnion
}

async function getArtistDiscographyOverview(uris): Promise<ArtistDiscographyOverview> {
    let artistInformation = await Spicetify.GraphQL.Request(Spicetify.GraphQL.Definitions.queryArtistDiscographyOverview, {
        locale: "",
        uri: uris[0],
        includePrerelease: true
    })
    return artistInformation.data.artistUnion
}

function isArtist(uris) {
    if (uris.length > 1) {
        return false;
    }
    const uriObj = Spicetify.URI.fromString(uris[0]);
    return uriObj.type === Spicetify.URI.Type.ARTIST
}


async function getTracks(album: Album): Promise<AlbumTracks> {
    let result = await Spicetify.GraphQL.Request(Spicetify.GraphQL.QueryDefinitions.getAlbum, {
        locale: "",
        offset: 0,
        limit: 50,
        uri: album.uri
    })
    return result.data.albumUnion
}

function sortByPopularity(tracks: Track[]) {
    return tracks.sort(function (firstTrack, secondTrack) {
        return secondTrack.track.playcount - firstTrack.track.playcount;
    });
}

async function addToNext(tracks: Track[]) {
    const newTracks = tracks.map(track => ({
        uri: track.track.uri,
    }))
    await Spicetify.Platform.PlayerAPI.clearQueue()
    await Spicetify.Platform.PlayerAPI.addToQueue(newTracks)
        .catch((err) => {
            console.error("Failed to add to queue", err);
            Spicetify.showNotification("Ошибка добавление треков в очередь.");
        })
}

export default main;
