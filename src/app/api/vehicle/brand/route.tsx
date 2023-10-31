import { db } from "@/lib/turso";
import { vehicleBrand } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await db.select().from(vehicleBrand).all());
}
