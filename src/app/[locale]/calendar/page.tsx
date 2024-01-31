"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import { fetcher } from "@/lib/utils";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import useSWR from "swr";
import tippy from "tippy.js";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";

export default function Page() {
  const { data: events } = useSWR("/api/calendar", fetcher);

  return (
    <FullCalendar
      locale={esLocale}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventMouseEnter={(info) => {
        tippy(info.el, {
          content: `${info.event.extendedProps.description}`,
          trigger: "mouseenter focus",
          allowHTML: true,
          theme: "light",
        });
      }}
      eventClick={(info) => {
        info.jsEvent.preventDefault();
        if (info.event.url) {
          window.open(info.event.url);
        }
      }}
    />
  );
}
