import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import QRCode from 'qrcode.react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEvents, CATEGORIES, getCalendarUrl, downloadCalendar, CalendarEvent } from '@/services/eventService';

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const YSUCalendarApp: React.FC = () => {
  // Get events from our service
  const { events, loading, error } = useEvents();
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>(
    Object.keys(CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

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
      {}
    );
    setVisibleCategories(newCategories);
  };

  // Create and trigger ICS download
  const handleDownloadICS = () => {
    downloadCalendar(selectedCategory);
  };

  // Generate a subscription link
  const getSubscriptionLink = () => {
    return getCalendarUrl(selectedCategory);
  };
  
  // Handle category selection for subscription
  const handleCategorySelect = (category: string | undefined) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Rest of the component remains the same */}
    </div>
  );
};

export default YSUCalendarApp;
