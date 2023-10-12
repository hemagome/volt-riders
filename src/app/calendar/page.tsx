"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const events = [
  {
    title: "Hola",
    start: "2023-10-12",
  },
  {
    title: "Adios",
    start: "2023-10-12",
  },
];

export default class DemoApp extends React.Component {
  render() {
    return (
      <FullCalendar
        locale={esLocale}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventDidMount={() => {
          return (
            <HoverCard>
              <HoverCardTrigger>Hover</HoverCardTrigger>
              <HoverCardContent>
                The React Framework – created and maintained by @vercel.
              </HoverCardContent>
            </HoverCard>
          );
        }}
      />
    );
  }
}
