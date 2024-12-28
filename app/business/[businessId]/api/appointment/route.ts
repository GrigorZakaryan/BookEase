import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ businessId: string }> }
) {
  const params = await props.params;
  const body = await req.json();
  const { customerId, serviceId, employeeId, businessId, date } = body;

  if (!customerId) {
    return new NextResponse("Customer Id is required!", { status: 400 });
  }
  if (!serviceId) {
    return new NextResponse("Service Id is required!", { status: 400 });
  }
  if (!employeeId) {
    return new NextResponse("Employee Id is required!", { status: 400 });
  }
  if (!date) {
    return new NextResponse("Date is required!", { status: 400 });
  }

  try {
    const appointment = await db.appointment.create({
      data: {
        customerId,
        serviceId,
        employeeId,
        date,
        businessId: businessId || params.businessId,
      },
      include: {
        service: true,
        employee: true,
        customer: { include: { user: true } },
      },
    });

    await pusherServer.trigger(params.businessId, "appointment-created", {
      ...appointment,
      date,
    });
    return new NextResponse("Appointment added succesfully!", { status: 200 });
  } catch (err) {
    console.log("[APPOINTMENT_POST]", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
}
