import Link from "next/link";
import { MoveLeft, X } from "lucide-react";

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
