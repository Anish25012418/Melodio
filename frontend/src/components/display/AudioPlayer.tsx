import {useEffect, useRef} from "react";
import {usePlayerStore} from "@/stores/usePlayerStore.ts";

const AudioPlayer = () => {

  const audioRef = useRef<HTMLAudioElement>(null)
  const prevSongRef = useRef<string | null>(null)

  const {currentSong, isPlaying, playNext} = usePlayerStore()

  useEffect(() => {
    if (isPlaying) audioRef.current?.play()
    else audioRef.current?.pause()
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    const handleEnded = () => {
      playNext()
    }
    audio?.addEventListener("ended", handleEnded)

    return () => audio?.removeEventListener("ended", handleEnded)
  }, [playNext]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    const audio = audioRef.current

    const isSongChanged = prevSongRef.current !== currentSong?.audioUrl

    if (isSongChanged){
      audio.src = currentSong?.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;
      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef}/>;
};

export default AudioPlayer;