
import React, { useState } from 'react';
import { Star, User, Box, ChevronRight } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import RatingBreakdown from "./RatingBreakdown";

const EnhancedRating = () => {
  // Sample data
  const rating = 4.8;
  const reviews = 2543;
  const sold = "5.0k+";
  const [showStats, setShowStats] = useState(false);
  const isMobile = useIsMobile();
  
  // More detailed rating stats
  const ratingBreakdown = [
    { stars: 5, percentage: 78, count: 1983 },
    { stars: 4, percentage: 15, count: 381 },
    { stars: 3, percentage: 4, count: 102 },
    { stars: 2, percentage: 2, count: 51 },
    { stars: 1, percentage: 1, count: 26 }
  ];
  
  const toggleStats = () => {
    setShowStats(!showStats);
  };
  
  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star 
            key={i} 
            size={isMobile ? 14 : 16} 
            className="text-yellow-400 fill-yellow-400" 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star size={isMobile ? 14 : 16} className="text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={isMobile ? 14 : 16} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star 
            key={i} 
            size={isMobile ? 14 : 16} 
            className="text-gray-300" 
          />
        );
      }
    }
    
    return stars;
  };

  return (
    <div className="w-full px-2 py-2">
      {/* Rating stars and count - improved padding */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center">
          {renderStars(rating)}
        </div>
        <span className="font-bold text-base sm:text-lg text-gray-800">{rating}</span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs sm:text-sm text-blue-600 underline underline-offset-2"
                onClick={toggleStats}
              >
                {reviews} Reviews
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Click to view rating details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-gray-300">|</span>
        
        <div className="flex items-center text-gray-600">
          <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
          <span className="font-medium text-xs sm:text-sm">{sold} Sold</span>
        </div>
      </div>
      
      {/* Conditionally show rating breakdown */}
      {showStats && (
        <div className="relative mt-3">
          <RatingBreakdown 
            breakdown={ratingBreakdown} 
            totalReviews={reviews} 
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 sm:h-7 text-[10px] sm:text-xs absolute top-2 right-2"
            onClick={toggleStats}
          >
            Hide
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedRating;
