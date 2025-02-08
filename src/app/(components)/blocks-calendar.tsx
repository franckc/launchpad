// A calendar component for displaying time blocks.
'use client';

import React from "react";
import { redirect } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });


// Generate a unique color based on the event category.
function eventColor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

// Parse a time string in the format "hh:mm AM/PM" and return the hour and minute.
function parseTime(timeStr: string): { hour: number, min: number } {
  const match = timeStr.match(/(\d+):(\d+) (AM|am|PM|pm)/i);
  if (!match) return { 'hour': 0, 'min': 0 };
  let hour = parseInt(match[1], 10);
  let min = parseInt(match[2], 10);
  const period = match[3].toLowerCase();
  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  return { hour, min };
}

function getCalendarEvents(blocks: Array<any>) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const dayMap: { [key: string]: number } = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: -1,
  };
  return blocks.map(block => {
    const dayOffset = dayMap[block.day_of_the_week] || 0;
    const eventDate = new Date(weekStart);
    eventDate.setDate(weekStart.getDate() + dayOffset);

    const parsedStart = parseTime(block.block_time_start);
    const startDate = new Date(eventDate);
    startDate.setHours(parsedStart.hour, parsedStart.min, 0, 0);

    const parsedEnd = parseTime(block.block_time_end);
    const endDate = new Date(eventDate);
    endDate.setHours(parsedEnd.hour, parsedEnd.min, 0, 0);
    return {
      title: block.category,
      start: startDate,
      end: endDate,
      category: block.category,
    };
  });
}

export function BlocksCalendar({ blocks }: { blocks: Array<any> }) {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") redirect('/landing');

  const calendarEvents = getCalendarEvents(blocks);

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultView="week"
        views={['week']}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        scrollToTime={new Date(new Date().setHours(8, 0, 0, 0))}
        formats={{
          dayHeaderFormat: (date, culture, localizer) =>
            localizer?.format?.(date, 'EEE', culture) ?? '',
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: eventColor(event.category),
            color: 'white',
            border: 'none',
          },
        })}
      />
    </div>
  );
}