import React from "react";
import { LucideIcon } from "lucide-react";
interface ProductSectionHeaderProps {
  title: string;
  icon: LucideIcon;
  count?: number;
  countLabel?: string;
  rightContent?: React.ReactNode;
  selectedInfo?: string;
  leftExtra?: React.ReactNode;
}

const ProductSectionHeader: React.FC<ProductSectionHeaderProps> = ({
  title,
  icon: Icon,
  count,
  countLabel,
  rightContent,
  selectedInfo,
  leftExtra
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
  <div className="flex items-center gap-1 flex-wrap">
  <Icon className="w-4 h-4 text-[#FF4747]" />

  {/* Group title and badge */}
  <div className="flex items-center gap-1">
    <span className="text-sm font-medium text-gray-800">{title}</span>

    {leftExtra && (
      <div>{leftExtra}</div>
    )}
  </div>

  {count !== undefined && countLabel && (
    <span className="text-xs text-[#FF4747] font-medium">
      ({count} {countLabel})
    </span>
  )}
</div>

  <div className="flex items-center gap-2">
    {selectedInfo && (
      <span className="text-xs text-gray-500">
        Selected: <span className="font-medium">{selectedInfo}</span>
      </span>
    )}
    {rightContent}
  </div>
</div>
  );
};

export default ProductSectionHeader;