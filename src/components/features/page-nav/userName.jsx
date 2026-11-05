
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  LogOutIcon,
  Settings,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(-2)
      .join("")
      .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex cursor-pointer items-center justify-between rounded-full px-2 py-8 hover:bg-gray-100">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt={user?.name || "User"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        }
      />

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/my-profile")}>
            <BadgeCheckIcon />
            My Account
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings />
            Setting
          </DropdownMenuItem>

          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
