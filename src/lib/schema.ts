import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm";

export const eps = sqliteTable("eps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export type Eps = InferSelectModel<typeof eps>;
