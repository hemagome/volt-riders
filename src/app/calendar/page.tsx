"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import { fetcher } from "@/lib/utils";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import useSWR from "swr";

export default function Page() {
  const { data: events } = useSWR("/api/calendar", fetcher);
  return (
    <FullCalendar
      locale={esLocale}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventClick={(info) => {
        console.log(info.event.extendedProps.description);
      }}
      eventDidMount={(info) => {}}
    />
  );
}
