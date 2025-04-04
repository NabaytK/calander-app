import { NextRequest, NextResponse } from 'next/server';
import * as ics from 'ics';

// Define event type
interface CalendarEvent {
  id: number;
  title: string;
  start: [number, number, number, number, number]; // [year, month, day, hour, minute]
  end: [number, number, number, number, number];
  description: string;
  location: string;
  category: string;
  link?: string;
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
  },
  {
    id: 7,
    title: "FYSS Orientation Session",
    start: [2025, 8, 15, 10, 0],
    end: [2025, 8, 15, 12, 0],
    description: "First Year Student Services orientation session for new students.",
    location: "Kilcawley Center",
    category: "FYSS",
    link: "https://ysu.edu/first-year-student-services"
  },
  {
    id: 8,
    title: "FYSS Study Skills Workshop",
    start: [2025, 9, 10, 14, 0],
    end: [2025, 9, 10, 15, 30],
    description: "Learn essential study skills and time management for college success.",
    location: "Maag Library, Room 103",
    category: "FYSS",
    link: "https://www.youtube.com/watch?v=example"
  }
];

// Transform events to ICS format
function transformToICSEvents(events: CalendarEvent[]) {
  return events.map(event => {
    // Create description that includes link if available
    let description = event.description || '';
    if (event.link) {
      description += `\n\nResource: ${event.link}`;
    }
    
    return {
      uid: `${event.id}@ysu-calendar.example.com`,
      title: event.title,
      start: event.start,
      end: event.end,
      description: description,
      location: event.location,
      categories: [event.category],
      status: 'CONFIRMED',
      busyStatus: 'BUSY'
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  // Filter events by category if specified
  const filteredEvents = category 
    ? events.filter(event => event.category.toLowerCase() === category.toLowerCase())
    : events;
  
  // Create ICS file
  const icsEvents = transformToICSEvents(filteredEvents);
  
  return new Promise((resolve) => {
    ics.createEvents(icsEvents, (error, value) => {
      if (error) {
        console.error(error);
        resolve(NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 }));
        return;
      }

      // Return ICS file
      const response = new NextResponse(value, {
        headers: {
          'Content-Type': 'text/calendar',
          'Content-Disposition': `attachment; filename="ysu-calendar${category ? `-${category.toLowerCase()}` : ''}.ics"`,
        },
      });

      resolve(response);
    });
  });
}
