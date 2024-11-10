import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; customerId: string }> }
) {
  const params = await props.params;

  if (!params.businessId) {
    return new NextResponse("Business ID is required!", { status: 400 });
  }

  if (!params.customerId) {
    return new NextResponse("User ID is required!", { status: 400 });
  }

  try {
    const customer = await db.customer.findUnique({
      where: {
        userId: params.customerId,
        businessId: params.businessId,
      },
    });
    return NextResponse.json(customer, { status: 200 });
  } catch (err) {
    console.log("[CUSTOMER_POST]", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
}
