import { useState, useRef, useEffect } from "react";

export default function TabsNavigation({ tabs, activeTab, onTabChange, className = "", style = {} }) {
  const tabRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);

  // Initialize underline width on mount
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      // If no activeTab is set, use the first tab
      const firstTab = tabs[0];
      if (firstTab) {
        onTabChange(firstTab.id);
      }
    }
  }, [tabs, activeTab, onTabChange]);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs]);

  // Function to update underline position and width
  const updateUnderline = () => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      // Get the text span element
      const textSpan = activeTabElement.querySelector('span:last-child'); // Target the label span specifically
      
      if (textSpan) {
        // Calculate underline width based on text content
        const textWidth = textSpan.offsetWidth;
        const newWidth = Math.max(textWidth * 0.8, 20); // Minimum 20px width, 80% of text width
        
        // Calculate position relative to the button center 
        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (activeTabElement.offsetWidth / 2);
        const underlineStart = buttonCenter - (newWidth / 2);
        
        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    }
  };

  // Update underline when active tab changes
  useEffect(() => {
    if (activeTab) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(updateUnderline, 0);
    }
  }, [activeTab, tabs]);

  // Handle tab scrolling
  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const newScrollLeft =
        activeTabElement.offsetLeft - (containerElement.offsetWidth / 2) + (activeTabElement.offsetWidth / 2);

      containerElement.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeTab, tabs]);

  // Set initial underline when component mounts
  useEffect(() => {
    if (activeTab && tabs.length > 0) {
      setTimeout(updateUnderline, 100); // Small delay to ensure fonts are loaded
    }
  }, []);

  const handleTabClick = (id) => {
    onTabChange(id);
  };

  // Default style (original)
  const defaultStyle = {
    maxHeight: '40px',
    opacity: 1,
    backgroundColor: 'white',
  };

  // Merge styles - passed style overrides default
  const finalStyle = { ...defaultStyle, ...style };

  return (
    <div
      className={`relative w-full transition-all duration-700 overflow-hidden ${className}`}
      style={finalStyle}
    >
      {/* Tabs List */}
      <div className="h-full w-full">
        <div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto no-scrollbar h-full w-full relative"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Left padding spacer for edge-to-edge scrolling */}
          <div className="flex-shrink-0 w-4"></div>

          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={el => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`relative flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none mx-1 flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-red-600'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}

          {/* Right padding spacer for edge-to-edge scrolling */}
          <div className="flex-shrink-0 w-4"></div>

          {/* Animated underline - positioned absolutely within the scroll container */}
          {activeTab && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: underlineWidth,
                left: underlineLeft,
                transform: 'translateZ(0)', // Hardware acceleration
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}