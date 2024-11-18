import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ appointmentId: string }> }
) {
  const params = await props.params;
  const body = await req.json();

  const session = await auth();
  const { status } = body;

  const appointment = await db.appointment.findUnique({
    where: { id: params.appointmentId },
    include: { customer: { include: { user: true } } },
  });

  if (appointment?.customer.user?.id !== session?.user?.id) {
    return new NextResponse("You're not authorized to make this request", {
      status: 401,
    });
  }

  try {
    await db.appointment.update({
      where: { id: appointment?.id },
      data: { status },
    });
    return new NextResponse("Appointment updated!", { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
}
