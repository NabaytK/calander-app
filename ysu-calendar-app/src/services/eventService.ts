import { useEffect, useState } from 'react';

// Define event type
export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  category: string;
  link?: string;
  linkLabel?: string;
}

// Function to convert ISO date strings to Date objects
const convertDates = (event: any): CalendarEvent => {
  return {
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  };
};

// Hook to fetch and process events
export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // In a real app, you might fetch from an API
        // Here we're using a mock fetch from the public directory
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Convert date strings to Date objects
        const processedEvents = data.map(convertDates);
        
        setEvents(processedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        
        // Fallback to static events if fetch fails
        import('@/data/events.json')
          .then(module => {
            const staticEvents = module.default.map(convertDates);
            setEvents(staticEvents);
          })
          .catch(importErr => {
            console.error('Error importing static events:', importErr);
          });
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}

// Get calendar subscription URL
export function getCalendarUrl(category?: string): string {
  // Base URL for the calendar endpoint
  const baseUrl = `${window.location.origin}/api/calendar`;
  
  // Add category query parameter if specified
  return category 
    ? `${baseUrl}?category=${encodeURIComponent(category)}` 
    : baseUrl;
}

// Categories with colors
export const CATEGORIES: Record<string, string> = {
  Academic: "#4285F4", // blue
  Financial: "#34A853", // green
  Events: "#FBBC05",    // yellow
  Athletics: "#EA4335", // red
  Deadlines: "#9C27B0", // purple
  Holidays: "#FF9800",  // orange
  FYSS: "#00796B"       // teal - First Year Student Services
};

// Download calendar
export function downloadCalendar(category?: string) {
  const url = getCalendarUrl(category);
  window.open(url, '_blank');
}
