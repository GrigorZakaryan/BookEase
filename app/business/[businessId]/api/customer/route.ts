import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ businessId: string }> }
) {
  const params = await props.params;
  const body = await req.json();
  const { userId } = body;

  if (!params.businessId) {
    return new NextResponse("Business ID is required!", { status: 400 });
  }

  if (!userId) {
    return new NextResponse("User ID is required!", { status: 400 });
  }

  const existingUser = await db.customer.findUnique({ where: { userId } });

  try {
    if (existingUser) {
      const customer = await db.customer.update({
        where: { userId },
        data: {
          businesses: {
            connect: { id: params.businessId },
          },
        },
      });
      return NextResponse.json(customer);
    } else {
      const customer = await db.customer.create({
        data: {
          userId,
          businesses: {
            connect: { id: params.businessId },
          },
        },
      });
      return NextResponse.json(customer);
    }
  } catch (err) {
    console.log("[CUSTOMER_POST]", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
}
