import {create} from "zustand";
import {axiosInstance} from "@/lib/axios.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import type {Song} from "@/types/song.ts";
import type {Album} from "@/types/album.ts";
import type {Stats} from "@/types/stats.ts";
import toast from "react-hot-toast";

type MusicStore = {
  songs: Song[],
  albums: Album[],
  isLoading: boolean,
  error: string | null,
  currentAlbum: Album | null,
  featuredSongs: Song[],
  madeForYouSongs: Song[],
  trendingSongs: Song[]

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  stats: Stats
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  fetchSongs: async () => {
    set({
      isLoading: true,
      error: null,
    })
    try {
      const response = await axiosInstance.get(API_PATHS.SONGS.GET_ALL_SONGS)
      set({songs: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchStats: async () => {
    set({
      isLoading: true,
      error: null,
    })
    try {
      const response = await axiosInstance.get(API_PATHS.STATS.GET_ALL_STATS)
      set({stats: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchAlbums: async () => {
    set({
      isLoading: true,
      error: null,
    })
    try {
      const response = await axiosInstance.get(API_PATHS.ALBUMS.GET_ALL_ALBUMS)
      set({albums: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchAlbumById: async (id: string) => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.ALBUMS.GET_ALBUM_BY_ID(id))
      set({currentAlbum: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchFeaturedSongs: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.SONGS.GET_FEATURED_SONGS)
      set({featuredSongs: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchMadeForYouSongs: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.SONGS.GET_MADE_FOR_YOU_SONGS)
      set({madeForYouSongs: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchTrendingSongs: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.SONGS.GET_TRENDING_SONGS)
      set({trendingSongs: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  deleteSong: async (id: string) => {
    set({isLoading: true, error: null})
    try {
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_SONG(id))
      set(state => ({
        songs: state.songs.filter(song => song._id !== id)
      }))
      await get().fetchStats();
      toast.success('Song deleted Successfully.')
    } catch (error: any) {
      toast.error("Error deleting song" + error.message)
    } finally {
      set({isLoading: false})
    }
  },

  deleteAlbum: async (id: string) => {
    set({isLoading: true, error: null})
    try {
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_ALBUM(id))
      set(state => ({
        albums: state.albums.filter(album => album._id !== id),
        songs: state.songs.filter(song => song.albumId !== id)
      }))
      await get().fetchStats();
      toast.success('Album deleted Successfully.')
    } catch (error: any) {
      toast.error("Error deleting album" + error.message)
    } finally {
      set({isLoading: false})
    }
  }
}))