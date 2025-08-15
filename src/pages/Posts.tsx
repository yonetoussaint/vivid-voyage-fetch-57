
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import PostsSkeleton from "@/components/skeletons/PostsSkeleton";

export default function Posts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isMobile !== undefined) {
      setIsReady(true);
    }
  }, [isMobile]);

  if (!isReady) {
    return <PostsSkeleton />;
  }

  if (isLoading) {
    return <PostsSkeleton />;
  }

  // Vendor data for multiple carousels with descriptions
  const vendors = [
    {
      id: 1,
      title: "Fashion Boutique",
      description: "Just dropped our summer collection! 🌞 Perfect for beach days and city nights. Limited quantities available, shop now before they're gone! #SummerVibes",
      products: products.slice(0, 10)
    },
    {
      id: 2,
      title: "Tech Gadgets Store",
      description: "New smart home devices have arrived! Control your entire house from your phone. Who's ready to upgrade their home? Tag someone who needs these 📱✨ #SmartHome #TechLovers",
      products: [...products].reverse().slice(0, 8)
    },
    {
      id: 3,
      title: "Home Decor Shop",
      description: "Transform your space with our minimalist decor pieces. These neutral tones will complement any interior style! 🏠✨ #HomeInspo #InteriorDesign",
      products: [...products].sort(() => 0.5 - Math.random()).slice(0, 9)
    },
    {
      id: 4,
      title: "Sports Equipment",
      description: "Gear up for summer sports! From tennis to swimming, we've got everything you need to stay active this season. 🎾🏊‍♂️ #FitnessGoals",
      products: products.slice(0, 7)
    },
    {
      id: 5,
      title: "Kitchen Essentials",
      description: "Cooking just got easier with our new kitchen gadgets! Perfect for beginners and professional chefs alike. What's your favorite recipe? 👨‍🍳🍳 #FoodieFriday",
      products: [...products].reverse().slice(0, 6)
    },
    {
      id: 6,
      title: "Beauty Products",
      description: "Self-care Sunday essentials! Our new skincare line is 100% vegan and cruelty-free. Your skin deserves the best! 💆‍♀️✨ #SkincareTips #CleanBeauty",
      products: [...products].sort(() => 0.5 - Math.random()).slice(0, 8)
    },
    {
      id: 7,
      title: "Outdoor Gear",
      description: "Planning a camping trip? Check out our durable outdoor equipment designed to withstand any adventure! 🏕️🌲 #WeekendGetaway #NatureLovers",
      products: products.slice(0, 5)
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overscroll-none overflow-x-hidden">
      {/* Content now starts at the top since header is in the layout */}
      <div className="pb-16">
        {/* Infinite list of VendorProductCarousel components */}
        <div className="space-y-4 mt-2 pb-8">
          {vendors.map(vendor => (
            <div key={vendor.id}>
              <VendorProductCarousel 
                title={vendor.title}
                description={vendor.description}
                products={vendor.products}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Extra bottom padding for mobile to account for fixed navigation */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
}