'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import dynamic from 'next/dynamic';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Dynamically import QRCode to resolve SSR issues
const QRCode = dynamic(() => import('qrcode.react'), { 
  ssr: false,
  loading: () => <div>Loading QR Code...</div>
});

// YSU-specific Categories
const CATEGORIES = {
  'Academic': '#4ECDC4',        // Academic Events (Teal)
  'Important Dates': '#FF6B6B', // Critical Dates (Red)
  'Holidays': '#45B7D1',        // University Holidays (Blue)
  'Refund Periods': '#6C5CE7',  // Refund Periods (Purple)
  'Graduation': '#FDCB6E'       // Graduation Events (Yellow)
};

// Localizer setup
const localizer = momentLocalizer(moment);

// Calendar Event Type
type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: keyof typeof CATEGORIES;
  description: string;
  location?: string;
};

// Utility function to generate ICS content
const generateICS = (events: CalendarEvent[]): string => {
  const icsHeader = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YSU Academic Calendar//EN\n';
  const icsFooter = 'END:VCALENDAR';

  const icsEvents = events.map(event => {
    const formatDate = (date: Date) => 
      date.toISOString().replace(/[-:]|\.\d{3}/g, '');

    return `BEGIN:VEVENT
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location || ''}
END:VEVENT`;
  }).join('\n');

  return `${icsHeader}${icsEvents}\n${icsFooter}`;
};

// Parse dates from the catalog
const parseYSUCalendarDates = (): CalendarEvent[] => {
  const academicYearEvents: CalendarEvent[] = [
    // Fall 2024 Academic Events
    {
      id: 'fall2024-classes-begin',
      title: 'Classes Begin - Fall 2024',
      start: new Date(2024, 7, 26),
      end: new Date(2024, 7, 26),
      category: 'Academic',
      description: 'First day of classes for full term and first 8 weeks'
    },
    {
      id: 'fall2024-add-classes-first-8weeks',
      title: 'Last Day to Add Classes - First 8 Weeks',
      start: new Date(2024, 7, 29),
      end: new Date(2024, 7, 29),
      category: 'Important Dates',
      description: 'Last day to add classes or change grading option for first 8-week term'
    },
    {
      id: 'fall2024-100-refund-first-8weeks',
      title: 'Last Day for 100% Refund - First 8 Weeks',
      start: new Date(2024, 8, 1),
      end: new Date(2024, 8, 1),
      category: 'Refund Periods',
      description: 'Last day for 100% refund for first 8-week term'
    },
    {
      id: 'fall2024-holiday-labor-day',
      title: 'Labor Day - University Closed',
      start: new Date(2024, 8, 2),
      end: new Date(2024, 8, 2),
      category: 'Holidays',
      description: 'Legal holiday - University closed'
    },
    {
      id: 'fall2024-graduation-application',
      title: 'Fall Term Graduation Application Deadline',
      start: new Date(2024, 9, 4),
      end: new Date(2024, 9, 4),
      category: 'Graduation',
      description: 'Last day to apply for fall term graduation'
    },
    {
      id: 'fall2024-first-8weeks-end',
      title: 'First 8-Week Term Ends',
      start: new Date(2024, 9, 19),
      end: new Date(2024, 9, 19),
      category: 'Academic',
      description: 'End of first 8-week term'
    },
    {
      id: 'fall2024-veterans-day',
      title: 'Veterans Day - University Closed',
      start: new Date(2024, 10, 11),
      end: new Date(2024, 10, 11),
      category: 'Holidays',
      description: 'Legal holiday - University closed'
    },
    {
      id: 'fall2024-thanksgiving-break',
      title: 'Thanksgiving Break',
      start: new Date(2024, 10, 27),
      end: new Date(2024, 11, 2),
      category: 'Holidays',
      description: 'Thanksgiving academic break'
    },
    {
      id: 'fall2024-final-exams-begin',
      title: 'Final Examinations Begin',
      start: new Date(2024, 11, 9),
      end: new Date(2024, 11, 9),
      category: 'Academic',
      description: 'Final examinations for fall term begin'
    },
    {
      id: 'fall2024-commencement',
      title: 'Fall Commencement',
      start: new Date(2024, 11, 15),
      end: new Date(2024, 11, 15),
      category: 'Graduation',
      description: 'Commencement ceremony for fall graduates'
    }
  ];

  // Spring 2025 Dates
  const springEvents: CalendarEvent[] = [
    {
      id: 'spring2025-classes-begin',
      title: 'Classes Begin - Spring 2025',
      start: new Date(2025, 0, 6),
      end: new Date(2025, 0, 6),
      category: 'Academic',
      description: 'First day of classes for full term and first 7-weeks'
    },
    {
      id: 'spring2025-mlk-day',
      title: 'Martin Luther King Jr. Day',
      start: new Date(2025, 0, 20),
      end: new Date(2025, 0, 20),
      category: 'Holidays',
      description: 'Legal holiday - University closed'
    },
    {
      id: 'spring2025-spring-break-begin',
      title: 'Spring Break Begins',
      start: new Date(2025, 2, 3),
      end: new Date(2025, 2, 9),
      category: 'Holidays',
      description: 'Spring Break'
    },
    {
      id: 'spring2025-final-exams-begin',
      title: 'Final Examinations Begin',
      start: new Date(2025, 3, 28),
      end: new Date(2025, 3, 28),
      category: 'Academic',
      description: 'Final examinations for spring term begin'
    },
    {
      id: 'spring2025-commencement',
      title: 'Spring Commencement',
      start: new Date(2025, 4, 2),
      end: new Date(2025, 4, 3),
      category: 'Graduation',
      description: 'Commencement ceremony for spring graduates'
    }
  ];

  // Summer 2025 Dates
  const summerEvents: CalendarEvent[] = [
    {
      id: 'summer2025-classes-begin',
      title: 'Classes Begin - Summer 2025',
      start: new Date(2025, 4, 12),
      end: new Date(2025, 4, 12),
      category: 'Academic',
      description: 'First day of classes for full term and first 7-week term'
    },
    {
      id: 'summer2025-memorial-day',
      title: 'Memorial Day - University Closed',
      start: new Date(2025, 4, 26),
      end: new Date(2025, 4, 26),
      category: 'Holidays',
      description: 'Legal holiday - University closed'
    },
    {
      id: 'summer2025-independence-day',
      title: 'Independence Day - University Closed',
      start: new Date(2025, 6, 4),
      end: new Date(2025, 6, 4),
      category: 'Holidays',
      description: 'Legal holiday - University closed'
    }
  ];

  return [...academicYearEvents, ...springEvents, ...summerEvents];
};

const YSUCalendarApp: React.FC = () => {
  // Use the parsed events
  const [events] = useState<CalendarEvent[]>(parseYSUCalendarDates());

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>(
    Object.keys(CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  // Client-side check for rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter events based on categories and search
  const filteredEvents = events.filter(event => 
    visibleCategories[event.category] && 
    (searchQuery === "" || 
     event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Download ICS for all events or specific category
  const handleDownloadICS = () => {
    const eventsToDownload = selectedCategory 
      ? filteredEvents.filter(e => e.category === selectedCategory)
      : filteredEvents;
    
    const icsContent = generateICS(eventsToDownload);
    
    // Create a blob and trigger download
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `YSU_Calendar_${selectedCategory || 'All_Events'}.ics`;
    link.click();
  };

  // Generate calendar subscription URL (mock implementation)
  const getCalendarUrl = () => {
    // In a real-world scenario, this would be an actual webcal or webcalendar URL
    return `webcal://ysu.edu/calendar/${selectedCategory || 'all'}`;
  };

  // Event style generator
  const eventStyleGetter = (event: CalendarEvent) => {
    const style: React.CSSProperties = {
      backgroundColor: CATEGORIES[event.category],
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0',
      display: 'block',
      fontWeight: 'bold'
    };

    return {
      style
    };
  };

  // Toggle category visibility
  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">YSU Academic Calendar</h1>
          </div>
          
          {/* Search and Actions */}
          <div className="flex space-x-4 items-center">
            <input
              type="text"
              placeholder="Search events..."
              className="px-3 py-2 rounded text-gray-800 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex space-x-2">
              <button 
                onClick={() => setSubscribeModalOpen(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-medium transition-colors"
              >
                Subscribe
              </button>
              <button 
                onClick={handleDownloadICS}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors"
              >
                Download .ICS
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:flex md:space-x-4">
        {/* Sidebar with Category Filters */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          
          <div className="space-y-2">
            {Object.entries(CATEGORIES).map(([category, color]) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${category}`}
                  checked={visibleCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="mr-2"
                />
                <label htmlFor={`cat-${category}`} className="flex items-center cursor-pointer">
                  <span 
                    className="inline-block w-3 h-3 mr-2 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></span>
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar View */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={handleEventClick}
              eventPropGetter={eventStyleGetter}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              popup
            />
          </div>
        </div>
      </main>

      {/* Subscribe Modal */}
      {subscribeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flexitems-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">Subscribe to Calendar</h2>
              <button 
                onClick={() => setSubscribeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4">
              <p className="mb-4">Subscribe to the YSU Calendar to keep up with important dates and events. Add this calendar to your favorite calendar app to receive automatic updates.</p>
              
              {/* Category selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select category (optional):</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className={`px-3 py-1 text-sm rounded-full ${!selectedCategory ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                  >
                    All Events
                  </button>
                  {Object.entries(CATEGORIES).map(([category, color]) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="px-3 py-1 text-sm rounded-full text-white"
                      style={{ 
                        backgroundColor: color,
                        opacity: selectedCategory === category ? 1 : 0.7
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="mb-4 flex justify-center">
                  {isClient && (
                    <QRCode value={getCalendarUrl()} size={150} />
                  )}
                </div>
                
                <div className="text-sm font-medium mb-2">Calendar URL:</div>
                <input
                  type="text"
                  value={getCalendarUrl()}
                  readOnly
                  className="w-full p-2 border rounded text-center text-sm bg-white"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">How to Subscribe:</h3>
                
                <div>
                  <h4 className="font-medium">Outlook:</h4>
                  <ol className="text-sm ml-5 list-decimal space-y-1">
                    <li>In Outlook, go to Calendar view</li>
                    <li>Right-click on "Other calendars"</li>
                    <li>Select "Add calendar" then "From Internet"</li>
                    <li>Paste the URL above and click "OK"</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium">Google Calendar:</h4>
                  <ol className="text-sm ml-5 list-decimal space-y-1">
                    <li>In Google Calendar, click the "+" next to "Other calendars"</li>
                    <li>Select "From URL"</li>
                    <li>Paste the URL above and click "Add calendar"</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium">Apple Calendar:</h4>
                  <ol className="text-sm ml-5 list-decimal space-y-1">
                    <li>In Calendar, select File > New Calendar Subscription</li>
                    <li>Paste the URL above and click "Subscribe"</li>
                    <li>Configure sync settings and click "OK"</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSubscribeModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <span 
                  className="inline-block px-2 py-1 text-xs font-medium text-white rounded"
                  style={{ backgroundColor: CATEGORIES[selectedEvent.category] }}
                >
                  {selectedEvent.category}
                </span>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm">Description</div>
                <p>{selectedEvent.description}</p>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm">Date</div>
                <p>{moment(selectedEvent.start).format('MMMM D, YYYY')}</p>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    // Generate ICS for single event
                    const singleEventICS = generateICS([selectedEvent]);
                    const blob = new Blob([singleEventICS], { type: 'text/calendar' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `YSU_Event_${selectedEvent.title.replace(/\s+/g, '_')}.ics`;
                    link.click();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YSUCalendarApp;
