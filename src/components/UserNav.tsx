import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Auth, signOut } from "firebase/auth"
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom"

type Props = {
    email: string,
    name: string
}

export function UserNav({email, name} : Props) {
    const navigate = useNavigate();

    const SignOut = (auth: Auth) => {
        signOut(auth);
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
          <DropdownMenuItem>
            <button onClick={() => SignOut(auth)}>
                Log out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }