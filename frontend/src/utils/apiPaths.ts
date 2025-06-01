export const API_PATHS = {
  AUTH: {
    CALLBACK: "/auth/callback"
  },

  ALBUMS: {
    GET_ALL_ALBUMS: "/albums",
    GET_ALBUM_BY_ID: (albumId: string) =>  `/albums/${albumId}`,
  },

  USERS: {
    GET_ALL_USERS: "/users",
    GET_MESSAGES: (userId: string) =>  `/users/messages/${userId}`,
  },

  ADMIN: {
    CHECK_IS_ADMIN: "/admin/check",
    CREATE_SONG: "/admin/songs",
    CREATE_ALBUM: "/admin/albums",
    DELETE_ALBUM: (albumId: string) =>  `admin/albums/${albumId}`,
    DELETE_SONG: (songId: string) =>  `admin/songs/${songId}`
  },

  SONGS: {
    GET_ALL_SONGS: "/songs",
    GET_FEATURED_SONGS: "/songs/featured",
    GET_MADE_FOR_YOU_SONGS: "/songs/made-for-you",
    GET_TRENDING_SONGS: "/songs/trending",
  },

  STATS: {
    GET_ALL_STATS: "/stats",
  }
}