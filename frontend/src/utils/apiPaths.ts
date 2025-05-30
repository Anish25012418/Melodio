export const API_PATHS = {
  AUTH: {
    CALLBACK: "/auth/callback"
  },

  ALBUMS: {
    GET_ALL_ALBUMS: "/albums",
    GET_ALBUM_BY_ID: (albumId: string) =>  `/albums/${albumId}`
  }
}