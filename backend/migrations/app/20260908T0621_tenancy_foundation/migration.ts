#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/9cdcf3a74fb010db3192c639ad10bce68ef3a0a21875d75f0c16e1a8392a2ca7/contract';
import startContract from '../../snapshots/9cdcf3a74fb010db3192c639ad10bce68ef3a0a21875d75f0c16e1a8392a2ca7/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c3380ed42aaa785d416b8f82665ef2e9e99e10689c3c927d6437e87321235cd4/contract';
import endContract from '../../snapshots/c3380ed42aaa785d416b8f82665ef2e9e99e10689c3c927d6437e87321235cd4/contract.json' with { type: 'json' };
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
      this.dropTable({ schema: 'public', table: 'test' }),
      this.createTable({
        schema: 'public',
        table: 'institute',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('currency', 'text', {
            notNull: true,
            default: lit('LKR'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('trial'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('timezone', 'text', {
            notNull: true,
            default: lit('Asia/Colombo'),
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
            'institute_status_check_80c94e51',
            "\"status\" IN ('active', 'inactive', 'suspended', 'trial')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'instituteMembership',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('instituteId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('joinedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('invited'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'instituteMembership_role_check_9fa475f7',
            "\"role\" IN ('owner', 'staff', 'teacher', 'student')",
          ),
          checkExpression(
            'instituteMembership_status_check_d192a39b',
            "\"status\" IN ('active', 'invited', 'suspended', 'inactive')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('deletedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('firstName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPlatformAdmin', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lastName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'institute',
        constraint: 'institute_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'instituteMembership',
        constraint: 'instituteMembership_instituteId_userId_key',
        columns: ['instituteId', 'userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'institute',
        index: 'institute_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'instituteMembership',
        index: 'instituteMembership_instituteId_idx_7d2fe6f2',
        columns: ['instituteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'instituteMembership',
        index: 'instituteMembership_instituteId_role_idx_8c2d6a2e',
        columns: ['instituteId', 'role'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'instituteMembership',
        index: 'instituteMembership_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'instituteMembership',
        foreignKey: {
          name: 'instituteMembership_instituteId_fkey',
          columns: ['instituteId'],
          references: { schema: 'public', table: 'institute', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'instituteMembership',
        foreignKey: {
          name: 'instituteMembership_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
