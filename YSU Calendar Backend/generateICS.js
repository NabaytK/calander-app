// This file would be named generateICS.js
// It uses the ics.js library to generate ICS files

const { writeFileSync } = require('fs');
const { join } = require('path');
const ics = require('ics');

// Sample events data structure (in production, this would come from a database or JSON file)
const events = [
  {
    id: 1,
    title: "Fall Semester Begins",
    start: [2025, 8, 21, 8, 0], // Format: [year, month, day, hour, minute]
    end: [2025, 8, 21, 17, 0],
    description: "First day of Fall semester classes.",
    location: "YSU Campus",
    category: "Academic"
  },
  {
    id: 2,
    title: "Tuition Due",
    start: [2025, 9, 5, 0, 0],
    end: [2025, 9, 5, 23, 59],
    description: "Last day to pay Fall tuition.",
    location: "YSU Office of Student Accounts",
    category: "Financial"
  },
  {
    id: 3,
    title: "Homecoming Game",
    start: [2025, 10, 12, 14, 0],
    end: [2025, 10, 12, 17, 0],
    description: "Annual YSU Homecoming football game.",
    location: "Stambaugh Stadium",
    category: "Athletics"
  },
  {
    id: 4,
    title: "Registration Deadline",
    start: [2025, 11, 10, 0, 0],
    end: [2025, 11, 10, 23, 59],
    description: "Last day to register for Spring classes.",
    location: "Online",
    category: "Deadlines"
  },
  {
    id: 5,
    title: "Fall Break",
    start: [2025, 11, 25, 0, 0],
    end: [2025, 11, 29, 23, 59],
    description: "No classes for Fall break.",
    location: "YSU Campus",
    category: "Holidays"
  },
  {
    id: 6,
    title: "Student Art Exhibition",
    start: [2025, 10, 5, 18, 0],
    end: [2025, 10, 5, 21, 0],
    description: "Showcase of student artwork from the Fall semester.",
    location: "McDonough Museum of Art",
    category: "Events"
  }
];

// Transform events to ICS format
function transformToICSEvents(events) {
  return events.map(event => ({
    uid: `${event.id}@ysu-calendar.example.com`,
    title: event.title,
    start: event.start,
    end: event.end,
    description: event.description,
    location: event.location,
    categories: [event.category],
    status: 'CONFIRMED',
    busyStatus: 'BUSY'
  }));
}

// Generate ICS for all events
function generateMainCalendar() {
  const icsEvents = transformToICSEvents(events);
  
  ics.createEvents(icsEvents, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }
    
    // Write to file
    const outputPath = join(__dirname, '../public/ysu-calendar.ics');
    writeFileSync(outputPath, value);
    console.log(`Main calendar generated at ${outputPath}`);
  });
}

// Generate ICS per category
function generateCategoryCalendars() {
  // Get unique categories
  const categories = [...new Set(events.map(event => event.category))];
  
  categories.forEach(category => {
    const categoryEvents = events.filter(event => event.category === category);
    const icsEvents = transformToICSEvents(categoryEvents);
    
    ics.createEvents(icsEvents, (error, value) => {
      if (error) {
        console.log(error);
        return;
      }
      
      // Write to file
      const outputPath = join(__dirname, `../public/ysu-${category.toLowerCase()}.ics`);
      writeFileSync(outputPath, value);
      console.log(`${category} calendar generated at ${outputPath}`);
    });
  });
}

// Run the generators
generateMainCalendar();
generateCategoryCalendars();

// Export functions for use in API routes
module.exports = {
  generateMainCalendar,
  generateCategoryCalendars,
  transformToICSEvents
};

// -----------------------------------------------------------------------
// In a Next.js app, you could have an API route like this (pages/api/calendar.js):
// -----------------------------------------------------------------------

/*
import { createEvents } from 'ics';
import events from '../../data/events.json';
import { transformToICSEvents } from '../../utils/generateICS';

export default function handler(req, res) {
  // Get query parameters for filtering
  const { category } = req.query;
  
  // Filter events if category is specified
  let filteredEvents = events;
  if (category) {
    filteredEvents = events.filter(event => event.category.toLowerCase() === category.toLowerCase());
  }
  
  // Transform to ICS format
  const icsEvents = transformToICSEvents(filteredEvents);
  
  // Create ICS file
  createEvents(icsEvents, (error, value) => {
    if (error) {
      res.status(500).json({ error: 'Failed to generate calendar' });
      return;
    }
    
    // Set headers for .ics file download
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="ysu-calendar${category ? '-' + category : ''}.ics"`);
    res.status(200).send(value);
  });
}
*/

// -----------------------------------------------------------------------
// For a script that would run on a schedule (e.g., with cron) to keep the ICS files updated:
// -----------------------------------------------------------------------

/*
// updateCalendars.js
const { generateMainCalendar, generateCategoryCalendars } = require('./generateICS');

console.log('Updating YSU calendars...');

// Generate all calendars
generateMainCalendar();
generateCategoryCalendars();

console.log('Calendar update complete!');
*/
