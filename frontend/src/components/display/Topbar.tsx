import {Link} from "react-router-dom";
import {LayoutDashboardIcon} from "lucide-react";
import {SignedOut, UserButton} from "@clerk/clerk-react";
import SignInOAuthButton from "@/components/ui/SignInOAuthButton.tsx";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import Melodio from "/public/Melodio.jpg"
import {cn} from "@/lib/utils.ts";
import {buttonVariants} from "@/components/ui/button.tsx";

const Topbar = () => {
  const {isAdmin} = useAuthStore()

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src={Melodio} className="size-8" alt="Melodio" />
        Melodio
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to={"/admin"} className={cn(
            buttonVariants({variant: "outline"})
          )}>
            <LayoutDashboardIcon className="size-4 mr-2"/>
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButton/>
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;