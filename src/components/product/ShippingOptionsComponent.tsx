import React, { useState } from 'react';
import { Clock, ChevronDown, Zap, Truck, Package, Plane, MapPin } from 'lucide-react';

const DeliveryOptions = () => {
  const [selectedOption, setSelectedOption] = useState('meetup');
  const [showAll, setShowAll] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('port-au-prince');

  const userAddresses = [
    { 
      id: 'port-au-prince', 
      label: 'Port-au-Prince', 
      address: 'OU - Port-au-Prince, Pétion-Ville, Bourdon',
      department: 'OU',
      commune: 'Port-au-Prince',
      quartier: 'Bourdon'
    },
    { 
      id: 'cap-haitien', 
      label: 'Cap-Haïtien', 
      address: 'NO - Cap-Haïtien, Cap-Haïtien, Centre-Ville',
      department: 'NO',
      commune: 'Cap-Haïtien',
      quartier: 'Centre-Ville'
    },
    { 
      id: 'gonaives', 
      label: 'Gonaïves', 
      address: 'AR - Gonaïves, Gonaïves, Centre',
      department: 'AR',
      commune: 'Gonaïves',
      quartier: 'Centre'
    },
    { 
      id: 'cayes', 
      label: 'Les Cayes', 
      address: 'SU - Les Cayes, Les Cayes, Ducis',
      department: 'SU',
      commune: 'Les Cayes',
      quartier: 'Ducis'
    },
    { 
      id: 'jacmel', 
      label: 'Jacmel', 
      address: 'SE - Jacmel, Jacmel, La Gosseline',
      department: 'SE',
      commune: 'Jacmel',
      quartier: 'La Gosseline'
    }
  ];

  // Delivery options change based on selected department and location
  const getDeliveryOptionsForAddress = (addressId) => {
    const selectedAddr = userAddresses.find(addr => addr.id === addressId);
    const baseOptions = [
      {
        id: 'meetup',
        icon: <Truck className="w-6 h-6 text-gray-600" />,
        title: 'Meetup',
        subtitle: 'Meet in person',
        description: 'Arrange to meet at a convenient location',
        popular: true
      }
    ];

    // Port-au-Prince (Ouest) - Most delivery options available
    if (selectedAddr?.department === 'OU') {
      return [
        ...baseOptions,
        {
          id: 'local',
          icon: <Package className="w-6 h-6 text-blue-600" />,
          title: 'Local',
          subtitle: 'Local delivery',
          description: 'Delivered within Port-au-Prince metro area',
          popular: false
        },
        {
          id: 'moto',
          icon: <Plane className="w-6 h-6 text-purple-600" />,
          title: 'Moto',
          subtitle: 'Motorcycle delivery',
          description: 'Fast motorcycle delivery service',
          popular: false
        },
        {
          id: 'pickup-station',
          icon: <Package className="w-6 h-6 text-green-600" />,
          title: 'Pick up station',
          subtitle: 'Collect from station',
          description: 'Pick up from designated collection point',
          popular: false
        }
      ];
    } 
    // Cap-Haïtien (Nord) and Gonaïves (Artibonite) - Regional centers
    else if (selectedAddr?.department === 'NO' || selectedAddr?.department === 'AR') {
      return [
        ...baseOptions,
        {
          id: 'moto',
          icon: <Plane className="w-6 h-6 text-purple-600" />,
          title: 'Moto',
          subtitle: 'Motorcycle delivery',
          description: 'Fast motorcycle delivery service',
          popular: false
        },
        {
          id: 'transit',
          icon: <Zap className="w-6 h-6 text-orange-600" />,
          title: 'Transit',
          subtitle: 'Inter departmentale',
          description: 'For delivery between departments',
          popular: false
        },
        {
          id: 'pickup-station',
          icon: <Package className="w-6 h-6 text-green-600" />,
          title: 'Pick up station',
          subtitle: 'Collect from station',
          description: 'Pick up from designated collection point',
          popular: false
        }
      ];
    }
    // Other departments (Sud, Sud-Est) - Limited options
    else {
      return [
        ...baseOptions,
        {
          id: 'transit',
          icon: <Zap className="w-6 h-6 text-orange-600" />,
          title: 'Transit',
          subtitle: 'Inter departmentale',
          description: 'For delivery between departments and communes',
          popular: false
        },
        {
          id: 'pickup-station',
          icon: <Package className="w-6 h-6 text-green-600" />,
          title: 'Pick up station',
          subtitle: 'Collect from station',
          description: 'Pick up from designated collection point',
          popular: false
        }
      ];
    }
  };

  const deliveryOptions = getDeliveryOptionsForAddress(selectedAddress);

  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
    // Reset to first available option when address changes
    const newOptions = getDeliveryOptionsForAddress(addressId);
    setSelectedOption(newOptions[0]?.id || 'meetup');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Options de Livraison</h3>
      </div>

      {/* Address Selection Dropdown */}
      <div className="relative">
        <div className="relative">
          <select 
            value={selectedAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="w-full p-3 rounded-full bg-gray-100 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-200"
          >
            {userAddresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.department}, {address.commune}, {address.quartier}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* All Delivery Options */}
      <div className="grid grid-cols-2 gap-3">
        {(showAll ? deliveryOptions : deliveryOptions.slice(0, 4)).map((option) => (
          <div 
            key={option.id}
            className={`rounded-lg p-3 cursor-pointer transition-all ${
              selectedOption === option.id 
                ? 'bg-blue-50' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedOption(option.id)}
          >
            <div className="flex flex-col space-y-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1 relative">
                  <span className="font-medium text-gray-900 text-sm">{option.title}</span>
                  {option.popular && (
                    <>
                      <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                        <Zap size={8} fill="white" className="text-white" />
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-600">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More/Less Button */}
      <button 
        onClick={() => setShowAll(!showAll)}
        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-full w-full text-gray-600 font-medium"
      >
        <span>{showAll ? 'Show less options' : 'View more options'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default DeliveryOptions;