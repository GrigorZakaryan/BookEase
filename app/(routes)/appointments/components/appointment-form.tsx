"use client";
import { Alert } from "@/components/ui/alert";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Business, Employee, Service, User } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Avatar from "@/app/images.png";
import { Separator } from "@/components/ui/separator";
import { AppointmentProps } from "@/types";

export const AppointmentForm = ({
  appointment,
  className,
  selectedAppointment,
  setSelectedAppointment,
}: {
  appointment: AppointmentProps;
  className?: string;
  selectedAppointment: AppointmentProps;
  setSelectedAppointment: () => void;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(false);

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

  if (isDesktop) {
    return (
      <Alert
        onClick={setSelectedAppointment}
        className={`${className} p-0 md:pr-5 rounded-md flex flex-col md:flex-row md:space-x-4 md:items-center ease-linear duration-200 cursor-pointer hover:shadow-md`}
      >
        {appointment.business.image && (
          <Image
            className="rounded-tl-sm rounded-tr-sm w-full md:w-[200px]"
            width={200}
            height={200}
            src={appointment.business.image}
            alt={appointment.business.name}
          />
        )}
        <div className="pl-5 md:pl-0 py-3 md:py-0">
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
  } else {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Alert
            onClick={setSelectedAppointment}
            className={`${className} p-0 md:pr-5 rounded-md flex flex-col md:flex-row md:space-x-4 md:items-center ease-linear duration-200 cursor-pointer hover:shadow-md`}
          >
            {appointment.business.image && (
              <Image
                className="rounded-tl-sm rounded-tr-sm w-full md:w-[200px]"
                width={200}
                height={200}
                src={appointment.business.image}
                alt={appointment.business.name}
              />
            )}
            <div className="pl-5 md:pl-0 py-3 md:py-0">
              <h1 className="text-lg font-semibold">
                {appointment.business.name}
              </h1>
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
        </DrawerTrigger>
        <DrawerContent className="px-2">
          <DrawerHeader>
            <DrawerTitle>Appointment Info</DrawerTitle>
          </DrawerHeader>
          <div className="flex items-center justify-center">
            {selectedAppointment.business.image && (
              <Image
                width={200}
                height={200}
                alt="Image"
                src={selectedAppointment.business.image}
                className="rounded-md w-full px-4"
              />
            )}
          </div>
          <div className="pl-5 md:pl-0 py-3 md:py-0">
            <Badge
              variant={"outline"}
              className={`text-white px-8 py-1 mb-4 ${
                selectedAppointment.status === "CANCELED" && "bg-destructive"
              } ${selectedAppointment.status === "PAID" && "bg-emerald-500"} ${
                selectedAppointment.status === "UPCOMING" && "bg-yellow-500"
              }`}
            >
              {selectedAppointment.status}
            </Badge>
            <p className="text-xl font-semibold">
              {format(appointment.date, "EEE, MMM d yyyy, HH:mm")}
            </p>
            <p className="text-muted-foreground">
              {selectedAppointment.service.duration} duration
            </p>
            <h2 className="font-semibold mt-2">Overview</h2>
            <div className="w-full flex items-center gap-2 pt-4">
              <div>
                <Image
                  width={50}
                  height={50}
                  className="rounded-full"
                  src={selectedAppointment.employee.user?.image || Avatar.src}
                  alt={selectedAppointment.employee.name}
                />
              </div>
              <div>
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
          </div>
          <DrawerFooter>
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
                  <Ban />
                  Cancel
                </>
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
};
