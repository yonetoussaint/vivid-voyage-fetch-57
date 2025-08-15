// Updated ProductDetail component - Sticky button extracted to separate component
import React, { useState, useEffect, useRef } from "react";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProduct, useProductAnalytics } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductHeader from "@/components/product/ProductHeader";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductSectionWrapper from "@/components/product/ProductSectionWrapper";
import ToggleExpandButton from "@/components/product/ToggleExpandButton";

import { useVariantStockDecay } from "@/hooks/useVariantStockDecay";
import CoreIdentity from "@/components/product/CoreIdentity";
import PricingSection from '@/components/product/PricingSection';
import ProductColorVariants from "@/components/product/ProductColorVariants";
import BundleDeals from "@/components/product/BundleDeals";
import ShippingOptionsComponent from '@/components/product/ShippingOptionsComponent';
import ProductDescriptionSection from '@/components/product/ProductDescriptionSection';
import ProductReviews from '@/components/product/ProductReviews';
import ProductQA from '@/components/product/ProductQA';

import ProductRecommendationsFlash from '@/components/product/ProductRecommendationsFlash';
import ProductExtras from '@/components/product/ProductExtras';

import SellerInfo from '@/components/product/SellerInfo';
import PaymentOptions from '@/components/product/PaymentOptions';
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";
const MAX_QUANTITY = 250;

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showVariants, setShowVariants] = useState(true);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [isExpressSelected, setIsExpressSelected] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState("none");
  const [maxQuantityReached, setMaxQuantityReached] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showLiveData, setShowLiveData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(44);
  const [activeSection, setActiveSection] = useState("overview");

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: paramId } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const qaRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const productId = paramId || DEFAULT_PRODUCT_ID;

  const { data: product, isLoading } = useProduct(productId);
  const { data: analytics, isLoading: analyticsLoading } = useProductAnalytics(productId);

  const colorPrices = {
    "Black": 79.99,
    "White": 89.99,
    "Jet Black": 89.99,
    "Blue": 219.99,
    "Red": 229.99
  };

  const colorVariants = [
    { name: "Black", price: colorPrices.Black, stock: 48, image: "", bestseller: true },
    { name: "White", price: colorPrices.White, stock: 124, image: "", bestseller: false },
    { name: "Jet Black", price: colorPrices["Jet Black"], stock: 78, image: "", bestseller: false },
    { name: "Blue", price: colorPrices.Blue, stock: 42, image: "", bestseller: false },
    { name: "Red", price: colorPrices.Red, stock: 16, image: "", bestseller: false, limited: true }
  ];

  const { variantStockInfo, activateVariant, getTimeRemaining, resetVariant, resetAllVariants } = useVariantStockDecay({
    variants: colorVariants,
    decayPeriod: 12 * 60 * 60 * 1000
  });

  // Check if current product has variants based on type field
  const isVariableProduct = product?.type === 'variable';

  useEffect(() => {
    if (selectedColor && activateVariant && isVariableProduct) {
      activateVariant(selectedColor);
    }
  }, [selectedColor, activateVariant, isVariableProduct]);

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

  const handleShare = async () => {
    await triggerHaptic();
    if (navigator.share) {
      navigator.share({
        title: product?.name || "Product",
        text: `Check out this ${product?.name || "product"}!`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  const toggleFavorite = async () => {
    await triggerHaptic();
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Item removed from your wishlist" : "Item added to your wishlist",
    });
  };

  const toggleSaved = async () => {
    await triggerHaptic();
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved items" : "Added to saved items",
      description: isSaved ? "Item removed from your saved list" : "Item saved for later",
    });
  };

  const addToCart = async () => {
    await triggerHaptic();
    const productDetails = isVariableProduct 
      ? `${quantity} x ${product?.name || "Product"} (${selectedColor})`
      : `${quantity} x ${product?.name || "Product"}`;

    toast({
      title: "Added to cart",
      description: `${productDetails} added to your cart`,
    });
  };

  const buyNow = async () => {
    await triggerHaptic();

    // Navigate to checkout with product details
    const checkoutParams = new URLSearchParams({
      productName: product?.name || "Product",
      quantity: quantity.toString(),
      price: currentPrice.toString(),
    });

    // Only add color if it's a variable product
    if (isVariableProduct) {
      checkoutParams.set('color', selectedColor);
    }

    navigate(`/product-checkout?${checkoutParams.toString()}`);
  };

  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: "Opening your shopping cart",
    });
  };

  const handleResetStock = () => {
    resetAllVariants();
    toast({
      title: "Stock Reset",
      description: "All product variants stock has been reset to initial values",
    });
  };

  const scrollToSection = (section: string) => {
    const refs = {
      overview: overviewRef,
      description: descriptionRef,
      reviews: reviewsRef,
      qa: qaRef,
      shipping: shippingRef
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      const yOffset = -120; // Account for sticky header with tabs
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(section);
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160; // Account for header + tabs height

      // Check sections from bottom to top for accurate detection
      if (qaRef.current && scrollPosition >= qaRef.current.offsetTop) {
        setActiveSection("qa");
      } else if (reviewsRef.current && scrollPosition >= reviewsRef.current.offsetTop) {
        setActiveSection("reviews");
      } else if (shippingRef.current && scrollPosition >= shippingRef.current.offsetTop) {
        setActiveSection("shipping");
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
  const originalPrice = product?.price || 0;

  // Convert USD to HTG (using the same conversion as in CoreIdentity)
  const convertToHTG = (usdPrice) => {
    const exchangeRate = 132; // 1 USD = 132 HTG
    const price = parseFloat(usdPrice) || 0;
    return price * exchangeRate;
  };

  // Get the HTG price for bundle deals
  const baseHTGPrice = convertToHTG(currentPrice);

  const selectedVariant = colorVariants.find((v) => v.name === selectedColor);
  const selectedVariantStockInfo = selectedColor ? variantStockInfo[selectedColor] : undefined;

  const currentVariant = colorVariants.find(v => v.name === selectedColor);
  const currentStock = selectedVariantStockInfo?.currentStock !== undefined 
    ? Math.floor(selectedVariantStockInfo.currentStock)
    : (currentVariant ? currentVariant.stock : 0);

  return (
    <div className="flex flex-col min-h-screen bg-white overscroll-none" ref={contentRef}>
      <ProductHeader 
        activeSection={activeSection}
        onTabChange={scrollToSection}
      />

      <div className="relative w-full bg-transparent" ref={overviewRef}>
        <ProductImageGallery 
          images={productImages.length > 0 ? productImages : ["/placeholder.svg"]}
          videos={product?.product_videos || []}
        />
      </div>

      <div className="flex-1 overscroll-none pb-[112px]"> {/* Add bottom padding */}
        <div className="bg-white pb-20">
          {/* CoreIdentity with reduced bottom margin */}
          <ProductSectionWrapper className="!mb-0 !pb-1">
            <CoreIdentity product={product} />
          </ProductSectionWrapper>

          {/* SellerInfo with no top/bottom padding and margin */}
          <ProductSectionWrapper className="!py-0 !my-0 !mb-0">
            <SellerInfo 
              seller={product?.sellers} 
              productId={productId}
              stock={product?.inventory || 0}
            />
          </ProductSectionWrapper>

          {/* ProductColorVariants - Only show if product has variants */}
          {isVariableProduct && (
            <ProductSectionWrapper className="!pt-2 !mt-0">
              <ProductColorVariants />
            </ProductSectionWrapper>
          )}

          <ProductSectionWrapper className={isVariableProduct ? "" : "!pt-2 !mt-0"}>
            {/* UPDATED: Pass the actual product price in HTG to BundleDeals */}
            <BundleDeals 
              bundleDeals={product?.bundle_deals || []}
              productPrice={baseHTGPrice}
              onQuantitySelect={setQuantity}
            />
          </ProductSectionWrapper>

          {/* Product Description Section */}
          <Separator className="my-4" />
          <div ref={descriptionRef}>
            <ProductSectionWrapper>
              <ProductDescriptionSection />
            </ProductSectionWrapper>
          </div>

          {/* Shipping Options */}
          <div ref={shippingRef}>
            <Separator className="my-4" />
            <ProductSectionWrapper>
              <ShippingOptionsComponent />
            </ProductSectionWrapper>
          </div>

          {/* Payment Options */}
          <Separator className="my-4" />
          <ProductSectionWrapper>
            <PaymentOptions />
          </ProductSectionWrapper>

          {/* Product Extras */}
          <Separator className="my-4" />
          <ProductSectionWrapper>
            <ProductExtras />
          </ProductSectionWrapper>

          {/* Product Reviews */}
          <div ref={reviewsRef}>
            <Separator className="my-4" />
            <ProductSectionWrapper>
              <ProductReviews />
            </ProductSectionWrapper>
          </div>

          {/* Questions & Answers */}
          <div ref={qaRef}>
            <Separator className="my-4" />
            <ProductSectionWrapper>
              <ProductQA />
            </ProductSectionWrapper>
          </div>

          {/* Flash Deals & Recommendations */}
          <Separator className="my-4" />
          <ProductSectionWrapper>
            <ProductRecommendationsFlash />
          </ProductSectionWrapper>

        </div>
      </div>

      {/* Sticky Checkout Bar Component */}
      <StickyCheckoutBar 
        productId={productId}
        onCheckout={buyNow}
        onLike={toggleFavorite}
        onShare={handleShare}
        onSave={toggleSaved}
        isLiked={isFavorite}
        isSaved={isSaved}
      />
    </div>
  );
};

export default ProductDetail;