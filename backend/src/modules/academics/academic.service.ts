import { db } from "../../db/db.js";

import type {
  CreateEducationLevelInput,
  UpdateEducationLevelInput,
  CreateGradeInput,
  UpdateGradeInput,
  CreateStreamInput,
  UpdateStreamInput,
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

export async function listEducationLevels(instituteId: string) {
  return db.orm.public.EducationLevel.where({
    instituteId,
  }).all();
}

export async function getEducationLevel(
  instituteId: string,
  educationLevelId: string,
) {
  const educationLevel = await db.orm.public.EducationLevel.first({
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
  const existing = await db.orm.public.EducationLevel.first({
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
  const educationLevel = await db.orm.public.EducationLevel.first({
    id: educationLevelId,
    instituteId,
  });

  if (!educationLevel) {
    throw new EducationLevelNotFoundError();
  }

  if (input.code !== undefined && input.code !== educationLevel.code) {
    const existing = await db.orm.public.EducationLevel.first({
      instituteId,
      code: input.code,
    });

    if (existing && existing.id !== educationLevelId) {
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

  return db.orm.public.EducationLevel.where({
    id: educationLevelId,
    instituteId,
  }).update(updateData);
}

export class GradeNotFoundError extends Error {
  constructor() {
    super("Grade not found");
    this.name = "GradeNotFoundError";
  }
}

export class GradeConflictError extends Error {
  constructor(message = "Grade code already exists") {
    super(message);
    this.name = "GradeConflictError";
  }
}

export class EducationLevelForGradeNotFoundError extends Error {
  constructor() {
    super("Education level not found");
    this.name = "EducationLevelForGradeNotFoundError";
  }
}

export async function listGrades(instituteId: string) {
  return db.orm.public.Grade.where({
    instituteId,
  }).all();
}

export async function getGrade(instituteId: string, gradeId: string) {
  const grade = await db.orm.public.Grade.first({
    id: gradeId,
    instituteId,
  });

  if (!grade) {
    throw new GradeNotFoundError();
  }

  return grade;
}

export async function createGrade(
  instituteId: string,
  input: CreateGradeInput,
) {
  /*
   * Verify that the Education Level belongs
   * to the same institute.
   */
  const educationLevel = await db.orm.public.EducationLevel.first({
    id: input.educationLevelId,
    instituteId,
  });

  if (!educationLevel) {
    throw new EducationLevelForGradeNotFoundError();
  }

  /*
   * Grade codes are unique inside one institute.
   */
  const existing = await db.orm.public.Grade.first({
    instituteId,
    code: input.code,
  });

  if (existing) {
    throw new GradeConflictError();
  }

  return db.orm.public.Grade.create({
    instituteId,
    educationLevelId: input.educationLevelId,
    name: input.name,
    code: input.code,
    displayOrder: input.displayOrder,
  });
}

export async function updateGrade(
  instituteId: string,
  gradeId: string,
  input: UpdateGradeInput,
) {
  const grade = await db.orm.public.Grade.first({
    id: gradeId,
    instituteId,
  });

  if (!grade) {
    throw new GradeNotFoundError();
  }

  /*
   * If the education level is changing,
   * make sure the new education level belongs
   * to this same institute.
   */
  if (
    input.educationLevelId !== undefined &&
    input.educationLevelId !== grade.educationLevelId
  ) {
    const educationLevel = await db.orm.public.EducationLevel.first({
      id: input.educationLevelId,
      instituteId,
    });

    if (!educationLevel) {
      throw new EducationLevelForGradeNotFoundError();
    }
  }

  /*
   * Check duplicate grade code.
   */
  if (input.code !== undefined && input.code !== grade.code) {
    const existing = await db.orm.public.Grade.first({
      instituteId,
      code: input.code,
    });

    if (existing && existing.id !== gradeId) {
      throw new GradeConflictError();
    }
  }

  const updateData: {
    educationLevelId?: string;
    name?: string;
    code?: string;
    displayOrder?: number;
    status?: "active" | "inactive";
  } = {};

  if (input.educationLevelId !== undefined) {
    updateData.educationLevelId = input.educationLevelId;
  }

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

  return db.orm.public.Grade.where({
    id: gradeId,
    instituteId,
  }).update(updateData);
}

export class StreamNotFoundError extends Error {
  constructor() {
    super("Stream not found");
    this.name = "StreamNotFoundError";
  }
}

export class StreamConflictError extends Error {
  constructor(message = "Stream code already exists") {
    super(message);
    this.name = "StreamConflictError";
  }
}

export async function listStreams(instituteId: string) {
  return db.orm.public.Stream.where({
    instituteId,
  }).all();
}

export async function getStream(instituteId: string, streamId: string) {
  const stream = await db.orm.public.Stream.first({
    id: streamId,
    instituteId,
  });

  if (!stream) {
    throw new StreamNotFoundError();
  }

  return stream;
}

export async function createStream(
  instituteId: string,
  input: CreateStreamInput,
) {
  /*
   * Stream belongs directly to the institute.
   * The current Prisma contract does not have gradeId
   * on the Stream model.
   */

  const existing = await db.orm.public.Stream.first({
    instituteId,
    code: input.code,
  });

  if (existing) {
    throw new StreamConflictError();
  }

  return db.orm.public.Stream.create({
    instituteId,
    name: input.name,
    code: input.code,
    displayOrder: input.displayOrder,
  });
}

export async function updateStream(
  instituteId: string,
  streamId: string,
  input: UpdateStreamInput,
) {
  const stream = await db.orm.public.Stream.first({
    id: streamId,
    instituteId,
  });

  if (!stream) {
    throw new StreamNotFoundError();
  }

  /*
   * Check duplicate stream code.
   */
  if (input.code !== undefined && input.code !== stream.code) {
    const existing = await db.orm.public.Stream.first({
      instituteId,
      code: input.code,
    });

    if (existing && existing.id !== streamId) {
      throw new StreamConflictError();
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

  return db.orm.public.Stream.where({
    id: streamId,
    instituteId,
  }).update(updateData);
}
