#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0e5bebced7f2a03afefe923d234e86bfbea439d6cfaffb36ae603e0655fb9b03/contract';
import endContract from '../../snapshots/0e5bebced7f2a03afefe923d234e86bfbea439d6cfaffb36ae603e0655fb9b03/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ec22e10fa939e17d205413381d9efe8b0589e0cac6414950290bfad274ce419c/contract';
import startContract from '../../snapshots/ec22e10fa939e17d205413381d9efe8b0589e0cac6414950290bfad274ce419c/contract.json' with { type: 'json' };
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
        table: 'enrollment',
        columns: [
          col('classId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('endedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('enrolledAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('active'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'enrollment_status_check_08674715',
            "\"status\" IN ('active', 'paused', 'completed', 'cancelled')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'enrollment',
        constraint: 'enrollment_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'enrollment',
        constraint: 'enrollment_studentId_classId_key',
        columns: ['studentId', 'classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'enrollment',
        index: 'enrollment_classId_instituteId_idx_4bc20ca6',
        columns: ['classId', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'enrollment',
        index: 'enrollment_instituteId_classId_idx_c38ab17c',
        columns: ['instituteId', 'classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'enrollment',
        index: 'enrollment_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'enrollment',
        index: 'enrollment_instituteId_studentId_idx_aedbc27b',
        columns: ['instituteId', 'studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'enrollment',
        index: 'enrollment_studentId_instituteId_idx_77a018a9',
        columns: ['studentId', 'instituteId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'enrollment',
        foreignKey: {
          name: 'enrollment_studentId_instituteId_fkey',
          columns: ['studentId', 'instituteId'],
          references: { schema: 'public', table: 'student', columns: ['id', 'instituteId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'enrollment',
        foreignKey: {
          name: 'enrollment_classId_instituteId_fkey',
          columns: ['classId', 'instituteId'],
          references: { schema: 'public', table: 'class', columns: ['id', 'instituteId'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
