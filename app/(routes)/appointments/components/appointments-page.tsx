"use client";

import { Business, User } from "@prisma/client";
import { AppointmentForm } from "./appointment-form";
import Avatar from "@/app/images.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AppointmentProps } from "@/types";

export const AppointmentsPage = ({
  appointments,
}: {
  appointments: AppointmentProps[];
}) => {
  const [loading, setLoading] = useState(false);
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "UPCOMING"
  );
  const paidAppointments = appointments.filter(
    (appointment) => appointment.status === "PAID"
  );
  const canceledAppointments = appointments.filter(
    (appointment) => appointment.status === "CANCELED"
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentProps>(upcomingAppointments[0] || paidAppointments[0]);
  const router = useRouter();

  const onCancel = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/appointments/api/${selectedAppointment.id}/`,
        {
          status: "CANCELED",
        }
      );
      if (response.status === 200) {
        toast.success("Appointment Canceled!");
        window.location.reload();
      }
    } catch (err) {
      console.log("[APPOINTMENT_CANCEL]", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl my-10">
        <div className="ml-5 md:ml-0">
          <h1 className="text-2xl font-semibold">Appointments</h1>
        </div>
        <div className="w-full flex justify-center md:justify-between mt-7">
          <div className="flex flex-col space-y-3">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">Upcoming</h2>
                <div className="w-6 h-6 font-semibold rounded-full bg-violet-500 flex items-center text-white justify-center">
                  {upcomingAppointments.length}
                </div>
              </div>
              <Separator className="md:hidden mt-2" />
              <div className="flex flex-col space-y-3 mt-5">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentForm
                    selectedAppointment={selectedAppointment}
                    setSelectedAppointment={() =>
                      setSelectedAppointment(appointment)
                    }
                    className={`${
                      appointment.id === selectedAppointment?.id &&
                      "border-black shadow-lg"
                    }`}
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">Paid</h2>
                <div className="w-6 h-6 font-semibold rounded-full bg-violet-500 flex items-center text-white justify-center">
                  {paidAppointments.length}
                </div>
              </div>
              <Separator className="md:hidden mt-2" />
              <div className="flex flex-col space-y-3 mt-5">
                {paidAppointments.map((appointment) => (
                  <AppointmentForm
                    selectedAppointment={selectedAppointment}
                    setSelectedAppointment={() =>
                      setSelectedAppointment(appointment)
                    }
                    className={`${
                      appointment.id === selectedAppointment?.id &&
                      " border-black shadow-lg"
                    }`}
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">Canceled</h2>
                <div className="w-6 h-6 font-semibold rounded-full bg-violet-500 flex items-center text-white justify-center">
                  {canceledAppointments.length}
                </div>
              </div>
              <Separator className="md:hidden mt-2" />
              <div className="flex flex-col space-y-3 mt-5">
                {canceledAppointments.map((appointment) => (
                  <AppointmentForm
                    selectedAppointment={selectedAppointment}
                    setSelectedAppointment={() =>
                      setSelectedAppointment(appointment)
                    }
                    className={`${
                      appointment.id === selectedAppointment?.id &&
                      " border-black shadow-lg"
                    }`}
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <Card className="shadow-none hidden md:block">
              {selectedAppointment?.business.image && (
                <Image
                  width={570}
                  height={400}
                  className="rounded-tr-lg rounded-tl-lg"
                  alt={selectedAppointment.business.name}
                  src={selectedAppointment?.business.image}
                />
              )}
              <CardContent className="pt-5">
                <Badge
                  variant={"outline"}
                  className={`text-white px-8 py-1 mb-4 ${
                    selectedAppointment.status === "CANCELED" &&
                    "bg-destructive"
                  } ${
                    selectedAppointment.status === "PAID" && "bg-emerald-500"
                  } ${
                    selectedAppointment.status === "UPCOMING" && "bg-yellow-500"
                  }`}
                >
                  {selectedAppointment.status}
                </Badge>
                <CardTitle className="text-2xl">
                  {format(selectedAppointment.date, "EEE, MMM d yyyy, HH:mm")}
                </CardTitle>
                <CardDescription>
                  {selectedAppointment.service.duration} duration
                </CardDescription>
                <div className="pt-5">
                  <CardTitle>Overview</CardTitle>
                  <div className="w-full flex items-center gap-2 pt-4">
                    <div>
                      <Image
                        width={50}
                        height={50}
                        className="rounded-full"
                        src={
                          selectedAppointment.employee.user?.image || Avatar.src
                        }
                        alt={selectedAppointment.employee.name}
                      />
                    </div>
                    <p className="font-semibold">
                      {selectedAppointment.employee.name}
                    </p>
                    <p>{selectedAppointment.employee.email}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="w-full flex items-center justify-between pt-4">
                  <div>
                    <p className="font-semibold">
                      {selectedAppointment.service.label}
                    </p>
                    <p>{selectedAppointment.service.description}</p>
                  </div>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(selectedAppointment.service.price)}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                {selectedAppointment.status !== "CANCELED" &&
                  selectedAppointment.status !== "PAID" && (
                    <Button
                      disabled={loading}
                      onClick={() => onCancel()}
                      size={"lg"}
                      variant={"destructive"}
                      className="w-full"
                    >
                      {loading ? (
                        <span className="loading loading-dots loading-md"></span>
                      ) : (
                        <>
                          {" "}
                          <Ban />
                          Cancel
                        </>
                      )}
                    </Button>
                  )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
