import { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

interface BundleTier {
  min: number;
  max: number | null;
  discount: number;
  isMinimum?: boolean;
}

interface BundleDealsProps {
  className?: string;
  currentTier?: BundleTier | null;
  onQuantitySelect?: (quantity: number) => void;
  calculatePrice?: (discount: number) => number;
  bundleDeals?: BundleTier[];
  productPrice?: number;
}

const BundleDeals = ({ 
  className = '', 
  currentTier = null, 
  onQuantitySelect = null, 
  calculatePrice = null,
  bundleDeals = [],
  productPrice = 100
}: BundleDealsProps) => {
  // Use provided bundle deals or fallback to default
  const visibleTiers = bundleDeals.length > 0 ? bundleDeals : [
    { min: 1, max: 9, discount: 0, isMinimum: true },
    { min: 10, max: 49, discount: 5 },
    { min: 50, max: 99, discount: 10 },
    { min: 100, max: 499, discount: 15 },
    { min: 500, max: 999, discount: 20 },
    { min: 1000, max: null, discount: 25 }
  ];

  // Calculate price based on discount
  const calculateFinalPrice = calculatePrice || ((discount) => productPrice * (1 - discount / 100));
  const [showAll, setShowAll] = useState(false);

  // Show only first 3 tiers initially
  const displayedTiers = showAll ? visibleTiers : visibleTiers.slice(0, 3);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bundle Deals</h3>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1" size={12} />
          <span>Limited time offer</span>
        </div>
      </div>

      {/* Selected Bundle Display */}
      {currentTier && (
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                {currentTier.max === Infinity ? `${currentTier.min}+ units` : `${currentTier.min}-${currentTier.max} units`}
                {currentTier.isMinimum && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                    Minimum Order
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {currentTier.discount > 0 ? `Discounted pricing` : 'Standard pricing'}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-orange-700">
                {calculateFinalPrice(currentTier.discount).toFixed(0)} HTG/unit
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Bundle Options - Grid Layout */}
      <div className="grid grid-cols-3 gap-4">
        {displayedTiers.map((tier, index) => {
          const rangeLabel = `${tier.min}+ units`;
          const isSelected = currentTier === tier;
          const isMinimumTier = tier.isMinimum;

          return (
            <div
              key={index}
              onClick={() => onQuantitySelect?.(tier.min)}
              className={`bg-gray-100 hover:bg-gray-200 rounded-lg p-2 cursor-pointer transition-all relative ${
                isSelected
                  ? 'bg-orange-100 hover:bg-orange-200'
                  : ''
              } ${
                isMinimumTier
                  ? 'ring-2 ring-red-400 bg-red-50 hover:bg-red-100 shadow-lg'
                  : ''
              }`}
            >
              {isMinimumTier && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                  Min
                </div>
              )}
              
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  {rangeLabel}
                </div>
                
                <div className="text-lg font-bold text-gray-900">
                  {calculateFinalPrice(tier.discount).toFixed(0)} HTG
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More/Less Button */}
      {visibleTiers.length > 3 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-full w-full text-gray-600 font-medium"
        >
          <span>{showAll ? 'Show less bundles' : 'View more bundles'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default BundleDeals;