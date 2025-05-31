export const API_PATHS = {
  AUTH: {
    CALLBACK: "/auth/callback"
  },

  ALBUMS: {
    GET_ALL_ALBUMS: "/albums",
    GET_ALBUM_BY_ID: (albumId: string) =>  `/albums/${albumId}`
  },

  USERS: {
    GET_ALL_USERS: "/users",
  },

  ADMIN: {
    CHECK_IS_ADMIN: "/admin/check"
  },

  SONGS: {
    GET_FEATURED_SONGS: "/songs/featured",
    GET_MADE_FOR_YOU_SONGS: "/songs/made-for-you",
    GET_TRENDING_SONGS: "/songs/trending",
  }
}