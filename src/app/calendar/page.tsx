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
    title: "La sultana🎁 🎉🎈",
    start: "2023-09-26",
    color: "#f6bf13",
    description: "Se nos puso vieja la Camila",
  },
  {
    title: "⚡🚨Día sin carro",
    start: "2023-09-21",
    color: "#e43e2f",
    description: "Hector no piensa volver a buscar sitio para comer",
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
        eventClick={(info) => {
          console.log(info.event.extendedProps.description);
        }}
        eventDidMount={(info) => {}}
      />
    );
  }
}
