import React from "react";
import { LucideIcon } from "lucide-react";
import { HEADER_ICON_SIZE, HEADER_ICON_STROKE_WIDTH } from "./constants";

interface HeaderActionButtonProps {
  Icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  progress: number;
  activeColor?: string;
  badge?: number;
  fillWhenActive?: boolean;
  transform?: string;
}

const HeaderActionButton = ({ 
  Icon, 
  active = false, 
  onClick, 
  progress, 
  activeColor = '#f97316',
  badge,
  fillWhenActive = true,
  transform = ''
}: HeaderActionButtonProps) => {
  return (
    <div className="rounded-full transition-all duration-700"
      style={{ 
        backgroundColor: transform ? 'transparent' : `rgba(0, 0, 0, ${0.1 * (1 - progress)})` 
      }}>
      <button
        onClick={onClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700"
      >
        <Icon
          size={HEADER_ICON_SIZE} // Changed to constant
          strokeWidth={HEADER_ICON_STROKE_WIDTH} // Changed to constant
          className="transition-all duration-700"
          style={{
            fill: active && fillWhenActive ? activeColor : 'transparent',
            color: active ? activeColor : progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`
          }}
        />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
};

export default HeaderActionButton;