import { BusinessCard } from "@/components/business/business-card";
import { Header } from "@/components/headers";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import Avatar from "@/app/images.png";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SearchInput } from "@/components/search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import MockUp from "@/app/Mock-up.jpg";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Link from "next/link";

export default async function Home() {
  const businesses = await db.business.findMany();
  const session = await auth();

  return (
    <div className="relative">
      <div className="w-full h-[20px] z-0 absolute top-0 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500"></div>
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
        <div className="flex flex-col md:flex-row w-full justify-between py-[150px]">
          <div className="px-2 md:px-10  flex flex-col items-center md:items-start space-y-5 w-full">
            <h1 className="text-5xl md:text-8xl text-center md:text-left font-serif font-bold">
              BookEase for{" "}
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span className="">Business</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                  <span className="">Business</span>
                </div>
              </div>
            </h1>
            <p className="text-center md:text-left md:max-w-[600px] text-md md:text-2xl font-medium pl-1">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
            </p>
            <div className="flex items-center">
              <Link
                href={"https://book-ease-partners.vercel.app"}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button className="ml-1 font-semibold rounded-full" size={"lg"}>
                  Get Started
                </Button>
              </Link>
              <Link
                href={"https://book-ease-partners.vercel.app"}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button variant={"link"}>
                  For more <ChevronRight />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full h-full px-7 hidden md:block">
            <div className="p-5 bg-gray-200 rounded-3xl border-4 border-gray-300">
              <Image
                src={MockUp.src}
                alt="hero"
                height={820}
                width={1600}
                className="mx-auto w-full rounded-2xl object-cover h-full object-left-top"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full flex justify-center pb-10 pt-3 z-20 bg-white">
        <h1 className="text-xs text-muted-foreground">
          © 2024 BookEase • Made with ❤️ by Grigor Zakaryan
        </h1>
      </footer>
      <div className="w-full h-[20px] z-0 absolute bottom-0 blur-md bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500"></div>
    </div>
  );
}
