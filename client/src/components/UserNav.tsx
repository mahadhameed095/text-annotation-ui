import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { userContext, userContextType } from '@/context';
import { useContext } from "react";

type Props = {
    email: string,
    name: string
}

export function UserNav({email, name} : Props) {
    const navigate = useNavigate();
    const {logout} = useContext(userContext) as userContextType;

    function SignOut() {
      console.log("logging out..")
      logout();
      navigate("/login");
    } 
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="src/assets/profile-2.png" alt="@shadcn" />
              <AvatarFallback>{name ? name[0] : "P"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name ? name : "undefined"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email ? email : "undefined"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => SignOut()}>
                Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }