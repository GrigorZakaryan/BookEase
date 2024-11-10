"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

export const Social = ({ redirect }: { redirect?: string }) => {
  const onSubmit = async (provider: "google" | "github") => {
    await signIn(provider, { redirectTo: redirect });
  };
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-3 w-full">
        <Button
          className="flex items-center gap-3 rounded-lg w-full"
          onClick={() => onSubmit("google")}
          variant={"outline"}
          size={"lg"}
        >
          <FcGoogle className="w-5 h-5" /> Continue with Google
        </Button>
      </div>
    </div>
  );
};
