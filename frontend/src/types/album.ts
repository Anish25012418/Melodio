import type {Song} from "@/types/song.ts";

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[]
}

export interface NewAlbum {
  title: string;
  artist: string;
  releaseYear: number;
}