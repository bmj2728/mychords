import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for autoscroll functionality
 * @param {React.RefObject} contentRef - Reference to the scrollable content element
 * @param {number} initialSpeed - Initial scroll speed in pixels per 100ms
 * @returns {Object} - Autoscroll controls and state
 */
const useAutoscroll = (contentRef, initialSpeed = 2) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(initialSpeed);
  const scrollIntervalRef = useRef(null);
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);
  
  // Toggle autoscroll
  const toggleAutoscroll = () => {
    if (isScrolling) {
      // Stop scrolling
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
      setIsScrolling(false);
    } else {
      // Start scrolling
      scrollIntervalRef.current = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop += scrollSpeed;
          
          // Check if we've reached the bottom
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
          if (scrollTop + clientHeight >= scrollHeight) {
            // Stop scrolling at the bottom
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
            setIsScrolling(false);
          }
        }
      }, 100);
      setIsScrolling(true);
    }
  };
  
  // Change scroll speed
  const changeScrollSpeed = (newSpeed) => {
    setScrollSpeed(newSpeed);
    
    // Reset interval with new speed if already scrolling
    if (isScrolling) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop += newSpeed;
          
          // Check if we've reached the bottom
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
          if (scrollTop + clientHeight >= scrollHeight) {
            // Stop scrolling at the bottom
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
            setIsScrolling(false);
          }
        }
      }, 100);
    }
  };
  
  return {
    isScrolling,
    scrollSpeed,
    toggleAutoscroll,
    changeScrollSpeed
  };
};

export default useAutoscroll; 