import Topbar from "@/components/display/Topbar.tsx";
import {useMusicStore} from "@/stores/useMusicStore.ts";
import {useEffect} from "react";
import FeaturedSection from "@/components/display/FeaturedSection.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import SectionGrid from "@/components/display/SectionGrid.tsx";
import {usePlayerStore} from "@/stores/usePlayerStore.ts";
import type {Song} from "@/types/song.ts";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    featuredSongs,
    madeForYouSongs,
    trendingSongs,
    isLoading
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore()

  useEffect(() => {
    let allSongs : Song[] = []
    if (featuredSongs.length > 0){
      allSongs = [...allSongs, ...featuredSongs]
    }
    if (madeForYouSongs.length > 0){
      allSongs = [...allSongs, ...madeForYouSongs]
    }
    if (trendingSongs.length > 0){
      allSongs = [...allSongs, ...trendingSongs]
    }
    initializeQueue(allSongs)
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchMadeForYouSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar/>
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Good Afternoon!</h1>
          <FeaturedSection/>
          <div className="space-y-8">
            <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading}/>
            <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading}/>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;