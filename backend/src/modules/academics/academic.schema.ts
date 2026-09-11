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

  displayOrder: z.number().int().min(0).default(0),
});

export const updateEducationLevelSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  code: academicCodeSchema.optional(),

  displayOrder: z.number().int().min(0).optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateEducationLevelInput = z.infer<
  typeof createEducationLevelSchema
>;

export type UpdateEducationLevelInput = z.infer<
  typeof updateEducationLevelSchema
>;

export const createGradeSchema = z.object({
  educationLevelId: z.string().uuid(),

  name: z.string().trim().min(1).max(100),

  code: academicCodeSchema,

  displayOrder: z.number().int().min(0).default(0),
});

export const updateGradeSchema = z.object({
  educationLevelId: z.string().uuid().optional(),

  name: z.string().trim().min(1).max(100).optional(),

  code: academicCodeSchema.optional(),

  displayOrder: z.number().int().min(0).optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateGradeInput = z.infer<typeof createGradeSchema>;

export type UpdateGradeInput = z.infer<typeof updateGradeSchema>;

export const createStreamSchema = z.object({
  name: z.string().trim().min(1).max(100),

  code: academicCodeSchema,

  displayOrder: z.number().int().min(0).default(0),
});

export const updateStreamSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),

  code: academicCodeSchema.optional(),

  displayOrder: z.number().int().min(0).optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateStreamInput = z.infer<typeof createStreamSchema>;

export type UpdateStreamInput = z.infer<typeof updateStreamSchema>;
