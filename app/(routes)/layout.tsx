import { auth } from "@/auth";
import { Header } from "@/components/headers";
import Avatar from "@/app/images.png";
import { redirect } from "next/navigation";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }
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
