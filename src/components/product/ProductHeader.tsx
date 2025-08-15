
import React, { useState } from "react";
import { Heart, Share, Package, FileText, Star, HelpCircle, Truck, Lightbulb } from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import LiveBadge from "./header/LiveBadge";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import AliExpressSearchBar from "@/components/shared/AliExpressSearchBar";
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import CategoryTabs from "../home/header/CategoryTabs";
import { Separator } from "@/components/ui/separator";

interface ProductHeaderProps {
  activeSection?: string;
  onTabChange?: (section: string) => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  activeSection = "overview", 
  onTabChange 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { progress } = useScrollProgress();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const productSections = [
    { id: "overview", name: "Overview", icon: <Package className="w-4 h-4" />, path: "#overview" },
    { id: "description", name: "Description", icon: <FileText className="w-4 h-4" />, path: "#description" },
    { id: "reviews", name: "Reviews", icon: <Star className="w-4 h-4" />, path: "#reviews" },
    { id: "qa", name: "Q&A", icon: <HelpCircle className="w-4 h-4" />, path: "#qa" },
    { id: "shipping", name: "Shipping", icon: <Truck className="w-4 h-4" />, path: "#shipping" },
    { id: "specifications", name: "Specs", icon: <Lightbulb className="w-4 h-4" />, path: "#specifications" }
  ];
  
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-30 flex flex-col transition-all duration-700"
    >
      {/* Main Header */}
      <div 
        className="py-2 px-3 w-full transition-all duration-700"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${progress * 0.95})`,
          backdropFilter: `blur(${progress * 8}px)`,
        }}
      >
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          {/* Left side - Back button and Live badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <BackButton progress={progress} />
            {progress < 0.5 && <LiveBadge progress={progress} />}
          </div>

          {/* Center - Search bar when scrolled */}
          <div className="flex-1 mx-4">
            {progress >= 0.5 && (
              <AliExpressSearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                placeholder="Search products..."
              />
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <HeaderActionButton 
              Icon={Heart} 
              active={isFavorite} 
              onClick={toggleFavorite} 
              progress={progress} 
              activeColor="#f43f5e"
            />

            <HeaderActionButton 
              Icon={Share} 
              progress={progress} 
            />
          </div>
        </div>
      </div>

      {/* Product Section Tabs - only show when scrolled */}
      {progress >= 0.3 && onTabChange && (
        <CategoryTabs
          categories={productSections}
          activeTab={activeSection}
          setActiveTab={onTabChange}
          progress={progress}
        />
      )}

      {/* Separator at bottom of header */}
      {progress >= 0.3 && (
        <Separator className="bg-border/50" />
      )}

    </div>
  );
};

export default ProductHeader;
