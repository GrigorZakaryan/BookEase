import { BusinessCard } from "@/components/business/business-card";
import { Header } from "@/components/headers";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import Avatar from "@/app/images.png";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SearchInput } from "@/components/search";
import { Badge } from "@/components/ui/badge";

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
      />
      <main>
        <BackgroundBeamsWithCollision>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-5xl px-4">
              <div className="flex md:justify-center items-center mb-3">
                <Badge variant={"outline"}>This is Beta Testing</Badge>
              </div>
              <h1 className=" text-6xl text-left md:text-center md:text-8xl font-bold font-serif">
                Book Local Beauty and Wellness Services with{" "}
                <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                  <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                    <span className="">BookEase</span>
                  </div>
                  <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                    <span className="">BookEase</span>
                  </div>
                </div>
              </h1>
              <div className="mt-3">
                <SearchInput />
              </div>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
        <div className="w-full h-full flex flex-col pt-20 bg-white px-10">
          <h1 className="text-2xl font-semibold">Recomended Businesses</h1>
          <div className="w-full py-5 grid md:grid md:grid-cols-4 grid-cols-1 gap-2 space-y-2 md:space-y-0">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
