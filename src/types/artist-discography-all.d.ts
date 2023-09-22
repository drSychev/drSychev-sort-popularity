declare namespace Spicetify {
    type ArtistDiscographyAll = {
        discography: {
            all: {
                items: Release[]
            },
        },
    }
    type Release = {
        releases: {
            items: Album[]
        }
    }
}