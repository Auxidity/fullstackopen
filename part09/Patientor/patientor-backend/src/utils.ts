import { Gender, HealthCheckRating } from "../types";
import { z } from "zod";

export const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().date(),
    ssn: z.string(),
    gender: z.nativeEnum(Gender),
    occupation: z.string(),
});

export const BaseEntrySchema = z.object({
    id: z.string(),
    description: z.string(),
    date: z.string().date(),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
    type: z.literal("Hospital"),
    discharge: z.object({
        date: z.string(),
        criteria: z.string(),
    }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string(),
    sickLeave: z
        .object({
            startDate: z.string().date(),
            endDate: z.string().date(),
        })
        .optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.nativeEnum(HealthCheckRating),
});

//It does accept empty strings... it only complains if the field is missing.
export const EntrySchema = z.union([
    HospitalEntrySchema,
    OccupationalHealthcareEntrySchema,
    HealthCheckEntrySchema,
]);
