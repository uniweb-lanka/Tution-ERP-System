#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/c3380ed42aaa785d416b8f82665ef2e9e99e10689c3c927d6437e87321235cd4/contract';
import startContract from '../../snapshots/c3380ed42aaa785d416b8f82665ef2e9e99e10689c3c927d6437e87321235cd4/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ebaaeddf74779e4d1a1f79c04c1ad164fa2064db28fc15b9bdad98810f97e6e9/contract';
import endContract from '../../snapshots/ebaaeddf74779e4d1a1f79c04c1ad164fa2064db28fc15b9bdad98810f97e6e9/contract.json' with { type: 'json' };
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
        table: 'staff',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('deletedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('joinedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('leftAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('membershipId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('staffCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('staffType', 'text', {
            notNull: true,
            default: lit('support'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('active'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'staff_staffType_check_d8b58671',
            "\"staffType\" IN ('admin', 'accountant', 'receptionist', 'manager', 'support', 'other')",
          ),
          checkExpression(
            'staff_status_check_350ef39a',
            "\"status\" IN ('active', 'inactive', 'suspended', 'left')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'student',
        columns: [
          col('admissionAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('dateOfBirth', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('deletedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('gender', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('membershipId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('active'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'student_gender_check_4048f77b',
            "\"gender\" IN ('male', 'female', 'other', 'prefer_not_to_say')",
          ),
          checkExpression(
            'student_status_check_350ef39a',
            "\"status\" IN ('active', 'inactive', 'suspended', 'left')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'teacher',
        columns: [
          col('bio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('deletedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('joinedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('leftAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('membershipId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('qualification', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('specialization', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('active'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('teacherCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('teacherType', 'text', {
            notNull: true,
            default: lit('part_time'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'teacher_status_check_350ef39a',
            "\"status\" IN ('active', 'inactive', 'suspended', 'left')",
          ),
          checkExpression(
            'teacher_teacherType_check_78ab743c',
            "\"teacherType\" IN ('permanent', 'part_time', 'visiting', 'contract')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'instituteMembership',
        constraint: 'instituteMembership_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'staff',
        constraint: 'staff_membershipId_instituteId_key',
        columns: ['membershipId', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'staff',
        constraint: 'staff_instituteId_staffCode_key',
        columns: ['instituteId', 'staffCode'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_membershipId_instituteId_key',
        columns: ['membershipId', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_instituteId_studentCode_key',
        columns: ['instituteId', 'studentCode'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'teacher',
        constraint: 'teacher_membershipId_instituteId_key',
        columns: ['membershipId', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'teacher',
        constraint: 'teacher_instituteId_teacherCode_key',
        columns: ['instituteId', 'teacherCode'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'staff',
        index: 'staff_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'student',
        index: 'student_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'teacher',
        index: 'teacher_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'staff',
        foreignKey: {
          name: 'staff_membershipId_instituteId_fkey',
          columns: ['membershipId', 'instituteId'],
          references: {
            schema: 'public',
            table: 'instituteMembership',
            columns: ['id', 'instituteId'],
          },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'student',
        foreignKey: {
          name: 'student_membershipId_instituteId_fkey',
          columns: ['membershipId', 'instituteId'],
          references: {
            schema: 'public',
            table: 'instituteMembership',
            columns: ['id', 'instituteId'],
          },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'teacher',
        foreignKey: {
          name: 'teacher_membershipId_instituteId_fkey',
          columns: ['membershipId', 'instituteId'],
          references: {
            schema: 'public',
            table: 'instituteMembership',
            columns: ['id', 'instituteId'],
          },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
