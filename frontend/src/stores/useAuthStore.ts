import {create} from 'zustand';
import {axiosInstance} from "@/lib/axios.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  reset: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,
  checkAdminStatus: async() => {
    set({isLoading: true, error: null});
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.CHECK_IS_ADMIN);
      set({isAdmin: response.data.admin});
    }catch(error: any) {
      set({ isAdmin: false, error: error.response.data.message });
    }finally {
      set({isLoading: false});
    }
  },

  reset: () => {
    set({isAdmin: false, isLoading: false, error: null});
  }
}))