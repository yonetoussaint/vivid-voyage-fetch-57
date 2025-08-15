import React, { useState, useEffect, useRef } from "react";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProduct, useProductAnalytics } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import ProductHeader from "@/components/product/ProductHeader";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductSectionWrapper from "@/components/product/ProductSectionWrapper";
import CoreIdentity from "@/components/product/CoreIdentity";
import PricingSection from '@/components/product/PricingSection';
import ProductQuantitySelector from "@/components/product/ProductQuantitySelector";
import ShippingOptionsComponent from '@/components/product/ShippingOptionsComponent';
import ProductDescriptionSection from '@/components/product/ProductDescriptionSection';

import SellerInfo from '@/components/product/SellerInfo';
import PaymentOptions from '@/components/product/PaymentOptions';

const DEFAULT_PRODUCT_ID = "22222222-2222-2222-2222-222222222222"; // Single product
const MAX_QUANTITY = 250;

const SingleProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [maxQuantityReached, setMaxQuantityReached] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: paramId } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const productId = paramId || DEFAULT_PRODUCT_ID;

  const { data: product, isLoading } = useProduct(productId);
  const { data: analytics, isLoading: analyticsLoading } = useProductAnalytics(productId);

  const triggerHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const incrementQuantity = async () => {
    if (quantity < MAX_QUANTITY) {
      await triggerHaptic();
      setQuantity(prev => prev + 1);
      if (quantity === MAX_QUANTITY - 1) {
        setMaxQuantityReached(true);
        toast({
          title: "Maximum quantity reached",
          description: "You've reached the maximum allowed quantity for this item.",
          variant: "destructive"
        });
      }
    }
  };

  const decrementQuantity = async () => {
    if (quantity > 1) {
      await triggerHaptic();
      setQuantity(prev => prev - 1);
      if (maxQuantityReached) {
        setMaxQuantityReached(false);
      }
    }
  };

  const buyNow = async () => {
    await triggerHaptic();
    
    const checkoutParams = new URLSearchParams({
      productName: product?.name || "Product",
      quantity: quantity.toString(),
      price: (product?.discount_price || product?.price || 0).toString(),
    });
    
    navigate(`/product-checkout?${checkoutParams.toString()}`);
  };

  const scrollToSection = (section: string) => {
    const refs = {
      overview: overviewRef,
      description: descriptionRef,
      reviews: reviewsRef
    };
    
    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      const yOffset = -80;
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(section);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      
      if (reviewsRef.current && scrollPosition >= reviewsRef.current.offsetTop) {
        setActiveSection("reviews");
      } else if (descriptionRef.current && scrollPosition >= descriptionRef.current.offsetTop) {
        setActiveSection("description");
      } else {
        setActiveSection("overview");
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <p className="text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const productImages = product?.product_images?.map(img => img.src) || [];
  const currentPrice = product?.discount_price || product?.price || 0;
  
  return (
    <div className="flex flex-col min-h-screen bg-white overscroll-none" ref={contentRef}>
      <ProductHeader 
        activeSection={activeSection}
        onTabChange={scrollToSection}
      />
      
      <div className="relative w-full bg-transparent" ref={overviewRef}>
        <ProductImageGallery images={productImages.length > 0 ? productImages : ["/placeholder.svg"]} />
      </div>

      <div className="flex-1 overscroll-none">
        <div className="bg-white pb-20">
          <ProductSectionWrapper>
            <CoreIdentity />
          </ProductSectionWrapper>
          
          <ProductSectionWrapper>
            <ProductQuantitySelector 
              quantity={quantity}
              onQuantityChange={(newQuantity) => setQuantity(newQuantity)}
              price={currentPrice}
              maxQuantity={MAX_QUANTITY}
              minQuantity={1}
              inStock={product?.inventory || 0}
              productName={product?.name}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
            />
          </ProductSectionWrapper>
          
          <ProductSectionWrapper>
            <ShippingOptionsComponent />
          </ProductSectionWrapper>

          <PaymentOptions />

          <ProductSectionWrapper>
            <SellerInfo seller={product?.sellers} productId={productId} />
          </ProductSectionWrapper>
          
          <ProductSectionWrapper ref={descriptionRef}>
            <ProductDescriptionSection />
          </ProductSectionWrapper>
          
          {/* Reviews section removed - now handled by comments page */}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="px-4 py-3">
          <Button 
            onClick={buyNow}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-full font-medium text-base hover:opacity-90"
          >
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductDetail;