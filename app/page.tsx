import { BusinessCard } from "@/components/business/business-card";
import { Header } from "@/components/headers";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import Avatar from "@/app/images.png";

export default async function Home() {
  const businesses = await db.business.findMany();
  const session = await auth();
  return (
    <div>
      <Header
        isLoggedIn={!!session}
        image={session?.user?.image || Avatar.src}
        name={session?.user?.name || ""}
        email={session?.user?.email || ""}
      />{" "}
      <div className="w-full h-full flex flex-col">
        <div className="w-full px-10 py-5 grid grid-cols-4">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </div>
  );
}
