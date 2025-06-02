import {create} from "zustand"
import type {Song} from "@/types/song.ts";
import {useChatStore} from "@/stores/useChatStore.ts";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
}

const updateActivity = (song: Song | null) => {
  const socket = useChatStore.getState().socket;
  if (socket.auth) {
    socket.emit("update_activity", {
      userId: socket.auth.userId,
      activity: song ? `Playing ${song.title} by ${song.artist}` : "Idle",
    })
  }
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    })
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    updateActivity(song);

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true
    })
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return

    updateActivity(song);

    const songIndex = get().queue.findIndex(s => s._id === song._id);

    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    })
  },

  togglePlay: () => {
    const playingStatus = get().isPlaying;

    const currentSong = get().currentSong;

    updateActivity(!playingStatus && currentSong ? currentSong : null);

    set({
      isPlaying: !playingStatus,
    })
  },

  playNext: () => {
    const {currentIndex, queue} = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      updateActivity(nextSong);

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      })
    } else {
      set({
        isPlaying: false,
      })
      updateActivity(null);
    }
  },

  playPrev: () => {
    const {currentIndex, queue} = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      updateActivity(prevSong);

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      })
    } else {
      set({
        isPlaying: false,
      })
      updateActivity(null);
    }
  },
}))