import React, { useState } from "react";
import {
  Palette,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import ProductSectionHeader from "./ProductSectionHeader";
import ToggleExpandButton from "./ToggleExpandButton";

// Color variant item component
const ColorVariantItem = ({
  variant,
  selectedColor,
  onColorChange,
  getColorHex,
  convertToHTG,
}) => {
  const isSelected = selectedColor === variant.name;
  const isOutOfStock = variant.stock === 0;

  return (
    <div
      className={`border rounded-lg transition-all relative
        ${isSelected
          ? "border-[#FF4747] bg-red-50/30 shadow-sm ring-2 ring-[#FF4747]/20"
          : "border-gray-200 hover:border-red-200 hover:shadow hover:scale-[1.02]"}
        ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        transform transition-transform duration-150 ease-in-out hover:bg-red-50/10`}
      onClick={() => {
        if (!isOutOfStock) {
          onColorChange(variant.name);
        }
      }}
    >
      {/* Stock quantity badge - top left */}
      {!isOutOfStock && (
        <div className="absolute top-1 left-1 bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center z-10">
          <span className="text-[9px] font-medium px-1">
            {variant.stock}
          </span>
        </div>
      )}
     
      {/* Out of Stock label */}
      {isOutOfStock && (
        <span className="absolute top-1 left-1 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded z-10">
          Out of Stock
        </span>
      )}

      {/* Selection checkmark */}
      {isSelected && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-[#FF4747] rounded-full flex items-center justify-center shadow-md z-20">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-md overflow-hidden">
        <img
          src={
            variant.image ||
            `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center`
          }
          alt={variant.name}
          className="w-full h-full object-cover"
        />
        
        {/* Price label on image bottom center */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-1">
          <div className="text-xs font-semibold">
            {convertToHTG(variant.price)} HTG
          </div>
        </div>
      </div>
      
      {/* Variant name below image */}
      <div className="p-2 text-center">
        <div className="text-xs text-gray-600">
          {variant.name}
        </div>
      </div>
    </div>
  );
};

// Stock level information component
const StockLevelInfo = ({ selectedVariant, stockPercentage, getStockLevelInfo }) => {
  const selectedStockInfo = getStockLevelInfo(selectedVariant.stock);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${selectedStockInfo.progressColor}`}
          ></div>
          <span className="text-sm font-medium text-gray-700">
            {selectedVariant.stock} units available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
            ${selectedStockInfo.badgeColor} 
            ${selectedStockInfo.urgency === "high" ? "animate-pulse" : ""}`}
          >
            {selectedStockInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// Color variants grid component
const ColorVariantsGrid = ({
  displayedColorVariants,
  selectedColor,
  handleColorChange,
  getColorHex,
  convertToHTG,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {displayedColorVariants.map((variant) => (
        <ColorVariantItem
          key={variant.name}
          variant={variant}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
          getColorHex={getColorHex}
          convertToHTG={convertToHTG}
        />
      ))}
    </div>
  );
};

// Color variant interface
interface ColorVariant {
  name: string;
  price: number;
  stock: number;
  bestseller?: boolean;
  image?: string;
}

// Main component interface
interface ProductColorVariantsProps {
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  variants?: ColorVariant[];
  hideHeader?: boolean;
}

const ProductColorVariants = ({ 
  selectedColor: propSelectedColor,
  onColorChange,
  variants: propVariants,
  hideHeader = false
}: ProductColorVariantsProps = {}) => {
  const [internalSelectedColor, setInternalSelectedColor] = useState("Black");
  const [showAllColors, setShowAllColors] = useState(false);
  
  // Use prop or internal state
  const selectedColor = propSelectedColor || internalSelectedColor;

  // Use passed variants or default variants
  const colorVariants = propVariants || [
    { name: "Black", price: 79.99, stock: 256, bestseller: true },
    { name: "White", price: 89.99, stock: 124, bestseller: false },
    { name: "Navy Blue", price: 84.99, stock: 55, bestseller: false },
    { name: "Forest Green", price: 89.99, stock: 180, bestseller: false },
    { name: "Jet Black", price: 89.99, stock: 18, bestseller: false },
    { name: "Red", price: 89.99, stock: 0, bestseller: false },
  ];

  const TOTAL_CAPACITY = 256;

  const displayedColorVariants = showAllColors
    ? colorVariants
    : colorVariants.slice(0, 3);

  const selectedVariant =
    colorVariants.find((v) => v.name === selectedColor) || colorVariants[0];

  const stockPercentage = Math.min(
    100,
    Math.max(0, (selectedVariant.stock / TOTAL_CAPACITY) * 100)
  );

  const toggleShowAllColors = () => {
    setShowAllColors(!showAllColors);
  };

  // USD to HTG conversion rate
  const USD_TO_HTG = 132;
  const convertToHTG = (usdPrice) => {
    return (usdPrice * USD_TO_HTG).toFixed(0);
  };

  const getStockLevelInfo = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        badgeColor: "bg-red-100 text-red-800",
        progressColor: "bg-gray-400",
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        urgency: "high",
        message: "Sold out! But we'll restock soon – stay tuned!",
      };
    } else if (stock >= 1 && stock <= 25) {
      return {
        label: "Low Stock",
        badgeColor: "bg-red-100 text-red-800",
        progressColor: "bg-red-500",
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        urgency: "high",
        message: "Almost sold out – just a few left!",
      };
    } else if (stock >= 26 && stock <= 64) {
      return {
        label: "Running Low",
        badgeColor: "bg-orange-100 text-orange-800",
        progressColor: "bg-orange-500",
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
        urgency: "medium",
        message: "Stock is running low! Don't miss your chance.",
      };
    } else if (stock >= 65 && stock <= 128) {
      return {
        label: "In Stock",
        badgeColor: "bg-yellow-100 text-yellow-800",
        progressColor: "bg-yellow-500",
        icon: <CheckCircle className="w-4 h-4 text-yellow-500" />,
        urgency: "low",
        message: "Going quick – 50% of our stock is already gone!",
      };
    } else if (stock >= 129 && stock <= 200) {
      return {
        label: "Good Stock",
        badgeColor: "bg-green-100 text-green-800",
        progressColor: "bg-green-500",
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        urgency: "none",
        message: "Still available, but demand is picking up. Secure yours today!",
      };
    } else {
      return {
        label: "Plenty Available",
        badgeColor: "bg-blue-100 text-blue-800",
        progressColor: "bg-blue-500",
        icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
        urgency: "none",
        message: "Plenty available – get the best pick while stock is high!",
      };
    }
  };

  const getColorHex = (name) => {
    const colorMap = {
      Black: "#000000",
      "Midnight Black": "#000000",
      White: "#ffffff",
      "Pearl White": "#ffffff",
      "Jet Black": "#111111",
      "Navy Blue": "#000080",
      "Ocean Blue": "#1e3a8a",
      Red: "#FF0000",
      "Crimson Red": "#dc2626",
      "Forest Green": "#228B22",
    };
    return colorMap[name] || "#CCCCCC";
  };

  const handleColorChange = (color) => {
    if (onColorChange) {
      onColorChange(color);
    } else {
      setInternalSelectedColor(color);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      {!hideHeader && (
        <ProductSectionHeader
          title="Product Variants"
          icon={Palette}
          selectedInfo={selectedColor}
        />
      )}

      <ColorVariantsGrid
        displayedColorVariants={displayedColorVariants}
        selectedColor={selectedColor}
        handleColorChange={handleColorChange}
        getColorHex={getColorHex}
        convertToHTG={convertToHTG}
      />

      {colorVariants.length > 3 && (
        <div className="text-center">
          <ToggleExpandButton
            isExpanded={showAllColors}
            onToggle={toggleShowAllColors}
          />
        </div>
      )}

    </div>
  );
};

export default ProductColorVariants;