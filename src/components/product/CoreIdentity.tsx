import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface CoreIdentityProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_price?: number | null;
  };
}

const ExpandableCard: React.FC<CoreIdentityProps> = ({ product }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('HTG');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 23,
    minutes: 45,
    seconds: 30
  });
  const [showDiscount, setShowDiscount] = useState(false);

  // Use real product data or fallback to defaults
  const productData = product || {
    id: '1',
    name: 'Premium Wireless Headphones - Noise Cancelling Bluetooth 5.0',
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers, professionals, and travelers who demand the best in audio quality and comfort.',
    price: 149.99,
    discount_price: 104.99
  };

  const currencies = {
    USD: 'USD',
    HTG: 'HTG',
    EUR: 'EUR'
  };

  // Updated mapping to match your actual currencies
  const currencyToCountry = {
    USD: 'us',
    HTG: 'ht', // Haiti flag
    EUR: 'eu'
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Toggle discount display effect
  useEffect(() => {
    const discountTimer = setInterval(() => {
      setShowDiscount(prev => !prev);
    }, 3000);

    return () => clearInterval(discountTimer);
  }, []);

  const formatNumber = (num) => {
    return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const convertToHTG = (usdPrice) => {
    const exchangeRate = 132;
    const price = parseFloat(usdPrice) || 0;
    return formatNumber(price * exchangeRate);
  };

  const convertToEUR = (usdPrice) => {
    const exchangeRate = 0.85;
    const price = parseFloat(usdPrice) || 0;
    return formatNumber(price * exchangeRate);
  };

  const convertPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    switch (currentCurrency) {
      case 'HTG':
        // Database prices are already in HTG, no conversion needed
        return formatNumber(numPrice);
      case 'EUR':
        // Convert from HTG to EUR (HTG to USD first, then USD to EUR)
        return convertToEUR(numPrice / 132);
      case 'USD':
        // Convert from HTG to USD
        return formatNumber(numPrice / 132);
      default:
        return formatNumber(numPrice);
    }
  };

  const toggleCurrency = () => {
    const currencyOrder = ['HTG', 'USD', 'EUR'];
    const currentIndex = currencyOrder.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyOrder.length;
    setCurrentCurrency(currencyOrder[nextIndex]);
  };

  const handleShowMore = () => {
    console.log('Navigate to full description');
  };

  const title = productData.name;
  const description = productData.description;

  // Check description length
  const descriptionLines = description ? description.split('\n').length : 0;
  const estimatedLines = description ? Math.ceil(description.length / 60) : 0;
  const totalLines = Math.max(descriptionLines, estimatedLines);
  const isExpandableDescription = description && totalLines >= 3 && totalLines <= 5;
  const isVeryLongDescription = description && totalLines > 5;
  const needsShowMore = isExpandableDescription || isVeryLongDescription;

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div className="bg-white w-full">
      {/* Add CSS for flag icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />
      
      {/* Product Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-gray-800 font-bold leading-tight text-lg truncate flex-1">
          {title}
        </h3>
        {/* Quantity Sold */}
        <div className="flex-shrink-0">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="text-gray-400">|</span>
            <span className="ml-2 font-medium">500 Sold</span>
          </div>
        </div>
      </div>

      {/* Product Description */}
      {description && (
        <div className="text-xs text-gray-700 leading-tight mt-2">
          <p className={`m-0 ${(!isDescriptionExpanded && needsShowMore) ? 'line-clamp-2' : ''}`}>
            {description}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex-1">
              {needsShowMore ? (
                <>
                  {isExpandableDescription && (
                    <button
                      onClick={toggleDescription}
                      className="text-gray-600 hover:text-gray-800 font-semibold text-xs inline-flex items-center gap-1 transition-colors duration-200"
                    >
                      {isDescriptionExpanded ? 'Show less' : 'Show more'} 
                      {isDescriptionExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                  {isVeryLongDescription && (
                    <button
                      onClick={handleShowMore}
                      className="text-gray-600 hover:text-gray-800 font-semibold text-xs inline-flex items-center gap-1 transition-colors duration-200"
                    >
                      See more <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <button
                      onClick={toggleCurrency}
                      className="flex items-center hover:opacity-80 transition-opacity"
                    >
                      <span className="text-gray-600 text-sm font-bold flex items-center">
                        <span className={`fi fi-${currencyToCountry[currentCurrency]} mr-1`} style={{ fontSize: '1rem' }}></span>
                        {currencies[currentCurrency]}
                      </span>
                      <span className="ml-1 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                        <ChevronDown className="w-4 h-4 font-black stroke-2" />
                      </span>
                      <span className="text-orange-500 text-sm font-black ml-2 h-6 flex items-center">
                        {convertPrice(productData?.discount_price || productData?.price || 104.99)}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm line-through">
                      {convertPrice(productData?.price || 149.99)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {needsShowMore && (
              <div className="flex items-center space-x-2 ml-2">
                <div className="flex items-center">
                  <button
                    onClick={toggleCurrency}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    <span className="text-gray-600 text-sm font-bold flex items-center">
                      <span className={`fi fi-${currencyToCountry[currentCurrency]} mr-1`} style={{ fontSize: '1rem' }}></span>
                      {currencies[currentCurrency]}
                    </span>
                    <span className="ml-1 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                      <ChevronDown className="w-4 h-4 font-black stroke-2" />
                    </span>
                    <span className="text-orange-500 text-sm font-black ml-2 h-6 flex items-center">
                      {convertPrice(productData?.discount_price || productData?.price || 104.99)}
                    </span>
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm line-through">
                    {convertPrice(productData?.price || 149.99)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!description && (
        <div className="flex items-center gap-2 mt-2">
          {/* Currency and Main Price */}
          <button 
            onClick={toggleCurrency}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <span className="flex items-center text-gray-600 text-lg font-bold">
              <span className={`fi fi-${currencyToCountry[currentCurrency]} mr-1`} style={{ fontSize: '1.25rem' }}></span>
              {currencies[currentCurrency]}
            </span>
            <span className="ml-1 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
              <ChevronDown className="w-3.5 h-3.5 font-black stroke-2 text-gray-600" />
            </span>
            <span className="text-orange-500 text-xl font-black ml-2">
              {convertPrice(productData?.discount_price || productData?.price || 104.99)}
            </span>
          </button>

          {/* Original Price */}
          <div className="flex items-center">
            <span className="text-gray-400 text-sm line-through">
              {currencies[currentCurrency]}{convertPrice(productData?.price || 149.99)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;