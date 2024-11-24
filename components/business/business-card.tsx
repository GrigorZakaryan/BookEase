import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Business } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

export const BusinessCard = ({ business }: { business: Business }) => {
  return (
    <Link href={`/business/${business.id}`} className="w-full max-w-md group">
      <Card className="w-full max-w-md shadow-none h-full group-hover:shadow-lg ease-linear duration-200">
        {business.image && (
          <Image
            className="rounded-tr-md rounded-tl-md duration-100 ease-linear"
            src={business.image}
            alt="Image"
            width={500}
            height={500}
          />
        )}
        <div className="flex flex-col justify-between px-4 md:h-[120px] h-[150px] py-3">
          <div>
            <CardTitle className="text-lg text-balance">
              {business.name}
            </CardTitle>
            <CardDescription className="text-balance text-sm md:text-md">
              {business.address}
            </CardDescription>
          </div>
          <div>
            <Badge variant={"outline"}>{business.type}</Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};
