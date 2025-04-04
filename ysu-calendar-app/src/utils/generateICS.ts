import * as ics from 'ics';
import fs from 'fs';
import path from 'path';

// Event interface
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

// Generate ICS for all events
export function generateMainCalendar(events: CalendarEvent[], outputDir: string) {
  const icsEvents = transformToICSEvents(events);
  
  ics.createEvents(icsEvents, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }
    
    // Write to file
    const outputPath = path.join(outputDir, 'ysu-calendar.ics');
    fs.writeFileSync(outputPath, value);
    console.log(`Main calendar generated at ${outputPath}`);
  });
}

// Generate ICS per category
export function generateCategoryCalendars(events: CalendarEvent[], outputDir: string) {
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
      const outputPath = path.join(outputDir, `ysu-${category.toLowerCase()}.ics`);
      fs.writeFileSync(outputPath, value);
      console.log(`${category} calendar generated at ${outputPath}`);
    });
  });
}

// Export functions for use in API routes
export { transformToICSEvents };
