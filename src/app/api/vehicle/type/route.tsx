import { db } from "@/lib/turso";
import { vehicleType } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await db.select().from(vehicleType).all());
}
