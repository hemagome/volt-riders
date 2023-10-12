import { db } from "@/lib/turso";
import { event } from "@/lib/schema";
import { NextResponse } from "next/server";

export const GET = async () => {
  const data = await db.select().from(event).all();
  return NextResponse.json(data);
};
