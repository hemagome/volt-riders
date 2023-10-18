import { db } from "@/lib/turso";
import { documentType } from "@/lib/schema";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json(await db.select().from(documentType).all());
};
