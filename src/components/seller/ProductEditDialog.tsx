import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { Product, updateProduct } from '@/integrations/supabase/products';
import { toast } from 'sonner';
import { BasicInfoStep, MediaStep, DetailsStep } from './ProductEditSteps';

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export const ProductEditDialog: React.FC<ProductEditDialogProps> = ({
  open,
  onOpenChange,
  product,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    inventory: '',
    tags: [] as string[],
    status: 'active',
    bundle_deals: [] as any[]
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const totalSteps = 3;

  useEffect(() => {
    if (product && open) {
      setCurrentStep(0);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount_price: product.discount_price?.toString() || '',
        inventory: product.inventory?.toString() || '',
        tags: product.tags || [],
        status: product.status || 'active',
        bundle_deals: product.bundle_deals || []
      });
    }
  }, [product, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Info
        return !!(formData.name && formData.description && formData.price && formData.inventory);
      case 1: // Media
        return true; // Media is optional
      case 2: // Details
        return true; // Details are optional
      default:
        return true;
    }
  };


  const handleSubmit = async () => {
    if (!product) return;

    setIsUpdating(true);

    try {
      const updateData: Partial<Product> = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        inventory: parseInt(formData.inventory),
        tags: formData.tags,
        status: formData.status,
        bundle_deals: formData.bundle_deals
      };

      await updateProduct(product.id, updateData);

      toast.success('Product updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderCurrentStep = () => {
    if (!product) return null;

    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={{
              name: formData.name,
              description: formData.description,
              price: formData.price,
              discount_price: formData.discount_price,
              inventory: formData.inventory,
              status: formData.status
            }}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <MediaStep
            product={product}
            uploadingImages={uploadingImages}
            uploadingVideos={uploadingVideos}
            setUploadingImages={setUploadingImages}
            setUploadingVideos={setUploadingVideos}
            onSuccess={onSuccess}
          />
        );
      case 2:
        return (
          <DetailsStep
            formData={{
              tags: formData.tags,
              bundle_deals: formData.bundle_deals
            }}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Step Content */}
          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUpdating || !validateCurrentStep()}
              className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};