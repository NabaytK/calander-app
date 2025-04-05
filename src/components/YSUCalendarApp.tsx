'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Categories with colors - including FYSS
const CATEGORIES = {
  Academic: "#4285F4", // blue
  Financial: "#34A853", // green
  Events: "#FBBC05",    // yellow
  Athletics: "#EA4335", // red
  Deadlines: "#9C27B0", // purple
  Holidays: "#FF9800",  // orange
  FYSS: "#00796B"       // teal - First Year Student Services
};

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

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
  8: "/backgrounds/september.jpg",   // September
  9: "/backgrounds/october.jpg",     // October
  10: "/backgrounds/november.jpg",   // November
  11: "/backgrounds/december.jpg"    // December
};

const YSUCalendarApp = () => {
  // State for managing calendar events and UI
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState(
    Object.keys(CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events when component mounts
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        // In a production environment, you would fetch real data from an API
        // For example:
        // const response = await fetch('/api/events');
        // const data = await response.json();
        // setEvents(data);
        
        // For now, we're using sample events
        const currentYear = new Date().getFullYear();
        const sampleEvents = [
          {
            id: 1,
            title: "Fall Semester Begins",
            start: new Date(currentYear, 7, 21, 8, 0),
            end: new Date(currentYear, 7, 21, 17, 0),
            description: "First day of Fall semester classes.",
            location: "YSU Campus",
            category: "Academic"
          },
          {
            id: 2,
            title: "Tuition Due",
            start: new Date(currentYear, 8, 5, 0, 0),
            end: new Date(currentYear, 8, 5, 23, 59),
            description: "Last day to pay Fall tuition.",
            location: "YSU Office of Student Accounts",
            category: "Financial"
          },
          {
            id: 3,
            title: "Homecoming Game",
            start: new Date(currentYear, 9, 12, 14, 0),
            end: new Date(currentYear, 9, 12, 17, 0),
            description: "Annual YSU Homecoming football game.",
            location: "Stambaugh Stadium",
            category: "Athletics"
          },
          {
            id: 4,
            title: "Registration Deadline",
            start: new Date(currentYear, 10, 10, 0, 0),
            end: new Date(currentYear, 10, 10, 23, 59),
            description: "Last day to register for Spring classes.",
            location: "Online",
            category: "Deadlines"
          },
          {
            id: 5,
            title: "Fall Break",
            start: new Date(currentYear, 10, 25, 0, 0),
            end: new Date(currentYear, 10, 29, 23, 59),
            description: "No classes for Fall break.",
            location: "YSU Campus",
            category: "Holidays"
          },
          {
            id: 6,
            title: "Student Art Exhibition",
            start: new Date(currentYear, 9, 5, 18, 0),
            end: new Date(currentYear, 9, 5, 21, 0),
            description: "Showcase of student artwork from the Fall semester.",
            location: "McDonough Museum of Art",
            category: "Events"
          },
          {
            id: 7,
            title: "FYSS Orientation Session",
            start: new Date(currentYear, 7, 15, 10, 0),
            end: new Date(currentYear, 7, 15, 12, 0),
            description: "First Year Student Services orientation session for new students.",
            location: "Kilcawley Center",
            category: "FYSS",
            link: "https://ysu.edu/first-year-student-services",
            linkLabel: "View Orientation Details"
          },
          {
            id: 8,
            title: "FYSS Study Skills Workshop",
            start: new Date(currentYear, 8, 10, 14, 0),
            end: new Date(currentYear, 8, 10, 15, 30),
            description: "Learn essential study skills and time management for college success.",
            location: "Maag Library, Room 103",
            category: "FYSS",
            link: "https://www.ysu.edu/first-year-student-services/workshops",
            linkLabel: "Workshop Resources"
          },
          {
            id: 9,
            title: "FYSS Career Exploration Event",
            start: new Date(currentYear, 9, 5, 13, 0),
            end: new Date(currentYear, 9, 5, 15, 0),
            description: "Explore different career paths and meet with YSU alumni in various fields.",
            location: "Williamson Hall",
            category: "FYSS",
            link: "https://ysu.edu/career-services",
            linkLabel: "Career Services Info"
          }
        ];
        setEvents(sampleEvents);
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Failed to load calendar events. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  // Filter events based on categories and search query
  const filteredEvents = events.filter(event => 
    visibleCategories[event.category] && 
    (searchQuery === "" || 
     event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     event.description.toLowerCase().includes(searchQuery.toLowerCase()))
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

    // Make FYSS events stand out
    if (event.category === 'FYSS') {
      style.border = '2px solid #004D40';
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

  // Create and trigger ICS download
  const handleDownloadICS = () => {
    const url = `/api/calendar${selectedCategory ? `?category=${selectedCategory}` : ''}`;
    window.open(url, '_blank');
  };

  // Generate a subscription link
  const getSubscriptionLink = () => {
    return `${window.location.origin}/api/calendar${selectedCategory ? `?category=${selectedCategory}` : ''}`;
  };
  
  // Handle category selection for subscription
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Handle date navigation
  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with YSU FYSS logo */}
      <header className="bg-red-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" width="36" height="36">
                <circle cx="50" cy="50" r="45" fill="white" stroke="#C41230" strokeWidth="2"/>
                <text x="50" y="60" fontFamily="Arial" fontSize="24" textAnchor="middle" fill="#C41230">YSU</text>
              </svg>
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
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
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
      <main className="flex-grow container mx-auto p-4 md:flex">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4 md:mr-4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Calendar Filters</h2>
          
          {/* Quick filter buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => toggleAllCategories(true)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
            >
              Show All
            </button>
            <button 
              onClick={toggleFYSSOnly}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded text-white text-sm font-medium"
            >
              FYSS Events Only
            </button>
          </div>
          
          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Event Categories</h3>
            
            <div className="space-y-2">
              {Object.entries(CATEGORIES).map(([category, color]) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={visibleCategories[category]}
                    onChange={() => toggleCategory(category)}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`category-${category}`} 
                    className="flex items-center cursor-pointer"
                  >
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
          
          {/* Upcoming Events List */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Upcoming Events</h3>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading events...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredEvents
                  .filter(event => event.start >= new Date())
                  .sort((a, b) => a.start - b.start)
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
                  <div className="py-2 text-center text-gray-500">No upcoming events</div>
                )}
              </div>
            )}
          </div>
          
          {/* FYSS Info Box */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-center mb-2">First Year Student Services</h3>
            <p className="text-sm text-gray-700 mb-3">
              FYSS helps new students transition to college life and develop the skills needed for academic success.
            </p>
            <div className="text-center">
              <a 
                href="https://ysu.edu/first-year-student-services" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:underline font-medium"
              >
                Visit FYSS Website →
              </a>
            </div>
          </div>
        </div>
        
        {/* Calendar View */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-4 relative">
            {/* Monthly background image */}
            <div 
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-10 pointer-events-none overflow-hidden"
              style={{ 
                backgroundImage: `url(${monthBackgrounds[currentDate.getMonth()]})`,
                zIndex: 0 
              }}
              aria-hidden="true"
            />
            
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-xl text-gray-400">Loading calendar...</div>
              </div>
            ) : (
              <div className="relative z-10">
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  onSelectEvent={handleEventClick}
                  eventPropGetter={eventStyleGetter}
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  view={currentView}
                  onView={handleViewChange}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  popup
                  components={{
                    toolbar: CustomToolbar,
                  }}
                />
              </div>
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
                  <br />
                  {moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
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
            
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCategorySelect(selectedEvent.category);
                  handleDownloadICS();
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
              <p className="mb-4">Subscribe to the YSU Calendar to keep up with important dates and events.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select calendar type:</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={selectedCategory || ""}
                  onChange={(e) => handleCategorySelect(e.target.value || undefined)}
                >
                  <option value="">All Events</option>
                  {Object.keys(CATEGORIES).map(category => (
                    <option key={category} value={category}>{category} Events</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
                <div className="text-sm font-medium mb-2">Calendar URL:</div>
                <input
                  type="text"
                  value={getSubscriptionLink()}
                  readOnly
                  className="w-full p-2 border rounded text-center text-sm bg-white"
                  onClick={(e) => e.target.select()}
                />
              </div>
              
              <div className="space-y-3 text-sm">
                <h3 className="font-medium text-base">How to Subscribe:</h3>
                
                <div>
                  <h4 className="font-medium">Google Calendar:</h4>
                  <ol className="ml-5 list-decimal">
                    <li>In Google Calendar, click the "+" next to "Other calendars"</li>
                    <li>Select "From URL"</li>
                    <li>Paste the URL above and click "Add calendar"</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium">Apple Calendar:</h4>
                  <ol className="ml-5 list-decimal">
                    <li>In Calendar, select File > New Calendar Subscription</li>
                    <li>Paste the URL above and click "Subscribe"</li>
                    <li>Configure sync settings and click "OK"</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium">Outlook:</h4>
                  <ol className="ml-5 list-decimal">
                    <li>In Outlook, go to Calendar view</li>
                    <li>Right-click on "Other calendars"</li>
                    <li>Select "Add calendar" then "From Internet"</li>
                    <li>Paste the URL above and click "OK"</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setSubscribeModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleDownloadICS}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download .ICS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom toolbar component
const CustomToolbar = (props) => {
  const goToBack = () => {
    props.onNavigate('PREV');
  };
  
  const goToNext = () => {
    props.onNavigate('NEXT');
  };
  
  const goToCurrent = () => {
    props.onNavigate('TODAY');
  };
  
  const label = () => {
    const date = moment(props.date);
    return (
      <span className="text-lg font-semibold">
        {date.format('MMMM YYYY')}
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
      <div className="flex space-x-2 mb-2 sm:mb-0">
        <button
          onClick={goToBack}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          &#8249; Previous
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
      
      <div className="text-center mb-2 sm:mb-0">
        {label()}
      </div>
      
      <div className="flex space-x-1">
        <button
          onClick={() => props.onView('month')}
          className={`px-3 py-1 rounded text-sm ${
            props.view === 'month' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => props.onView('week')}
          className={`px-3 py-1 rounded text-sm ${
            props.view === 'week' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => props.onView('day')}
          className={`px-3 py-1 rounded text-sm ${
            props.view === 'day' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => props.onView('agenda')}
          className={`px-3 py-1 rounded text-sm ${
            props.view === 'agenda' 
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