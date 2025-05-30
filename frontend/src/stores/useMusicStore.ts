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

  fetchAlbums: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,

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
  }
}))