import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AppointmentsPage } from "./components/appointments-page";

export default async function Appointments() {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { id: session?.user?.id },
    include: { customer: true },
  });
  const appointments = await db.appointment.findMany({
    where: { customerId: user?.customer?.id },
    include: {
      business: true,
      service: true,
      employee: { include: { user: true } },
    },
    orderBy: { date: "asc" },
  });

  const formattedAppointments = appointments.map((appointment) => {
    return {
      ...appointment,
      service: {
        ...appointment.service,
        price: appointment.service.price.toNumber(),
      },
    };
  });

  return (
    <div className="h-full">
      <AppointmentsPage appointments={formattedAppointments} />
    </div>
  );
}
