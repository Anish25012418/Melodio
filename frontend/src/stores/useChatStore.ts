import {create} from "zustand";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {axiosInstance} from "@/lib/axios.ts";

interface ChatStore {
  users: any[],
  fetchUsers: () => Promise<void>,
  isLoading: boolean,
  error: string | null,
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      set({users: response.data})
    }catch (error: any) {
      set({error: error.response.data.message})
    }finally {
      set({isLoading: false})
    }
  }
}))