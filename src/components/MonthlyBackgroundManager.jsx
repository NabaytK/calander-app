import React from 'react';

// Monthly background configuration
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

/**
 * Component that renders a monthly background
 */
function MonthlyBackground({ date, opacity = 0.1, className = '' }) {
  const month = date.getMonth();
  const backgroundImage = monthBackgrounds[month];
  
  if (!backgroundImage) return null;
  
  return (
    <div 
      className={`absolute inset-0 bg-cover bg-center pointer-events-none ${className}`}
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        opacity 
      }}
      aria-hidden="true"
    />
  );
}

export { MonthlyBackground, monthBackgrounds };
