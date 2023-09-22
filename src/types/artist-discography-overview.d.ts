declare namespace Spicetify {
    type ArtistDiscographyOverview = {
        id: string;
        uri: string;
        profile: {
            name:string
        }
        discography: {
            albums: {
                totalCount: number
            },
            singles: {
                totalCount: number
            },
            compilations: {
                totalCount: number
            },
            all: {
                totalCount: number
            }
        }
    }
}