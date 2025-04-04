// src/components/YSUCalendarApp.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import fetchYSUCalendar from '../utils/fetchYSUCalendar';

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

// Monthly backgrounds configuration
const monthBackgrounds = {
  0: "/backgrounds/january.jpg",     // January
  1: "/backgrounds/february.jpg",    // February
  2: "/backgrounds/march.jpg",       // March
  3: "/backgrounds/april.jpg",       // April
  4: "/backgrounds/may.jpg",         // May
  5: "/backgrounds/june.jpg",        // June
  6: "/backgrounds/july.jpg",        // July
  7: "/backgrounds/august.jpg",      // August - Welcome Week
  8: "/backgrounds/september.jpg",   // September - UK theme
  9: "/backgrounds/october.jpg",     // October
  10: "/backgrounds/november.jpg",   // November
  11: "/backgrounds/december.jpg"    // December
};

const YSUCalendarApp = () => {
  // State for events
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState(
    Object.keys(CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load events including YSU calendar integration
    async function loadCalendarEvents() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Sample FYSS events with links
        const fyssEvents = [
          {
            id: 1,
            title: "IGNITE Leadership Program",
            start: new Date(new Date().getFullYear(), 8, 15, 16, 0),
            end: new Date(new Date().getFullYear(), 8, 15, 18, 0),
            description: "Join the IGNITE Leadership Program for first-year students! Learn leadership skills and meet other students.",
            location: "Kilcawley Center, Ohio Room",
            category: "FYSS",
            link: "https://ysu.edu/ignite-leadership",
            linkLabel: "Apply for IGNITE"
          },
          {
            id: 2,
            title: "FYSS Orientation Session",
            start: new Date(new Date().getFullYear(), 7, 15, 10, 0),
            end: new Date(new Date().getFullYear(), 7, 15, 12, 0),
            description: "First Year Student Services orientation session for new students.",
            location: "Kilcawley Center",
            category: "FYSS",
            link: "https://ysu.edu/first-year-student-services",
            linkLabel: "View Orientation Details"
          },
          {
            id: 3,
            title: "FYSS Study Skills Workshop",
            start: new Date(new Date().getFullYear(), 8, 10, 14, 0),
            end: new Date(new Date().getFullYear(), 8, 10, 15, 30),
            description: "Learn essential study skills and time management for college success.",
            location: "Maag Library, Room 103",
            category: "FYSS",
            link: "https://www.ysu.edu/first-year-student-services/workshops",
            linkLabel: "Workshop Resources"
          },
          {
            id: 4,
            title: "FYSS Career Exploration Event",
            start: new Date(new Date().getFullYear(), 9, 5, 13, 0),
            end: new Date(new Date().getFullYear(), 9, 5, 15, 0),
            description: "Explore different career paths and meet with YSU alumni in various fields.",
            location: "Williamson Hall",
            category: "FYSS",
            link: "https://ysu.edu/career-services",
            linkLabel: "Career Services Info"
          }
        ];

        // Fetch YSU calendar events
        // Use the official YSU calendar URL
        const ysuEvents = await fetchYSUCalendar('https://ysu.edu/registrars-office/calendars');
        console.log("Fetched YSU events:", ysuEvents.length);
        
        // Merge the two sets of events
        const allEvents = [...fyssEvents, ...ysuEvents];
        
        setEvents(allEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading events:", error);
        setError("Failed to load calendar events. Please try again later.");
        // Fallback to just FYSS events if YSU calendar fails
        setEvents([
          {
            id: 1,
            title: "IGNITE Leadership Program",
            start: new Date(new Date().getFullYear(), 8, 15, 16, 0),
            end: new Date(new Date().getFullYear(), 8, 15, 18, 0),
            description: "Join the IGNITE Leadership Program for first-year students!",
            location: "Kilcawley Center, Ohio Room",
            category: "FYSS",
            link: "https://ysu.edu/ignite-leadership",
            linkLabel: "Apply for IGNITE"
          },
          {
            id: 2,
            title: "FYSS Orientation Session",
            start: new Date(new Date().getFullYear(), 7, 15, 10, 0),
            end: new Date(new Date().getFullYear(), 7, 15, 12, 0),
            description: "First Year Student Services orientation session for new students.",
            location: "Kilcawley Center",
            category: "FYSS",
            link: "https://ysu.edu/first-year-student-services",
            linkLabel: "View Orientation Details"
          }
        ]);
        setIsLoading(false);
      }
    }
    
    loadCalendarEvents();
  }, []);

  // Filter events based on categories and search
  const filteredEvents = events.filter(event => 
    visibleCategories[event.category] && 
    (searchQuery === "" || 
     event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Event style generator
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: CATEGORIES[event.category],
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0',
      display: 'block',
      fontWeight: 'bold'
    };

    // Make FYSS events stand out a bit
    if (event.category === 'FYSS') {
      return {
        style: {
          ...style,
          border: '2px solid #004D40',
        }
      };
    }

    return { style };
  };

  // Toggle category visibility
  const toggleCategory = (category) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle all categories
  const toggleAllCategories = (value) => {
    const newCategories = Object.keys(CATEGORIES).reduce(
      (acc, cat) => ({ ...acc, [cat]: value }), 
      {}
    );
    setVisibleCategories(newCategories);
  };

  // Toggle FYSS events only
  const toggleFYSSOnly = () => {
    const newCategories = Object.keys(CATEGORIES).reduce(
      (acc, cat) => ({ ...acc, [cat]: cat === 'FYSS' }), 
      {}
    );
    setVisibleCategories(newCategories);
  };

  // Show all categories
  const showAllCategories = () => {
    toggleAllCategories(true);
  };

  // Handle calendar navigation and update current month
  const handleNavigate = (date, view, action) => {
    setCurrentDate(date);
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Create and trigger ICS download
  const downloadICS = () => {
    // In a real app, this would generate an ICS file
    alert("In a real implementation, this would download an ICS file with all selected events.");
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
          <div className="flex items-center mb-4 md:mb-0">
            {/* YSU Logo */}
            <div className="mr-4 w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="https://ysu.edu/sites/default/files/YSULogo_Penguin2c.png" 
                alt="YSU Logo" 
                className="h-10 w-auto"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">YSU First Year Student Services</h1>
              <p className="text-sm">Academic Calendar & FYSS Events</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
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
          
          {/* Quick filter buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={showAllCategories}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
            >
              All Events
            </button>
            <button 
              onClick={toggleFYSSOnly}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded text-white text-sm font-medium"
            >
              FYSS Events Only
            </button>
          </div>
          
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
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">Loading events...</div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">{error}</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredEvents
                .filter(event => event.start >= new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 5)
                .map(event => (
                  <div 
                    key={event.id} 
                    className="p-2 border-l-4 text-sm cursor-pointer hover:bg-gray-50"
                    style={{ borderColor: CATEGORIES[event.category] }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div>{moment(event.start).format('MMM D, YYYY')}</div>
                  </div>
                ))}
              {filteredEvents.filter(event => event.start >= new Date()).length === 0 && (
                <div className="py-2 text-center text-gray-500">No upcoming events found</div>
              )}
            </div>
          )}
          
          {/* FYSS Logo and Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-3">
              <img 
                src="https://ysu.edu/sites/default/files/First%20Year%20Student%20Services%20Logo%20Web.jpg" 
                alt="FYSS Logo" 
                className="h-16"
              />
            </div>
            <p className="text-sm text-gray-700 text-center">
              First Year Student Services helps students transition to college life and develop skills for success.
            </p>
            <div className="mt-2 text-center">
              <a 
                href="https://ysu.edu/first-year-student-services" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:underline"
              >
                Visit FYSS Website
              </a>
            </div>
          </div>
        </div>
        
        {/* Calendar View */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-4 h-full relative">
            {/* Monthly background image */}
            {monthBackgrounds[currentDate.getMonth()] && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" 
                style={{ 
                  backgroundImage: `url(${monthBackgrounds[currentDate.getMonth()]})`,
                  zIndex: 0 
                }}
                aria-hidden="true"
              />
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-2xl text-gray-400">Loading calendar...</div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600, position: 'relative', zIndex: 10 }}
                onSelectEvent={handleEventClick}
                eventPropGetter={eventStyleGetter}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={currentView}
                onView={handleViewChange}
                onNavigate={handleNavigate}
                date={currentDate}
                popup
                components={{
                  toolbar: CustomToolbar,
                }}
              />
            )}
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
                  style={{ backgroundColor: CATEGORIES[selectedEvent.category] }}
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
    </div>
  );
};

// Custom toolbar component for better navigation controls
const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };
  
  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };
  
  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };
  
  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span className="text-lg font-semibold">
        {date.format('MMMM YYYY')}
      </span>
    );
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <button
          onClick={goToBack}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          &#8249; Back
        </button>
        <button
          onClick={goToCurrent}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Today
        </button>
        <button
          onClick={goToNext}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Next &#8250;
        </button>
      </div>
      <div className="flex-grow text-center">
        {label()}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => toolbar.onView('month')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'month' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => toolbar.onView('week')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'week' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => toolbar.onView('day')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'day' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => toolbar.onView('agenda')}
          className={`px-3 py-1 rounded ${
            toolbar.view === 'agenda' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default YSUCalendarApp;