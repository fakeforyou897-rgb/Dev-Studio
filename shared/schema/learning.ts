import { pgTable, text, uuid, boolean, timestamp, primaryKey, index } from "drizzle-orm/pg-core";

export const interviewQuestions = pgTable("interview_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: text("difficulty"),
  domain: text("domain").notNull(),
  tags: text("tags").array().default([]),
  isGlobal: boolean("is_global").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("interview_questions_user_id_idx").on(t.userId),
  index("interview_questions_is_global_idx").on(t.isGlobal),
]);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").notNull(),
  itemId: text("item_id").notNull(),
  areaId: text("area_id").notNull(),
  completed: boolean("completed").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.itemId] }),
  index("user_progress_user_id_idx").on(t.userId),
]);
