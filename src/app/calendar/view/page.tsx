'use client';

import React from "react";
import { redirect } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const mockEvents = [
  { category: "Family", day: "Sunday", time_start: "8am", length: "8 hours" },
  { category: "Work", day: "Monday", time_start: "8am", length: "3 hours" },
  { category: "Work", day: "Tuesday", time_start: "8am", length: "3 hours" },
  { category: "Work", day: "Wednesday", time_start: "8am", length: "3 hours" },
  { category: "Personal", day: "Tuesday", time_start: "1pm", length: "3 hours" },
  { category: "Personal", day: "Thursday", time_start: "1pm", length: "3 hours" },
  { category: "Personal", day: "Friday", time_start: "1pm", length: "3 hours" },
  { category: "Family", day: "Saturday", time_start: "8am", length: "8 hours" },
];

const eventColors = {
  Work: '#4682B4',
  Personal: '#32CD32',
  Family: '#FFD700',
};

function parseTime(timeStr: string): number {
  const match = timeStr.match(/(\d+)(am|pm)/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const period = match[2].toLowerCase();
  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  return hour;
}

function parseLength(lengthStr: string): number {
  const match = lengthStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

function getCalendarEvents() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const dayMap: { [key: string]: number } = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };
  return mockEvents.map(me => {
    const dayOffset = dayMap[me.day] || 0;
    const eventDate = new Date(weekStart);
    eventDate.setDate(weekStart.getDate() + dayOffset);
    const startHour = parseTime(me.time_start);
    const startDate = new Date(eventDate);
    startDate.setHours(startHour, 0, 0, 0);
    const duration = parseLength(me.length);
    const endDate = new Date(startDate);
    endDate.setHours(startHour + duration, 0, 0, 0);
    return {
      title: me.category,
      start: startDate,
      end: endDate,
      category: me.category,
    };
  });
}

export default function ViewCalendar() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") redirect('/landing');

  const calendarEvents = getCalendarEvents();

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultView="week"
        views={['week']}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        scrollToTime={new Date(new Date().setHours(8, 0, 0, 0))}
        formats={{
          dayHeaderFormat: (date, culture, localizer) =>
            localizer?.format?.(date, 'EEE', culture) ?? '',
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: eventColors[event.category as keyof typeof eventColors] || '#3174ad',
            color: 'white',
            border: 'none',
          },
        })}
      />
    </div>
  );
}