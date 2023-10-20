import { db } from "@/lib/turso";
import { event } from "@/lib/schema";
import { NextResponse } from "next/server";
import { like } from "drizzle-orm";

const currentYear = new Date().getFullYear();

export async function GET() {
  const eventData = await db
    .select()
    .from(event)
    .where(like(event.start, `${currentYear}%`));

  const birthData = [
    {
      name: "Maria Camila",
      start: "1997-09-26",
      url: "https://www.facebook.com/kamila.n.nunez1",
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
      color: "#e43b2e",
    })),
    ...birthData.map((item) => ({
      title: `🎁 ${item.name} 🎉🎈`,
      start: `${currentYear}-${item.start.slice(5)}`,
      color: "#f3bf13",
      description: `${item.name} esta cumpliendo ${
        currentYear - parseInt(item.start.slice(0, 4))
      } años!`,
      url: item.url,
    })),
  ];

  return NextResponse.json(data);
}
