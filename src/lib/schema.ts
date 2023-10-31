import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm";

export const eps = sqliteTable("eps", {
  nit: text("nit").primaryKey(),
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

export const vehicleBrand = sqliteTable(
  "vehicle_brand",
  {
    brand: text("brand").notNull(),
    vehicleType: integer("vehicle_type").references(() => vehicleType.id),
  },
  (vehicle) => {
    return {
      pk: primaryKey(vehicle.brand, vehicle.vehicleType),
    };
  }
);

export type VehicleBrand = InferSelectModel<typeof vehicleBrand>;

export const vehicleType = sqliteTable("vehicle_type", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
});

export type VehicleType = InferSelectModel<typeof vehicleType>;
