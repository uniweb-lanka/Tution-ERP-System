#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/c87f6a1e24160c54a6bbbda6f31b3a6bde6a2dd752409f9a5b9ee43ae2d2028a/contract';
import endContract from '../../snapshots/c87f6a1e24160c54a6bbbda6f31b3a6bde6a2dd752409f9a5b9ee43ae2d2028a/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ebaaeddf74779e4d1a1f79c04c1ad164fa2064db28fc15b9bdad98810f97e6e9/contract';
import startContract from '../../snapshots/ebaaeddf74779e4d1a1f79c04c1ad164fa2064db28fc15b9bdad98810f97e6e9/contract.json' with { type: 'json' };
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
        table: 'educationLevel',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('displayOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
            'educationLevel_status_check_11063666',
            "\"status\" IN ('active', 'inactive')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'grade',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('displayOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('educationLevelId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
          checkExpression('grade_status_check_11063666', "\"status\" IN ('active', 'inactive')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'stream',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('displayOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
          checkExpression('stream_status_check_11063666', "\"status\" IN ('active', 'inactive')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'subject',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
          checkExpression('subject_status_check_11063666', "\"status\" IN ('active', 'inactive')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'educationLevel',
        constraint: 'educationLevel_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'educationLevel',
        constraint: 'educationLevel_instituteId_code_key',
        columns: ['instituteId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'grade',
        constraint: 'grade_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'grade',
        constraint: 'grade_instituteId_code_key',
        columns: ['instituteId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'stream',
        constraint: 'stream_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'stream',
        constraint: 'stream_instituteId_code_key',
        columns: ['instituteId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'subject',
        constraint: 'subject_id_instituteId_key',
        columns: ['id', 'instituteId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'subject',
        constraint: 'subject_instituteId_code_key',
        columns: ['instituteId', 'code'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'educationLevel',
        index: 'educationLevel_instituteId_idx_7d2fe6f2',
        columns: ['instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'educationLevel',
        index: 'educationLevel_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'grade',
        index: 'grade_educationLevelId_instituteId_idx_2e857e93',
        columns: ['educationLevelId', 'instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'grade',
        index: 'grade_instituteId_educationLevelId_idx_93a7c5a6',
        columns: ['instituteId', 'educationLevelId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'grade',
        index: 'grade_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'stream',
        index: 'stream_instituteId_idx_7d2fe6f2',
        columns: ['instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'stream',
        index: 'stream_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'subject',
        index: 'subject_instituteId_idx_7d2fe6f2',
        columns: ['instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'subject',
        index: 'subject_instituteId_status_idx_b5328fd7',
        columns: ['instituteId', 'status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'educationLevel',
        foreignKey: {
          name: 'educationLevel_instituteId_fkey',
          columns: ['instituteId'],
          references: { schema: 'public', table: 'institute', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'grade',
        foreignKey: {
          name: 'grade_educationLevelId_instituteId_fkey',
          columns: ['educationLevelId', 'instituteId'],
          references: { schema: 'public', table: 'educationLevel', columns: ['id', 'instituteId'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'stream',
        foreignKey: {
          name: 'stream_instituteId_fkey',
          columns: ['instituteId'],
          references: { schema: 'public', table: 'institute', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'subject',
        foreignKey: {
          name: 'subject_instituteId_fkey',
          columns: ['instituteId'],
          references: { schema: 'public', table: 'institute', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
