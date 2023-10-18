import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm";

export const eps = sqliteTable("eps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export type Eps = InferSelectModel<typeof eps>;

export const event = sqliteTable("event", {
  title: text("title").notNull(),
  start: text("start").notNull(),
  description: text("description").notNull(),
  url: text("url"),
});

export type Event = InferSelectModel<typeof event>;

export const documentType = sqliteTable("document_type", {
  abbreviation: text("abbreviation").primaryKey(),
  name: text("name").notNull(),
});

export type DocumentType = InferSelectModel<typeof documentType>;
