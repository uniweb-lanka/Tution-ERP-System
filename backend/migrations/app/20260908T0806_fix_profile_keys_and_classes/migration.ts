#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/c87f6a1e24160c54a6bbbda6f31b3a6bde6a2dd752409f9a5b9ee43ae2d2028a/contract';
import startContract from '../../snapshots/c87f6a1e24160c54a6bbbda6f31b3a6bde6a2dd752409f9a5b9ee43ae2d2028a/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ec22e10fa939e17d205413381d9efe8b0589e0cac6414950290bfad274ce419c/contract';
import endContract from '../../snapshots/ec22e10fa939e17d205413381d9efe8b0589e0cac6414950290bfad274ce419c/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'class',
        columns: [
          col('capacity', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('deliveryMode', 'text', {
            notNull: true,
            default: lit('physical'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('endsAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('gradeId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('monthlyFee', 'numeric', { codecRef: { codecId: 'pg/numeric@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startsAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('draft'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('streamId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('subjectId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('teacherId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'class_deliveryMode_check_338a3585',
            "\"deliveryMode\" IN ('physical', 'online', 'hybrid')",
          ),
          checkExpression(
            'class_status_check_27abb986',
            "\"status\" IN ('draft', 'active', 'completed', 'cancelled', 'archived')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'classSchedule',
        columns: [
          col('classId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('day', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endTime', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('meetingUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('room', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('startTime', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'classSchedule_day_check_f83ed58f',
            "\"day\" IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'class',
        constraint: 'class_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'class',
        constraint: 'class_instituteId_code_key',
        columns: ['instituteId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'staff',
        constraint: 'staff_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'teacher',
        constraint: 'teacher_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_gradeId_instituteId_idx_56f3467e',
        columns: ['gradeId', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_instituteId_teacherId_idx_9f20a59f',
        columns: ['instituteId', 'teacherId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_streamId_instituteId_idx_d0a04fd3',
        columns: ['streamId', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_subjectId_instituteId_idx_f3e4bf11',
        columns: ['subjectId', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_teacherId_instituteId_idx_7a29c5c9',
        columns: ['teacherId', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classSchedule',
        index: 'classSchedule_classId_instituteId_idx_4bc20ca6',
        columns: ['classId', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classSchedule',
        index: 'classSchedule_instituteId_classId_idx_c38ab17c',
        columns: ['instituteId', 'classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classSchedule',
        index: 'classSchedule_instituteId_day_idx_95b847e5',
        columns: ['instituteId', 'day'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'class',
        foreignKey: {
          name: 'class_teacherId_instituteId_fkey',
          columns: ['teacherId', 'instituteId'],
          references: { schema: 'public', table: 'teacher', columns: ['id', 'instituteId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'class',
        foreignKey: {
          name: 'class_subjectId_instituteId_fkey',
          columns: ['subjectId', 'instituteId'],
          references: { schema: 'public', table: 'subject', columns: ['id', 'instituteId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'class',
        foreignKey: {
          name: 'class_gradeId_instituteId_fkey',
          columns: ['gradeId', 'instituteId'],
          references: { schema: 'public', table: 'grade', columns: ['id', 'instituteId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'class',
        foreignKey: {
          name: 'class_streamId_instituteId_fkey',
          columns: ['streamId', 'instituteId'],
          references: { schema: 'public', table: 'stream', columns: ['id', 'instituteId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classSchedule',
        foreignKey: {
          name: 'classSchedule_classId_instituteId_fkey',
          columns: ['classId', 'instituteId'],
          references: { schema: 'public', table: 'class', columns: ['id', 'instituteId'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
