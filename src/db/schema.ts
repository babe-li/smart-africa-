import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  phone: text('phone'),
  location: text('location'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'security_logs' table.
export const securityLogs = pgTable('security_logs', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  detail: text('detail').notNull(),
  payloadSnippet: text('payload_snippet'),
});

// Define the 'biometric_attempt_logs' table.
export const biometricAttemptLogs = pgTable('biometric_attempt_logs', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  userEmailOrId: text('user_email_or_id').notNull(),
  deviceInfo: text('device_info').notNull(),
  actionType: text('action_type').notNull(),
  result: text('result').notNull(),
  detail: text('detail').notNull(),
  attestationType: text('attestation_type'),
});

// Define the 'user_movements' table.
export const userMovements = pgTable('user_movements', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  userEmail: text('user_email').notNull(),
  userName: text('user_name').notNull(),
  actionType: text('action_type').notNull(),
  description: text('description').notNull(),
  ipOrDevice: text('ip_or_device'),
});
