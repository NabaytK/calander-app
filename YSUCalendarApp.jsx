import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import QRCode from 'qrcode.react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Sample categories with colors - added FYSS
const CATEGORIES = {
  Academic: "#4285F4", // blue
  Financial: "#34A853", // green
  Events: "#FBBC05",    // yellow
  Athletics: "#EA4335", // red
  Deadlines: "#9C27B0", // purple
  Holidays: "#FF9800",  // orange
  FYSS: "#00796B"       // teal - First Year Student Services
};

// Define TypeScript interfaces
interface CalendarEvent {
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

interface CategoryVisibility {
  [key: string]: boolean;
}

// Mock event data (would come from a backend/JSON file in production)
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Fall Semester Begins",
    start: new Date(2025, 7, 21, 8, 0), // Aug 21, 2025
    end: new Date(2025, 7, 21, 17, 0),
    description: "First day of Fall semester classes.",
    location: "YSU Campus",
    category: "Academic"
  },
  {
    id: 2,
    title: "Tuition Due",
    start: new Date(2025, 8, 5, 0, 0), // Sep 5, 2025
    end: new Date(2025, 8, 5, 23, 59),
    description: "Last day to pay Fall tuition.",
    location: "YSU Office of Student Accounts",
    category: "Financial"
  },
  {
    id: 3,
    title: "Homecoming Game",
    start: new Date(2025, 9, 12, 14, 0), // Oct 12, 2025
    end: new Date(2025, 9, 12, 17, 0),
    description: "Annual YSU Homecoming football game.",
    location: "Stambaugh Stadium",
    category: "Athletics"
  },
  {
    id: 4,
    title: "Registration Deadline",
    start: new Date(2025, 10, 10, 0, 0), // Nov 10, 2025
    end: new Date(2025, 10, 10, 23, 59),
    description: "Last day to register for Spring classes.",
    location: "Online",
    category: "Deadlines"
  },
  {
    id: 5,
    title: "Fall Break",
    start: new Date(2025, 10, 25, 0, 0), // Nov 25, 2025
    end: new Date(2025, 10, 29, 23, 59), // Ends Nov 29
    description: "No classes for Fall break.",
    location: "YSU Campus",
    category: "Holidays"
  },
  {
    id: 6,
    title: "Student Art Exhibition",
    start: new Date(2025, 9, 5, 18, 0), // Oct 5, 2025
    end: new Date(2025, 9, 5, 21, 0),
    description: "Showcase of student artwork from the Fall semester.",
    location: "McDonough Museum of Art",
    category: "Events"
  },
  {
    id: 7,
    title: "FYSS Orientation Session",
    start: new Date(2025, 7, 15, 10, 0), // Aug 15, 2025
    end: new Date(2025, 7, 15, 12, 0),
    description: "First Year Student Services orientation session for new students.",
    location: "Kilcawley Center",
    category: "FYSS",
    link: "https://ysu.edu/first-year-student-services",
    linkLabel: "View Orientation Details"
  },
  {
    id: 8,
    title: "FYSS Study Skills Workshop",
    start: new Date(2025, 8, 10, 14, 0), // Sep 10, 2025
    end: new Date(2025, 8, 10, 15, 30),
    description: "Learn essential study skills and time management for college success.",
    location: "Maag Library, Room 103",
    category: "FYSS",
    link: "https://www.youtube.com/watch?v=example",
    linkLabel: "Watch Preview Video"
  }
];

const YSUCalendarApp: React.FC = () => {
  const [events] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<CategoryVisibility>(
    Object.keys(CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);

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

  // Event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: CATEGORIES[event.category as keyof typeof CATEGORIES],
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0',
      display: 'block',
      fontWeight: 'bold'
    };

    // Make FYSS events stand out a bit
    if (event.category === 'FYSS') {
      style.border = '2px solid #004D40';
    }

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

  // Toggle all categories
  const toggleAllCategories = (value: boolean) => {
    const newCategories = Object.keys(CATEGORIES).reduce(
      (acc, cat) => ({ ...acc, [cat]: value }), 
      {} as CategoryVisibility
    );
    setVisibleCategories(newCategories);
  };

  // Create and trigger ICS download
  const downloadICS = () => {
    alert("In a real implementation, this would download an ICS file with all selected events.\n\nThe backend would generate this file using ics.js or similar.");
  };

  // Generate a subscription link
  const getSubscriptionLink = () => {
    // In a real app, this would be the URL to your hosted .ics file
    return "https://ysu-calendar.example.com/calendar.ics";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with YSU FYSS logo */}
      <header className="bg-red-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            {/* YSU FYSS Logo */}
            <div className="mr-4 w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/api/placeholder/400/400" 
                alt="YSU Logo" 
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold">YSU First Year Student Services Calendar</h1>
          </div>
          <div className="mt-3 md:mt-0 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="px-4 py-2 rounded-full text-gray-800 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setSearchQuery("")}
              >
                {searchQuery && "✕"}
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setSubscribeModalOpen(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-medium transition-colors"
              >
                Subscribe
              </button>
              <button 
                onClick={downloadICS}
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
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Categories</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => toggleAllCategories(true)}
                  className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  All
                </button>
                <button 
                  onClick={() => toggleAllCategories(false)}
                  className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  None
                </button>
              </div>
            </div>
            
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
          
          <h3 className="font-medium mb-2">Upcoming Events</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredEvents
              .filter(event => event.start >= new Date())
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .slice(0, 5)
              .map(event => (
                <div 
                  key={event.id} 
                  className="p-2 border-l-4 text-sm cursor-pointer hover:bg-gray-50"
                  style={{ borderColor: CATEGORIES[event.category as keyof typeof CATEGORIES] }}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  <div>{moment(event.start).format('MMM D, YYYY')}</div>
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
              onSelectEvent={(event) => handleEventClick(event as CalendarEvent)}
              eventPropGetter={(event) => eventStyleGetter(event as CalendarEvent)}
              views={['month', 'week', 'day', 'agenda']}
              popup
            />
          </div>
        </div>
      </main>
      
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
                  style={{ backgroundColor: CATEGORIES[selectedEvent.category as keyof typeof CATEGORIES] }}
                >
                  {selectedEvent.category}
                </span>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm">When</div>
                <div>
                  {moment(selectedEvent.start).format('MMMM D, YYYY')}
                  {' • '}
                  {moment(selectedEvent.start).format('h:mm A')} - 
                  {moment(selectedEvent.end).format('h:mm A')}
                </div>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm">Where</div>
                <div>{selectedEvent.location}</div>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm">Description</div>
                <p>{selectedEvent.description}</p>
              </div>
              
              {/* Display link if available */}
              {selectedEvent.link && (
                <div>
                <div className="text-gray-500 text-sm">Resource</div>
                <a
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedEvent.linkLabel || 'View Resource'}
                </a>
              </div>
              
                    {selectedEvent.linkLabel || 'View Resource'}
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  // In a real app, this would download a single event ICS
                  alert("This would download an ICS file for just this event");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Subscribe Modal */}
      {subscribeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="mb-4 flex justify-center">
                  <QRCode value={getSubscriptionLink()} size={150} />
                </div>
      };
                <div className="text-sm font-medium mb-2">Calendar URL:</div>
                <input
                  type="text"
                  value={getSubscriptionLink()}
                  readOnly
                  className="w-full p-2 border rounded text-center text-sm bg-white"
                  onClick={(e) => e.target.select()}
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
                  <li>In Calendar, select File &gt; New Calendar Subscription</li>
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
    </div>
  );
};

export default YSUCalendarApp;