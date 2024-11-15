"use client";

import { useState } from "react";
import { Appointment, Employee, User, WorkingHours } from "@prisma/client";

import axios from "axios";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Avatar from "@/app/images.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { BusinessDaySlots } from "../../components/slots";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Social } from "@/components/auth/social";
import { useRouter } from "next/navigation";

interface ServiceProps {
  id: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  description: string;
  price: number;
  duration: string;
}

interface EmployeeProps {
  name: string;
  id: string;
  email: string;
  image: string;
  userId: string | null;
  isOwner: boolean;
  status: string;
  user?: User | null;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BusinessProps {
  name: string;
  id: string;
  address: string;
  type: string;
  ownerId: string;
  employees: EmployeeProps[];
  appointments: Appointment[];
  workingHours: WorkingHours[];
  services: ServiceProps[];
  createdAt: Date;
  updatedAt: Date;
}

export const BookForm = ({
  business,
  filteredDays,
  userId,
}: {
  business: BusinessProps;
  filteredDays: Date[];
  userId?: string;
}) => {
  const [selectedServices, setSelectedServices] = useState<ServiceProps[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceProps>();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProps>();
  const [selectedDay, setSelectedDay] = useState<Date | null>();
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const total = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

  const handleDayFromChild = (data: Date) => {
    setSelectedDay(data);
  };
  const handleTimeFromChild = (data: string) => {
    setSelectedTime(data);
  };
  const toggleService = (service: ServiceProps) => {
    if (selectedServices.includes(service)) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const onSubmit = async () => {
    if (!selectedService) {
      toast.error("Select at least one service!");
      return;
    }

    if (!selectedEmployee) {
      toast.error("Select at least one professional!");
      return;
    }

    if (!selectedDay) {
      toast.error("Select a day!");
      return;
    }

    if (!selectedTime) {
      toast.error("Select time!");
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);

    const modifiedDate = new Date(selectedDay);
    modifiedDate.setHours(hours, minutes);

    try {
      setLoading(true);
      const existingCustomer = await axios.get(
        `/business/${business.id}/api/customer/${userId}`
      );

      if (!existingCustomer.data) {
        console.log("DOING THIS SHIT!");
        const customerResponse = await axios.post(
          `/business/${business.id}/api/customer`,
          { userId: userId }
        );

        const customer = customerResponse.data;
        const appointementResponse = await axios.post(
          `/business/${business.id}/api/appointment`,
          {
            customerId: customer.id,
            serviceId: selectedService.id,
            employeeId: selectedEmployee.id,
            businessId: business.id,
            date: modifiedDate,
          }
        );

        if (appointementResponse.status === 200) {
          toast.success("Appointment created succefully!");
        }
        router.push(`/business/${business.id}`);
        return;
      }

      const appointementResponse = await axios.post(
        `/business/${business.id}/api/appointment`,
        {
          customerId: existingCustomer.data.id,
          serviceId: selectedService.id,
          employeeId: selectedEmployee.id,
          businessId: business.id,
          date: modifiedDate,
        }
      );

      if (appointementResponse.status === 200) {
        toast.success("Appointment created succefully!");
      }

      router.push(`/business/${business.id}/`);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-start pt-[50px]">
      {page !== 4 && (
        <div className="w-full px-[100px]">
          <Breadcrumb className="mb-7">
            <BreadcrumbList>
              <BreadcrumbItem>
                {page === 1 ? (
                  <BreadcrumbPage>Service</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => setPage(1)}
                  >
                    Service
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {page === 2 ? (
                  <BreadcrumbPage>Professional</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => setPage(2)}
                  >
                    Professional
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {page === 3 ? (
                  <BreadcrumbPage>Time</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => setPage(3)}
                  >
                    Time
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {page === 4 ? (
                  <BreadcrumbPage>Review & Confirm</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => setPage(4)}
                  >
                    Review & Confirm
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {page === 1 && (
            <div className="mt-7 h-full max-h-[600px] overflow-y-auto">
              <h1 className="text-4xl font-bold">Select Service</h1>
              <h1 className="text-2xl font-semibold mt-5">Featured services</h1>
              <div className="flex flex-col items-center space-y-4 w-full max-w-md mt-5 max-h-[500px] overflow-y-auto">
                {business.services.map((service) => (
                  <Alert
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="hover:bg-primary-foreground cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <AlertTitle className="text-md font-semibold">
                        {service.label}
                      </AlertTitle>
                      <p className="text-muted-foreground">
                        {service.duration}
                      </p>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("it-IT", {
                          style: "currency",
                          currency: "EUR",
                        }).format(service.price)}
                      </p>
                    </div>
                    <div>
                      <Checkbox checked={selectedService?.id === service.id} />
                    </div>
                  </Alert>
                ))}
              </div>
            </div>
          )}
          {page === 2 && (
            <div className="mt-7">
              <h1 className="text-4xl font-bold">Select Professional</h1>
              <div className="grid grid-cols-3 gap-2 w-full max-w-md mt-5 max-h-[500px] overflow-y-auto">
                {business.employees.map((employee) => (
                  <div
                    key={employee.id}
                    onClick={() => setSelectedEmployee(employee)}
                    className="w-[170px] h-[150px] rounded-xl border flex items-center justify-center hover:bg-primary-foreground cursor-pointer"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Image
                        width={50}
                        height={50}
                        alt="img"
                        src={employee.user?.image || Avatar.src}
                        className="rounded-full"
                      />
                      <h1 className="text-sm font-semibold">{employee.name}</h1>
                      <p className="text-xs text-muted-foreground">
                        Professional
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page === 3 && (
            <BusinessDaySlots
              sendDay={handleDayFromChild}
              sendTime={handleTimeFromChild}
              appointments={business.appointments}
              employee={selectedEmployee?.id}
              filteredDays={filteredDays}
              workingHours={business.workingHours[0]}
            />
          )}
        </div>
      )}
      <div className="w-full px-[100px] flex justify-center">
        <Card className="w-full max-w-lg ease-linear duration-200">
          <CardHeader>
            <CardTitle className="text-2xl">{business.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDay && (
              <h1 className="font-semibold text-md my-3">
                {format(selectedDay, "EEEE, MMMM d, yyyy")}, {selectedTime}
              </h1>
            )}

            {selectedService && (
              <Alert
                key={selectedService?.id}
                className="hover:bg-primary-foreground cursor-pointer flex items-center justify-between border-0 ease-linear duration-150"
              >
                <div>
                  <AlertTitle className="text-md font-semibold">
                    {selectedService?.label}
                  </AlertTitle>
                  <p className="text-muted-foreground">
                    {selectedService?.duration}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedService?.description}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(selectedService?.price || 0)}
                  </p>
                </div>
              </Alert>
            )}

            <Separator className="my-5" />
            {selectedEmployee && (
              <Alert className="hover:bg-primary-foreground cursor-pointer flex items-center space-x-5 border-0 ease-linear duration-150">
                <div className="flex items-center space-x-3">
                  <div>
                    <Image
                      width={50}
                      height={50}
                      alt="img"
                      src={
                        selectedEmployee.user?.image ||
                        selectedEmployee.image ||
                        Avatar.src
                      }
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <AlertTitle className="text-md font-semibold">
                      {selectedEmployee?.name}
                    </AlertTitle>
                    <p className="text-muted-foreground">
                      {selectedEmployee.email}
                    </p>
                  </div>
                </div>
              </Alert>
            )}
            {selectedEmployee && <Separator className="my-5" />}

            {page === 4 ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(1)}
                  disabled={loading}
                  className="w-full"
                  size={"lg"}
                  variant={"outline"}
                >
                  Edit
                </Button>
                {userId ? (
                  <Button
                    disabled={loading}
                    onClick={onSubmit}
                    className="w-full"
                    size={"lg"}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" size={"lg"}>
                        Sign In
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </DialogDescription>
                        <Social />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : (
              <Button
                disabled={loading}
                onClick={() => {
                  if (page === 2 && !selectedEmployee) {
                    toast.error("Select a professional.");
                  } else {
                    setPage(page + 1);
                  }
                }}
                className="w-full"
                size={"lg"}
              >
                Continue
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
