import { Alert } from "@/components/ui/alert";
import { Business, Employee, Service } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";

interface ServiceProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  description: string;
  price: number;
  duration: string;
  businessId: string;
}

interface AppointmentProps {
  id: string;
  customerId: string;
  serviceId: string;
  employeeId: string;
  businessId: string;
  business: Business;
  service: ServiceProps;
  employee: Employee;
  date: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export const AppointmentForm = ({
  appointment,
  className,
  setSelectedAppointment,
}: {
  appointment: AppointmentProps;
  className?: string;
  setSelectedAppointment: () => void;
}) => {
  return (
    <Alert
      onClick={setSelectedAppointment}
      className={`${className} p-0 pr-5 rounded-md flex space-x-4 items-center ease-linear duration-200 cursor-pointer hover:shadow-md`}
    >
      {appointment.business.image && (
        <Image
          className="rounded-tl-sm rounded-bl-sm"
          width={200}
          height={200}
          src={appointment.business.image}
          alt={appointment.business.name}
        />
      )}
      <div>
        <h1 className="text-lg font-semibold">{appointment.business.name}</h1>
        <p className="opacity-70">
          {format(appointment.date, "EEE, MMM d yyyy, HH:mm")}
        </p>
        <p className="text-muted-foreground">
          {new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
          }).format(appointment.service.price)}
        </p>
      </div>
    </Alert>
  );
};
