import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Leaf, Shield, Award, Truck } from 'lucide-react';

const ProductSpecifications = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const specifications = {
    basic: {
      title: 'Basic Information',
      icon: <Award className="w-4 h-4" />,
      items: [
        { label: 'Product Type', value: 'Beard Growth Oil' },
        { label: 'Volume', value: '30ml (1 fl oz)' },
        { label: 'Scent', value: 'Natural blend with mint and rosemary' },
        { label: 'Texture', value: 'Light, non-greasy oil' },
        { label: 'Color', value: 'Golden amber' },
        { label: 'Origin', value: 'Made in Haiti' },
        { label: 'Shelf Life', value: '24 months from manufacture date' }
      ]
    },
    ingredients: {
      title: 'Ingredients & Composition',
      icon: <Leaf className="w-4 h-4" />,
      items: [
        { label: 'Jojoba Oil', value: 'Simmondsia chinensis - 40%' },
        { label: 'Castor Oil', value: 'Ricinus communis - 25%' },
        { label: 'Grape Seed Oil', value: 'Vitis vinifera - 20%' },
        { label: 'Mint Essential Oil', value: 'Mentha piperita - 8%' },
        { label: 'Rosemary Essential Oil', value: 'Rosmarinus officinalis - 5%' },
        { label: 'Vitamin E', value: 'Tocopherol - 2%' },
        { label: 'Natural Preservatives', value: 'Plant-based antioxidants' }
      ]
    },
    usage: {
      title: 'Usage & Application',
      icon: <Shield className="w-4 h-4" />,
      items: [
        { label: 'Frequency', value: 'Daily use recommended' },
        { label: 'Application', value: '3-4 drops for average beard' },
        { label: 'Best Time', value: 'After shower on clean, damp beard' },
        { label: 'Massage Duration', value: '2-3 minutes for optimal absorption' },
        { label: 'Suitable For', value: 'All beard types and lengths' },
        { label: 'Age Range', value: '16+ years' },
        { label: 'Patch Test', value: 'Recommended for sensitive skin' }
      ]
    },
    shipping: {
      title: 'Shipping & Storage',
      icon: <Truck className="w-4 h-4" />,
      items: [
        { label: 'Storage Temperature', value: 'Room temperature (15-25°C)' },
        { label: 'Storage Location', value: 'Cool, dry place away from sunlight' },
        { label: 'Packaging', value: 'Dark glass bottle with dropper' },
        { label: 'Weight', value: '65g including packaging' },
        { label: 'Dimensions', value: '3cm × 3cm × 10cm' },
        { label: 'Shipping Weight', value: '100g with protective packaging' },
        { label: 'Temperature Sensitivity', value: 'Avoid extreme heat/cold during transit' }
      ]
    }
  };

  return (
    <div className="bg-white py-4 space-y-4">
      <h3 className="text-lg font-semibold">Product Specifications</h3>

      <div className="space-y-3">
        {Object.entries(specifications).map(([key, section]) => (
          <div key={key} className="bg-gray-100 rounded-lg">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-3 text-left bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2">
                {section.icon}
                <span className="font-medium">{section.title}</span>
              </div>
              {expandedSections.includes(key) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.includes(key) && (
              <div className="bg-gray-100">
                <div className="p-3 space-y-2 bg-gray-100">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-800 font-medium">{item.label}:</span>
                      <span className="text-gray-600 text-right flex-1 ml-4">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Certifications & Badges */}
      <div className="pt-4">
        <h4 className="font-medium mb-3">Certifications & Quality</h4>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            <Leaf className="w-3 h-3" />
            100% Natural
          </div>
          <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            <Shield className="w-3 h-3" />
            Dermatologist Tested
          </div>
          <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
            <Award className="w-3 h-3" />
            Cruelty Free
          </div>
          <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
            <Leaf className="w-3 h-3" />
            Vegan Friendly
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;