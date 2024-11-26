import { Business, User } from "@prisma/client";

export interface ServiceProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  description: string;
  price: number;
  duration: string;
  businessId: string;
}

export interface EmployeeProps {
  name: string;
  id: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  userId: string | null;
  isOwner: boolean;
  status: string;
  user?: User | null;
  businessId: string;
}

export interface AppointmentProps {
  id: string;
  customerId: string;
  serviceId: string;
  employeeId: string;
  businessId: string;
  business: Business;
  service: ServiceProps;
  employee: EmployeeProps;
  date: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
