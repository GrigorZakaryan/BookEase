import { auth } from "@/auth";
import { Header } from "@/components/headers";
import { db } from "@/lib/db";
import Avatar from "@/app/images.png";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const businesses = await db.business.findMany();
  const session = await auth();
  return (
    <div>
      <Header
        isLoggedIn={!!session}
        image={session?.user?.image || Avatar.src}
        name={session?.user?.name || ""}
        email={session?.user?.email || ""}
      />
      <div className="pt-16 w-full h-full">{children}</div>
    </div>
  );
}
