'use client';

import React from 'react';
import YSUCalendarApp from '@/components/YSUCalendarApp';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function Home() {
  return (
    <div className="min-h-screen">
      <YSUCalendarApp />
    </div>
  );
}