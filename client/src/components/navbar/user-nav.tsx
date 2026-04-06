import { ChevronDown, LogOut } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function UserNav({
    userName,
    profilePicture,
    onLogout,
}: {
    userName: string;
    profilePicture: string;
    onLogout: () => void;
}) {
    // Get first letter of name for avatar fallback
    const getInitials = () => {
        if (!userName) return "U";
        return userName.charAt(0).toUpperCase();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative !bg-transparent h-8 w-8 rounded-full !gap-0 hover:bg-black/5 dark:hover:bg-white/10"
                >
                    <Avatar className="h-10 w-10 !cursor-pointer">
                        <AvatarImage
                            src={profilePicture || ""}
                            className="!cursor-pointer"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="!w-3 !h-3 ml-1 text-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 glass-card"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="flex flex-col items-start gap-1">
                    <span className="font-semibold text-foreground">{userName}</span>
   
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="!bg-border" />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className="text-foreground hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}