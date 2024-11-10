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
    <div className="w-full h-full">
      <h1>{business.name}</h1>
      <div>
        {session && (
          <Link href={`/business/${params.businessId}/book`}>
            <Button>Book</Button>
          </Link>
        )}
        {!session && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Book</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
                <DialogDescription>
                  Sign in or create an account to be able to manage all your
                  appointements
                </DialogDescription>
              </DialogHeader>
              <Social redirect={`/business/${params.businessId}/book`} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
