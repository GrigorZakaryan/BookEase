import Link from "next/link";
import { MoveLeft, X } from "lucide-react";
import { UserButton } from "./auth/user-button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Social } from "./auth/social";

export const Header = ({
  image,
  email,
  name,
  isLoggedIn,
}: {
  isLoggedIn: boolean;
  image?: string;
  email?: string;
  name?: string;
}) => {
  return (
    <header className="w-full fixed z-50 bg-white/35 top-0 backdrop-blur-lg border-b border-white">
      <div className="w-full px-5 py-3 flex items-center justify-between">
        <div>
          <Link className="cursor-pointer" href={"/"}>
            <h1 className="text-xl font-bold font-serif">BookEase</h1>
          </Link>
        </div>
        {isLoggedIn ? (
          <UserButton image={image} email={email} name={name} />
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Log In</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
                <DialogDescription>
                  Sign in or create an account to be able to manage all your
                  appointements
                </DialogDescription>
              </DialogHeader>
              <Social />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  );
};

export const HeaderControl = ({ fallbackLink }: { fallbackLink: string }) => {
  return (
    <header className="w-full border-b">
      <div className="flex items-center justify-between px-7 py-5">
        <div>
          <Link href={fallbackLink}>
            <MoveLeft />
          </Link>
        </div>
        <div>
          <Link href={"/"}>
            <X />
          </Link>
        </div>
      </div>
    </header>
  );
};
