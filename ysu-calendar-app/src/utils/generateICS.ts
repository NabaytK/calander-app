import { writeFileSync } from 'fs';
import { join } from 'path';
import * as ics from 'ics';

// Event interface
interface CalendarEvent {
  id: number;
  title: string;
  start: [number, number, number, number, number]; // [year, month, day, hour, minute]
  end: [number, number, number, number, number];
  description: string;
  location: string;
  category: string;
}

// Sample events data structure (in production, this would come from a database or JSON file)
const events: CalendarEvent[] = [
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
function transformToICSEvents(events: CalendarEvent[]) {
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
export function generateMainCalendar() {
  const icsEvents = transformToICSEvents(events);
  
  ics.createEvents(icsEvents, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }
    
    // Write to file - note: this won't work in browser environment
    // This code is meant for backend/API routes
    // const outputPath = join(process.cwd(), 'public', 'ysu-calendar.ics');
    // writeFileSync(outputPath, value);
    console.log(`Main calendar generated`);
    
    return value;
  });
}

// Generate ICS per category
export function generateCategoryCalendars() {
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
      
      // Write to file - note: this won't work in browser environment
      // This code is meant for backend/API routes
      // const outputPath = join(process.cwd(), 'public', `ysu-${category.toLowerCase()}.ics`);
      // writeFileSync(outputPath, value);
      console.log(`${category} calendar generated`);
      
      return value;
    });
  });
}

// Export functions for use in API routes
export {
  transformToICSEvents
};