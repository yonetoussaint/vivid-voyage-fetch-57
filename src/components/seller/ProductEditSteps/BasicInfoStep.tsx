import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DescriptionEditor from './DescriptionEditor';

interface BasicInfoStepProps {
  formData: {
    name: string;
    description: string;
    price: string;
    discount_price: string;
    inventory: string;
    status: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, onInputChange }) => {
  const [showDescriptionEditor, setShowDescriptionEditor] = useState(false);

  const handleExpandDescription = () => {
    setShowDescriptionEditor(true);
  };

  const handleSaveDescription = (description: string) => {
    onInputChange('description', description);
    setShowDescriptionEditor(false);
  };

  const handleCancelDescription = () => {
    setShowDescriptionEditor(false);
  };

  if (showDescriptionEditor) {
    return (
      <DescriptionEditor
        initialDescription={formData.description}
        onSave={handleSaveDescription}
        onCancel={handleCancelDescription}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Basic Product Information</h3>
        <p className="text-sm text-gray-600">
          Enter the essential details about your product
        </p>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Product Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <div className="relative">
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Enter product description"
            rows={4}
            required
          />
          <button
            onClick={handleExpandDescription}
            className="absolute top-2 right-2 text-gray-400 hover:text-blue-500 transition-colors p-1"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 7h10v10"/>
              <path d="M7 17L17 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Price and Discount */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (HTG) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => onInputChange('price', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount_price">Discount Price (HTG)</Label>
          <Input
            id="discount_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.discount_price}
            onChange={(e) => onInputChange('discount_price', e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Inventory and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inventory">Inventory *</Label>
          <Input
            id="inventory"
            type="number"
            min="0"
            value={formData.inventory}
            onChange={(e) => onInputChange('inventory', e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => onInputChange('status', e.target.value)}
            className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>


    </div>
  );
};