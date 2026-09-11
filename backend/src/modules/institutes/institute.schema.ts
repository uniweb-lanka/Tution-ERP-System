import { z } from "zod";

export const updateInstituteSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),

  email: z.string().trim().email().optional(),

  phone: z.string().trim().max(30).optional(),

  timezone: z.string().trim().min(1).max(100).optional(),

  currency: z.string().trim().length(3).optional(),
});

export type UpdateInstituteInput = z.infer<typeof updateInstituteSchema>;
