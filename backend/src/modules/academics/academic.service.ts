import { db } from "../../db/db.js";

import type {
  CreateEducationLevelInput,
  UpdateEducationLevelInput,
} from "./academic.schema.js";

export class EducationLevelNotFoundError extends Error {
  constructor() {
    super("Education level not found");
    this.name = "EducationLevelNotFoundError";
  }
}

export class EducationLevelConflictError extends Error {
  constructor(message = "Education level code already exists") {
    super(message);
    this.name = "EducationLevelConflictError";
  }
}

export async function listEducationLevels(
  instituteId: string,
) {
  return db.orm.public.EducationLevel
    .where({
      instituteId,
    })
    .all();
}

export async function getEducationLevel(
  instituteId: string,
  educationLevelId: string,
) {
  const educationLevel =
    await db.orm.public.EducationLevel.first({
      id: educationLevelId,
      instituteId,
    });

  if (!educationLevel) {
    throw new EducationLevelNotFoundError();
  }

  return educationLevel;
}

export async function createEducationLevel(
  instituteId: string,
  input: CreateEducationLevelInput,
) {
  const existing =
    await db.orm.public.EducationLevel.first({
      instituteId,
      code: input.code,
    });

  if (existing) {
    throw new EducationLevelConflictError();
  }

  return db.orm.public.EducationLevel.create({
    instituteId,
    name: input.name,
    code: input.code,
    displayOrder: input.displayOrder,
  });
}

export async function updateEducationLevel(
  instituteId: string,
  educationLevelId: string,
  input: UpdateEducationLevelInput,
) {
  const educationLevel =
    await db.orm.public.EducationLevel.first({
      id: educationLevelId,
      instituteId,
    });

  if (!educationLevel) {
    throw new EducationLevelNotFoundError();
  }

  if (
    input.code !== undefined &&
    input.code !== educationLevel.code
  ) {
    const existing =
      await db.orm.public.EducationLevel.first({
        instituteId,
        code: input.code,
      });

    if (
      existing &&
      existing.id !== educationLevelId
    ) {
      throw new EducationLevelConflictError();
    }
  }

  const updateData: {
    name?: string;
    code?: string;
    displayOrder?: number;
    status?: "active" | "inactive";
  } = {};

  if (input.name !== undefined) {
    updateData.name = input.name;
  }

  if (input.code !== undefined) {
    updateData.code = input.code;
  }

  if (input.displayOrder !== undefined) {
    updateData.displayOrder = input.displayOrder;
  }

  if (input.status !== undefined) {
    updateData.status = input.status;
  }

  return db.orm.public.EducationLevel
    .where({
      id: educationLevelId,
      instituteId,
    })
    .update(updateData);
}