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
    const business = await db.business.findUnique({
      where: { id: params.businessId },
      include: { customers: true },
    });
    const customer = business?.customers.some(
      (customer) => customer.id === params.customerId
    );
    return NextResponse.json(customer, { status: 200 });
  } catch (err) {
    console.log("[CUSTOMER_POST]", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
}
