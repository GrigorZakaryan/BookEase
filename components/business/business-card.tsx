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

export const BusinessCard = ({ business }: { business: Business }) => {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="py-5 flex flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <CardTitle>{business.name}</CardTitle>
            <CardDescription>{business.address}</CardDescription>
          </div>
        </div>
        <div>
          {business.image && (
            <Image
              className="rounded-md"
              src={business.image}
              alt="Image"
              width={500}
              height={500}
            />
          )}
        </div>
        <div className="mt-5">
          <Link href={`/business/${business.id}`}>
            <Button className="w-full" size={"lg"}>
              Book an Appointment
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
