import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Music } from "lucide-react";
import SongsTable from "@/components/admin/songs/SongsTable.tsx";
import AddSongDialog from "@/components/admin/songs/AddSongDialog.tsx";

const SongsTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Music className='size-5 text-violet-500' />
              Songs Library
            </CardTitle>
            <CardDescription>Manage your music tracks</CardDescription>
          </div>
          <AddSongDialog />
        </div>
      </CardHeader>
      <CardContent>
        <SongsTable />
      </CardContent>
    </Card>
  );
};
export default SongsTabContent;