"use client";

import { z } from "zod";

export const dayWorkingHours = z.object({
  start: z.string(),
  end: z.string(),
  open: z.boolean(),
});

export const weekWorkingHours = z.object({
  monday: dayWorkingHours,
  tuesday: dayWorkingHours,
  wednesday: dayWorkingHours,
  thursday: dayWorkingHours,
  friday: dayWorkingHours,
  saturday: dayWorkingHours,
  sunday: dayWorkingHours,
});

export const businessSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required!" })
    .max(50, { message: "Name can contain only 50 characters" }),
  address: z
    .string()
    .min(1, { message: "Address is required!" })
    .max(50, { message: "Address can contain only 50 characters" }),
  type: z
    .string()
    .min(1, { message: "Type is required!" })
    .max(50, { message: "Type can contain only 50 characters" }),
  workingHours: weekWorkingHours,
});

export const serviceSchema = z.object({
  label: z
    .string()
    .min(1, { message: "Service title is required!" })
    .max(50, { message: "Service title can contain only 50 characters" }),
  description: z
    .string()
    .min(1, { message: "Serivce description is required!" })
    .max(50, { message: "Service description can contain only 50 characters" }),
  price: z.coerce.number(),
  duration: z
    .string()
    .min(1, { message: "Serivce duration is required!" })
    .max(50, { message: "Service duration can contain only 50 characters" }),
});

export const customerSchema = z.object({
  name: z.string().min(1).max(50),
  phone: z.string().min(1).max(50),
  email: z.string().min(1),
});

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Employee name is required!" })
    .max(50, { message: "Employee name can contain only 50 characters" }),
  email: z
    .string()
    .min(1, { message: "Employee email is required!" })
    .max(50, { message: "Employee email can contain only 50 characters" }),
});

export const businessRegisterSchema = z.object({
  business: businessSchema,
  services: serviceSchema, // Assuming multiple services can be registered
  employees: employeeSchema, // Assuming multiple employees can be registered
});

export const businessUpdateSchema = z.object({
  business: businessSchema,
});

export const appointmentSchema = z.object({
  date: z.date(),
  time: z.string(),
  customer: customerSchema,
  serviceId: z.string().min(1).max(50),
  employeeId: z.string().min(1).max(50),
});
