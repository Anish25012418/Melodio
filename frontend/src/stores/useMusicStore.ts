import {create} from "zustand";
import {axiosInstance} from "@/lib/axios.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import type {Song} from "@/types/song.ts";
import type {Album} from "@/types/album.ts";

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
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],

  fetchAlbums: async () => {
    set({
      isLoading: true,
      error: null,
    })
    try{
      const response = await axiosInstance.get(API_PATHS.ALBUMS.GET_ALL_ALBUMS)
      set({albums: response.data})
    }catch (error: any) {
      set({error: error.response.data.message})
    }finally {
      set({isLoading: false})
    }
  },

  fetchAlbumById: async (id: string) => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.ALBUMS.GET_ALBUM_BY_ID(id))
      set({currentAlbum: response.data})
    }catch (error: any) {
      set({error: error.response.data.message})
    }finally {
      set({isLoading: false})
    }
  },

  fetchFeaturedSongs: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.SONGS.GET_FEATURED_SONGS)
      set({featuredSongs: response.data})
    }catch (error: any) {
      set({error: error.response.data.message})
    }finally {
      set({isLoading: false})
    }
  },

  fetchMadeForYouSongs: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.SONGS.GET_MADE_FOR_YOU_SONGS)
      set({madeForYouSongs: response.data})
    }catch (error: any) {
      set({error: error.response.data.message})
    }finally {
      set({isLoading: false})
    }
  },

  fetchTrendingSongs: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.SONGS.GET_TRENDING_SONGS)
      set({trendingSongs: response.data})
    }catch (error: any) {
      set({error: error.response.data.message})
    }finally {
      set({isLoading: false})
    }
  }
}))