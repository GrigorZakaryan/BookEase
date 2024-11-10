"use client";
import { useState, useEffect } from "react";
import { Appointment } from "@prisma/client";

export const useGenerateHours = ({
  interval,
  appointments,
  employee,
  selectedDay,
  startTime,
  endTime,
}: {
  interval: number;
  employee?: string;
  appointments: Appointment[];
  selectedDay: Date;
  startTime: string;
  endTime: string;
}) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    const generateAvailableSlots = () => {
      const slots: string[] = [];
      const bookedTimesForDate = appointments
        .filter(
          (appointment) =>
            appointment.employeeId === employee &&
            new Date(appointment.date).toDateString() ===
              selectedDay.toDateString()
        )
        .map((appointment) =>
          new Date(appointment.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        );

      let startTimeDate = new Date(selectedDay);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      startTimeDate.setHours(startHour, startMinute, 0, 0);

      const endTimeDate = new Date(selectedDay);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      endTimeDate.setHours(endHour, endMinute, 0, 0);

      const currentTime = new Date();

      if (
        currentTime.toDateString() === startTimeDate.toDateString() &&
        currentTime > startTimeDate
      ) {
        const currentMinutes = currentTime.getMinutes();
        const nextInterval = interval - (currentMinutes % interval);
        startTimeDate = new Date();
        startTimeDate.setMinutes(currentTime.getMinutes() + nextInterval);
      }

      while (startTimeDate <= endTimeDate) {
        const hours = startTimeDate.getHours().toString().padStart(2, "0");
        const minutes = startTimeDate.getMinutes().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}`;

        if (!bookedTimesForDate.includes(timeString)) {
          slots.push(timeString);
        }

        startTimeDate.setMinutes(startTimeDate.getMinutes() + interval);
      }

      setAvailableSlots(slots);
    };

    generateAvailableSlots();
  }, [appointments, employee, interval, selectedDay, startTime, endTime]);

  return availableSlots;
};
