import React from "react";
import { ChevronLeft } from "lucide-react";
import { HEADER_ICON_SIZE, HEADER_ICON_STROKE_WIDTH } from "./constants";

interface BackButtonProps {
  progress: number;
}

const BackButton = ({ progress }: BackButtonProps) => (
  <div className="rounded-full transition-all duration-700"
    style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}>
    <button className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700">
      <ChevronLeft
        size={HEADER_ICON_SIZE} // Changed to constant
        strokeWidth={HEADER_ICON_STROKE_WIDTH} // Changed to constant
        className="transition-all duration-700"
        style={{
          color: progress > 0.5 
            ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
            : `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
        }}
      />
    </button>
  </div>
);

export default BackButton;