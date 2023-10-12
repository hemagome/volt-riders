"use client"

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';

export default class DemoApp extends React.Component {
    render() {
        return (
            <FullCalendar
                locale={esLocale}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
            />
        )
    }
}