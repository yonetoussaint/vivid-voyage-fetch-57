import React, { useState } from 'react';
import { ChevronLeft, HelpCircle, Type, Sun, Moon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { useProduct } from '@/hooks/useProduct';

const ProductDescriptionPage = () => {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [showControls, setShowControls] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Use the product data from the hook
  const { data: product, isLoading } = useProduct(id || '');

  // Format the description content for display
  const formatDescriptionContent = () => {
    if (!product?.description) return [];

    return [
      {
        type: "text",
        content: product.description
      },
      ...(product.product_images?.map(img => ({
        type: "image",
        src: img.src,
        alt: img.alt || "Product image",
        caption: img.alt || ""
      })) || [])
    ];
  };

  const descriptionContent = formatDescriptionContent();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHelp = () => {
    setShowControls(!showControls);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getThemeClasses = () => {
    return theme === 'dark' 
      ? 'bg-gray-900 text-gray-100' 
      : 'bg-white text-gray-900';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500">The product description is not available.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Header matching ProductHeader height and style */}
<div className="fixed top-0 left-0 right-0 z-30 bg-white">
  <div className="py-2 px-3 w-full">
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
      {/* Left side - Back button */}
      <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>

      {/* Center - Title */}
      <h1 className="text-sm font-medium text-gray-800 mx-4">
        Product Description
      </h1>

      {/* Right side - Help button */}
      <button onClick={handleHelp} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
        <HelpCircle className="w-5 h-5 text-gray-800" />
      </button>
    </div>
  </div>
</div>

      {/* Controls Panel */}
      {showControls && (
        <div className={`fixed top-12 right-4 z-40 p-3 rounded-lg shadow-lg bg-white border border-gray-200`}>
          <div className="flex items-center space-x-4">
            <button 
              onClick={decreaseFontSize}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Decrease font size"
            >
              <Type className="w-5 h-5 text-gray-800" />
            </button>
            <button 
              onClick={increaseFontSize}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Increase font size"
            >
              <Type className="w-6 h-6 text-gray-800" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-800" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Content with padding to account for fixed header */}
      <div className="pt-14">
        <PageContainer padding="md" maxWidth="4xl" className="py-6 space-y-6">
          {descriptionContent.map((item, index) => {
            if (item.type === 'text') {
              return (
                <div 
                  key={index}
                  className="leading-relaxed whitespace-pre-line transition-all duration-300"
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}
                >
                  {item.content}
                </div>
              );
            } else if (item.type === 'image') {
              return (
                <div key={index} className="space-y-4">
                  <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  {item.caption && (
                    <p className={`text-center text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.caption}
                    </p>
                  )}
                </div>
              );
            }
            return null;
          })}

          {/* Reading info */}
          {descriptionContent.length > 0 && (
            <div className={`mt-8 pt-4 border-t border-opacity-20 border-gray-500 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-center">
                Reading time: ~{Math.ceil(
                  descriptionContent
                    .filter(item => item.type === 'text')
                    .map(item => item.content)
                    .join(' ')
                    .split(/\s+/).length / 200
                )} minutes
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
};

export default ProductDescriptionPage;