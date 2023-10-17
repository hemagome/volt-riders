import { db } from "@/lib/turso";
import { event } from "@/lib/schema";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { like } from "drizzle-orm";

const currentYear = new Date().getFullYear();

export async function GET(request: NextRequest) {
  // const { userId } = getAuth(request);
  // if (!userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // } else {
  const eventData = await db
    .select()
    .from(event)
    .where(like(event.start, "2023%"));

  const birthData = [
    {
      name: "Maria Camila",
      start: "1997-09-26",
      url: "",
    },
    {
      name: "Hector Manuel",
      start: "1995-05-28",
      url: "",
    },
  ];

  const data = [
    ...eventData.map((item) => ({
      ...item,
      title: `⚡🚨${item.title}`,
      color: "#f6bf13",
    })),
    ...birthData.map((item) => ({
      title: `🎁 ${item.name} 🎉🎈`,
      start: `${currentYear}-${item.start.slice(5)}`,
      color: "#f3bf23",
      description: `${item.name} esta cumpliendo ${
        currentYear - parseInt(item.start.slice(0, 4))
      } años!`,
    })),
  ];

  return NextResponse.json(data);
  // }
}
