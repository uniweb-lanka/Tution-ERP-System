import { db } from "../../db/db.js";
import type { UpdateInstituteInput } from "./institute.schema.js";

export class InstituteNotFoundError extends Error {
  constructor() {
    super("Institute not found");
    this.name = "InstituteNotFoundError";
  }
}

export async function getInstituteById(instituteId: string) {
  const institute = await db.orm.public.Institute.first({
    id: instituteId,
  });

  if (!institute) {
    throw new InstituteNotFoundError();
  }

  return institute;
}

export async function updateInstitute(
  instituteId: string,
  input: UpdateInstituteInput,
) {
  const institute = await db.orm.public.Institute.first({
    id: instituteId,
  });

  if (!institute) {
    throw new InstituteNotFoundError();
  }

  const updateData: {
    name?: string;
    email?: string;
    phone?: string;
    timezone?: string;
    currency?: string;
  } = {};

  if (input.name !== undefined) {
    updateData.name = input.name;
  }

  if (input.email !== undefined) {
    updateData.email = input.email;
  }

  if (input.phone !== undefined) {
    updateData.phone = input.phone;
  }

  if (input.timezone !== undefined) {
    updateData.timezone = input.timezone;
  }

  if (input.currency !== undefined) {
    updateData.currency = input.currency;
  }

  return db.orm.public.Institute.where({
    id: instituteId,
  }).update(updateData);
}
