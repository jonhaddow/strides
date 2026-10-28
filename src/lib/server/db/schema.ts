import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { SURFACES } from '../../runs.ts';

// Days are the runner's local dates as YYYY-MM-DD text; times are ISO timestamps.

/** People who can sign in (Google accounts). */
export const user = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	name: text('name').notNull()
});

export type User = typeof user.$inferSelect;

/** Signed-in sessions. The id is the SHA-256 of the cookie's token, never the token itself. */
export const session = sqliteTable(
	'session',
	{
		id: text('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		expiresAt: text('expires_at').notNull()
	},
	(t) => [index('session_user_idx').on(t.userId)]
);

/** One run. Distances in metres and times in seconds, so the maths stays exact. */
export const run = sqliteTable(
	'run',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		day: text('day').notNull(),
		route: text('route').notNull(),
		metres: integer('metres').notNull(),
		seconds: integer('seconds').notNull(),
		/** Elevation gain, metres. */
		climb: integer('climb').notNull().default(0),
		surface: text('surface', { enum: SURFACES }).notNull(),
		createdAt: text('created_at').notNull()
	},
	(t) => [index('run_day_idx').on(t.day)]
);

export type Run = typeof run.$inferSelect;
