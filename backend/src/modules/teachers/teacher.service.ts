import { db } from "../../db/db.js";

import type {
  CreateTeacherInput,
  UpdateTeacherInput,
} from "./teacher.schema.js";

export class TeacherNotFoundError extends Error {
  constructor() {
    super("Teacher not found");
    this.name = "TeacherNotFoundError";
  }
}

export class TeacherConflictError extends Error {
  constructor(message = "Teacher code already exists") {
    super(message);
    this.name = "TeacherConflictError";
  }
}

export class TeacherEmailConflictError extends Error {
  constructor() {
    super("A user with this email already exists");
    this.name = "TeacherEmailConflictError";
  }
}

export async function listTeachers(instituteId: string) {
  return db.orm.public.Teacher.where({
    instituteId,
  }).all();
}

export async function getTeacher(
  instituteId: string,
  teacherId: string,
) {
  const teacher = await db.orm.public.Teacher.first({
    id: teacherId,
    instituteId,
  });

  if (!teacher) {
    throw new TeacherNotFoundError();
  }

  return teacher;
}