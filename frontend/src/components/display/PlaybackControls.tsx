import {usePlayerStore} from "@/stores/usePlayerStore.ts";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Pause, Play, SkipBack, SkipForward, Volume1} from "lucide-react";
import {Slider} from "@/components/ui/slider.tsx";

interface PlaybackControls {
  volume: number;
  currentTime: number;
  duration: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrev} = usePlayerStore()
  const [contols, setControls] = useState<PlaybackControls>({
    volume: 75, currentTime: 0, duration: 0
  })
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setControls((prevState) => ({...prevState, currentTime: audio.currentTime }))
    }

    const updateDuration = () => {
      setControls((prevState) => ({...prevState, duration: audio.duration }))
    }

    const handleEnded = () => {
      usePlayerStore.setState({isPlaying: false})
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef?.current){
      audioRef.current.currentTime = value[0]
    }
  }

  return (
    <footer className='h-22 bg-zinc-900 border-t border-zinc-800 px-4'>
      <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
        {/* currently playing song */}
        <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className='w-14 h-14 object-cover rounded-md'
              />
              <div className='flex-1 min-w-0'>
                <div className='font-medium truncate hover:underline cursor-pointer'>
                  {currentSong.title}
                </div>
                <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls*/}
        <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
          <div className='flex items-center gap-4 sm:gap-6'>
            {/*<Button*/}
            {/*  size='icon'*/}
            {/*  variant='ghost'*/}
            {/*  className='hidden sm:inline-flex hover:text-white text-zinc-400'*/}
            {/*>*/}
            {/*  <Shuffle className='h-4 w-4' />*/}
            {/*</Button>*/}

            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400 hover:cursor-pointer'
              onClick={playPrev}
              disabled={!currentSong}
            >
              <SkipBack className='h-4 w-4' />
            </Button>

            <Button
              size='icon'
              className='bg-white hover:bg-white/80 text-black rounded-full h-10 w-10 hover:cursor-pointer'
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400 hover:cursor-pointer'
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className='h-4 w-4' />
            </Button>
            {/*<Button*/}
            {/*  size='icon'*/}
            {/*  variant='ghost'*/}
            {/*  className='hidden sm:inline-flex hover:text-white text-zinc-400'*/}
            {/*>*/}
            {/*  <Repeat className='h-4 w-4' />*/}
            {/*</Button>*/}
          </div>

          <div className='hidden sm:flex items-center gap-2 w-full'>
            <div className='text-xs text-zinc-400'>{formatTime(contols.currentTime)}</div>
            <Slider
              value={[contols.currentTime]}
              max={contols.duration || 100}
              step={1}
              className='w-full hover:cursor-grab active:cursor-grabbing'
              onValueChange={handleSeek}
            />
            <div className='text-xs text-zinc-400'>{formatTime(contols.duration)}</div>
          </div>
        </div>
        {/* volume controls */}
        <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
          {/*<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>*/}
          {/*  <Mic2 className='h-4 w-4' />*/}
          {/*</Button>*/}
          {/*<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>*/}
          {/*  <ListMusic className='h-4 w-4' />*/}
          {/*</Button>*/}
          {/*<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>*/}
          {/*  <Laptop2 className='h-4 w-4' />*/}
          {/*</Button>*/}

          <div className='flex items-center gap-2'>
            <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
              <Volume1 className='h-4 w-4' />
            </Button>

            <Slider
              value={[contols.volume]}
              max={100}
              step={1}
              className='w-24 hover:cursor-grab active:cursor-grabbing'
              onValueChange={(value) => {
                setControls((prevState) => ({...prevState, volume: value[0]}));
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlaybackControls;