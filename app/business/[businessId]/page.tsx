import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Social } from "@/components/auth/social";
import { Alert } from "@/components/ui/alert";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { HeaderControl } from "@/components/headers";

export default async function BusinessPage(props: {
  params: Promise<{ businessId: string }>;
}) {
  const params = await props.params;
  const session = await auth();

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

  return (
    <>
      <HeaderControl fallbackLink={`/`} />
      <div className="flex flex-col items-center justify-center w-full mt-10">
        <Card className="w-full max-w-xl flex flex-col items-center justify-center border-0 shadow-none md:border md:shadow-sm">
          <CardHeader>
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold font-serif text-balance">
                {business.name}
              </h1>
              <p className="text-lg text-muted-foreground font-serif text-balance">
                {business.address}
              </p>
            </div>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter>
            <div className="w-full max-w-lg flex flex-col ">
              <div>
                {session && (
                  <Link href={`/business/${params.businessId}/book`}>
                    <Alert className="mt-3 ease-linear duration-100 hover:bg-primary-foreground">
                      <h1 className="text-xl font-semibold">
                        Book an Appointment
                      </h1>
                      <p className="text-muted-foreground text-balance">
                        Book an appointment for you picking a service you want
                        with your favourite professional.
                      </p>
                    </Alert>
                  </Link>
                )}
                {!session && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Alert className="mt-3 ease-linear duration-100 hover:bg-primary-foreground">
                        <h1 className="text-xl font-semibold">
                          Book an Appointment
                        </h1>
                        <p className="text-muted-foreground text-balance">
                          Book an appointment for you picking a service you want
                          with your favourite professional.
                        </p>
                      </Alert>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sign In</DialogTitle>
                        <DialogDescription>
                          Sign in or create an account to be able to manage all
                          your appointements
                        </DialogDescription>
                      </DialogHeader>
                      <Social
                        redirect={`/business/${params.businessId}/book`}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
