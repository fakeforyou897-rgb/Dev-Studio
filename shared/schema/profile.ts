import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  location: text("location"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
