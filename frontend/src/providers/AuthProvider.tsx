import {useAuth} from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {Loader} from "lucide-react";
import * as React from "react";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {useChatStore} from "@/stores/useChatStore.ts";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"]
  }
}

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const {getToken, userId} = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const {checkAdminStatus} = useAuthStore()
  const {initSocket, disconnectSocket} = useChatStore()
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken()
        updateApiToken(token)
        if (token){
          await checkAdminStatus()

          //init socket
          if (userId) initSocket(userId)
        }
      } catch (error) {
        updateApiToken(null)
        console.error("Error in auth provider", error)
      } finally {
        setLoading(false)
      }
    }
    initAuth();

    return () => disconnectSocket()
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket])

  if (loading) {
    return (
     <div className="h-screen w-full flex items-center justify-center">
       <Loader className="size-8 text-violet-500 animate-spin"/>
     </div>
    )
  }
  return (
    <div>
      {children}
    </div>
  );
};

export default AuthProvider;