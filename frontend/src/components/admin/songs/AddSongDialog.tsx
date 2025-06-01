import {useMusicStore} from "@/stores/useMusicStore.ts";
import React, {useRef, useState} from "react";
import type {NewSong} from "@/types/song.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, Upload} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import toast from "react-hot-toast";
import {axiosInstance} from "@/lib/axios.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";

const AddSongDialog = () => {
  const {albums, fetchSongs, fetchStats} = useMusicStore()
  const [songDialogOpen, setSongDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newSong, setNewSong] = useState<NewSong>({
    title: "",
    artist: "",
    albumId: "",
    duration: 0,
  })
  const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
    audio: null,
    image: null,
  });
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setNewSong((prev) => ({...prev, [name]: value}))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      if (!newSong.title){
        return toast.error("Please enter a title");
      }else if (!newSong.artist){
        return toast.error("Please enter a artist");
      }else if (newSong.duration <= 0 ){
        return toast.error("Duration must be greater than 0 seconds");
      }else if (!files.audio){
        return toast.error("Please upload an audio");
      }else if (!files.image){
        return toast.error("Please upload an image");
      }

      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      if (newSong.albumId && newSong.albumId !== "none") {
        formData.append("albumId", newSong.albumId);
      }
      formData.append("duration", newSong.duration.toString());
      formData.append("audioFile", files.audio);
      formData.append("imageFile", files.image);

      await axiosInstance.post(API_PATHS.ADMIN.CREATE_SONG, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      setNewSong({
        title: "",
        artist: "",
        albumId: "",
        duration: 0,
      })

      setFiles({
        audio: null,
        image: null,
      });

      await fetchSongs();
      await fetchStats();

      setSongDialogOpen(false);

      toast.success("Song added successfully!");
    } catch (error: any) {
      toast.error("Failed to add song: " + error.message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-violet-500 hover:bg-violet-600 text-black cursor-pointer'>
          <Plus className='mr-2 h-4 w-4'/>
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>Add a new song to your music library</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <input
            type='file'
            accept='audio/*'
            ref={audioInputRef}
            name="audio"
            hidden
            onChange={(e) => setFiles((prev) => ({...prev, audio: e.target.files![0]}))}
          />

          <input
            type='file'
            ref={imageInputRef}
            className='hidden'
            name="image"
            accept='image/*'
            onChange={(e) => setFiles((prev) => ({...prev, image: e.target.files![0]}))}
          />
          <div
            className='flex items-center justify-center p-6 pb border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => imageInputRef.current?.click()}
          >
            <div className='text-center'>
              {files.image ? (
                <div className='space-y-2'>
                  <div className='text-sm text-violet-500'>Image selected:</div>
                  <div className='text-xs text-zinc-400'>{files.image.name}</div>
                </div>
              ) : (
                <>
                  <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                    <Upload className='h-6 w-6 text-zinc-400'/>
                  </div>
                  <div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
                  <Button variant='outline' size='sm' className='text-xs'>
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium m-1'>Audio File</label>
            <div className='flex items-center gap-2'>
              <Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full mt-1'>
                {files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium m-1'>Title</label>
            <Input
              name="title"
              value={newSong.title}
              onChange={handleChange}
              className='bg-zinc-800 border-zinc-700 mt-1'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium m-1'>Artist</label>
            <Input
              name="artist"
              value={newSong.artist}
              onChange={handleChange}
              className='bg-zinc-800 border-zinc-700 mt-1'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium m-1'>Duration (seconds)</label>
            <Input
              name="duration"
              type='number'
              min='0'
              value={newSong.duration}
              onChange={handleChange}
              className='bg-zinc-800 border-zinc-700 mt-1'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium m-1'>Album (Optional)</label>
            <Select
              value={newSong.albumId}
              onValueChange={(value) => setNewSong((prev) => ({...prev, albumId: value}))}
            >
              <SelectTrigger className='bg-zinc-800 border-zinc-700 mt-1 w-full'>
                <SelectValue placeholder='Select album'/>
              </SelectTrigger>
              <SelectContent className='bg-zinc-800 border-zinc-700'>
                <SelectItem className="hover:cursor-pointer" value='none'>No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem className="hover:cursor-pointer" key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !files.image || !files.audio || !newSong.title || !newSong.artist || !newSong.duration}>
            {isLoading ? "Uploading..." : "Add Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;