import { z } from "zod";

const academicCodeSchema = z
  .string()
  .trim()
  .min(1)
  .max(30)
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "Code can contain only letters, numbers, hyphens, and underscores",
  )
  .transform((value) => value.toUpperCase());

export const createEducationLevelSchema = z.object({
  name: z.string().trim().min(2).max(100),

  code: academicCodeSchema,

  displayOrder: z
    .number()
    .int()
    .min(0)
    .default(0),
});

export const updateEducationLevelSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  code: academicCodeSchema.optional(),

  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional(),

  status: z
    .enum(["active", "inactive"])
    .optional(),
});

export type CreateEducationLevelInput =
  z.infer<typeof createEducationLevelSchema>;

export type UpdateEducationLevelInput =
  z.infer<typeof updateEducationLevelSchema>;