"use client";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Avatar from "@/app/images.png";
import { signOut } from "next-auth/react";
import { LogOut, Settings, Store, User2 } from "lucide-react";

interface AccountProps {
  image?: string | null;
  email?: string | null;
  name?: string | null;
}

export const UserButton = ({ image, email, name }: AccountProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {" "}
          <Image
            alt="Avatar"
            className="rounded-full opacity-90 hover:opacity-100 duration-200"
            height="40"
            src={image ? image : Avatar.src}
            style={{
              aspectRatio: "32/32",
              objectFit: "cover",
            }}
            width="40"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-sm text-muted-foreground font-normal">
            {email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2"
            asChild
          >
            <Link href={"/appointments"}>
              <Store className="w-4 h-4" />
              Appointments
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
