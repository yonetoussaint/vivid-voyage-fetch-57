import { LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, animate as fmAnimate } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CategoryTab {
  id: string;
  name: string;
  icon: ReactNode;
  path: string;
}

interface CategoryTabsProps {
  progress: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: CategoryTab[];
}

const CategoryTabs = ({
  progress,
  activeTab,
  setActiveTab,
  categories,
}: CategoryTabsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, categories.length);
  }, [categories]);

  useEffect(() => {
    const activeTabIndex = categories.findIndex(cat => cat.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const newScrollLeft =
        activeTabElement.offsetLeft - (containerElement.offsetWidth / 2) + (activeTabElement.offsetWidth / 2);

      fmAnimate(scrollX, newScrollLeft, {
        duration: 0.4,
        ease: 'easeInOut',
      });

      // Measure the width of the active tab's content
      const textSpan = activeTabElement.querySelector('span');
      if (textSpan) {
        setUnderlineWidth(textSpan.offsetWidth * 0.6); // 60% of text width
      }
    }
  }, [activeTab, categories, scrollX]);

  useEffect(() => {
    const unsubscribe = scrollX.on('change', latestValue => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = latestValue;
      }
    });
    return () => unsubscribe();
  }, [scrollX]);

  const handleTabClick = (id: string, path: string) => {
    console.log('Tab clicked:', id, 'Navigating to:', path);
    setActiveTab(id);
    // Only navigate if path doesn't start with # (for product sections)
    if (!path.startsWith('#')) {
      navigate(path);
    }
  };

  const handleCategoriesClick = () => {
    navigate('/all-categories');
  };

  return (
    <div
      className="relative w-full transition-all duration-700 overflow-hidden bg-white"
      style={{
        maxHeight: '40px',
        opacity: 1,
      }}
    >
      {/* Tabs List */}
      <div className="pr-[48px] h-full">
        <motion.div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto no-scrollbar h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map(({ id, name, icon, path }, index) => (
            <button
              key={id}
              ref={el => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(id, path)}
              aria-pressed={activeTab === id}
              className={`relative flex items-center px-3 py-1 text-xs font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none mr-1 ${
                activeTab === id
                  ? 'text-red-600'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              <span className="font-semibold">{name}</span>
              {activeTab === id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 mx-auto h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                  style={{ 
                    width: underlineWidth,
                  }}
                  layoutId="activeCategoryUnderline"
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 30,
                    width: { duration: 0.2 }
                  }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Icon Button on Right */}
      <div className="absolute top-0 right-0 h-full flex items-center pl-1 pr-1 z-10 space-x-1 bg-white">
        <div className="h-6 w-px bg-gray-200 opacity-50" />
        <button
          type="button"
          onClick={handleCategoriesClick}
          className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all duration-200"
          aria-label={t('allCategories', { ns: 'categories' })}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;