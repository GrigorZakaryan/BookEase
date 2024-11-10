import { HeaderControl } from "@/components/headers";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookForm } from "./components/book-form";
import { auth } from "@/auth";

export default async function BusinessPage(props: {
  params: Promise<{ businessId: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  const days = [];
  const currentDate = new Date();
  const targetDate = new Date(currentDate);
  targetDate.setMonth(currentDate.getMonth() + 3);

  for (
    let date = new Date(currentDate);
    date < targetDate;
    date.setDate(date.getDate() + 1)
  ) {
    days.push(new Date(date));
  }

  const business = await db.business.findUnique({
    where: { id: params.businessId },
    include: {
      workingHours: true,
      appointments: true,
      services: true,
      employees: true,
      customers: true,
    },
  });

  if (!business) {
    return redirect("/");
  }

  const closedDaysNumbers: number[] = [];
  const dayMapping: { [key: string]: number } = {
    sundayStart: 0,
    mondayStart: 1,
    tuesdayStart: 2,
    wednesdayStart: 3,
    thursdayStart: 4,
    fridayStart: 5,
    saturdayStart: 6,
  };

  for (const key in business.workingHours[0]) {
    //@ts-ignore
    if (business.workingHours[0][key] === null) {
      if (dayMapping[key] !== undefined) {
        closedDaysNumbers.push(dayMapping[key]);
      }
    }
  }

  const filteredDays = days.filter(
    (day) => !closedDaysNumbers.includes(new Date(day).getDay())
  );

  const formattedBusiness = {
    ...business,
    services: business.services.map((service) => ({
      ...service,
      price: service.price.toNumber(),
    })),
  };

  return (
    <div className="w-full h-full">
      <HeaderControl fallbackLink={`/business/${params.businessId}`} />
      <BookForm
        userId={session?.user?.id}
        filteredDays={filteredDays}
        business={formattedBusiness}
      />
    </div>
  );
}
