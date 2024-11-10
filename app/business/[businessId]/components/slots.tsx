"use client";
import { Appointment, WorkingHours } from "@prisma/client";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useGenerateHours } from "../book/hooks/generate-hours";

export const BusinessDaySlots = ({
  filteredDays,
  workingHours,
  employee,
  appointments,
  sendDay,
  sendTime,
}: {
  filteredDays: Date[];
  workingHours: WorkingHours;
  employee?: string;
  appointments: Appointment[];
  sendDay: (data: Date) => void;
  sendTime: (data: string) => void;
}) => {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("");

  const workingHoursByDay = [
    { start: workingHours?.sundayStart, end: workingHours?.sundayEnd },
    { start: workingHours?.mondayStart, end: workingHours?.mondayEnd },
    { start: workingHours?.tuesdayStart, end: workingHours?.tuesdayEnd },
    { start: workingHours?.wednesdayStart, end: workingHours?.wednesdayEnd },
    { start: workingHours?.thursdayStart, end: workingHours?.thursdayEnd },
    { start: workingHours?.fridayStart, end: workingHours?.fridayEnd },
    { start: workingHours?.saturdayStart, end: workingHours?.saturdayEnd },
  ];

  useEffect(() => {
    sendDay(selectedDay);
    sendTime(selectedTime);
  }, [selectedTime, selectedDay]);

  const dayIndex = selectedDay.getDay();
  const { start: startTime, end: endTime } = workingHoursByDay[dayIndex];

  const timeSlots: string[] = [];
  const times = useGenerateHours({
    interval: 30,
    employee,
    startTime: startTime || "",
    endTime: endTime || "",
    selectedDay,
    appointments,
  });
  if (startTime && endTime) {
    let startTimeDate = new Date(selectedDay);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    startTimeDate.setHours(startHour, startMinute, 0, 0);

    const endTimeDate = new Date(selectedDay);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    endTimeDate.setHours(endHour, endMinute, 0, 0);
    while (startTimeDate <= endTimeDate) {
      const timeString = format(startTimeDate, "HH:mm");
      timeSlots.push(timeString);
      startTimeDate = new Date(startTimeDate.getTime() + 30 * 60 * 1000);
    }
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-semibold mb-5">
        {format(selectedDay, "EEEE, MMMM d, yyyy")}, {selectedTime}
      </h1>
      <div className="w-full max-w-lg overflow-x-auto flex flex-row gap-3 hide-scrollbar">
        {filteredDays.map((day, index) => (
          <div
            onClick={() => {
              setSelectedDay(day);
              setSelectedTime("");
            }}
            key={index}
          >
            <div
              className={`w-16 h-16 rounded-full border ${
                format(selectedDay, "yyyy-MM-dd") ===
                  format(day, "yyyy-MM-dd") && "bg-black text-white"
              } flex items-center text-lg font-semibold justify-center ${
                format(selectedDay, "yyyy-MM-dd") !==
                  format(day, "yyyy-MM-dd") && "hover:bg-slate-300/30"
              } ease-linear duration-150 cursor-pointer`}
            >
              {format(day, "dd")}
            </div>
            <div className="text-center font-medium">{format(day, "EEE")}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col mt-4 max-h-[500px] overflow-y-auto hide-scrollbar">
        {times.length > 0 ? (
          times.map((slot, index) => (
            <div
              key={index}
              onClick={() => setSelectedTime(slot)}
              className={`px-2 py-3 border ${
                selectedTime === slot && "border-black border-1"
              } rounded-md mb-3 hover:bg-primary-foreground ease-linear duration-150 cursor-pointer`}
            >
              {slot}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No available slots</div>
        )}
      </div>
    </div>
  );
};
