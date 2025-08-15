
import React, { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ProductSectionCollapsibleProps {
  title: string;
  children: React.ReactNode;
  previewContent: React.ReactNode;
  defaultExpanded?: boolean;
}

const ProductSectionCollapsible = ({
  title,
  children,
  previewContent,
  defaultExpanded = false,
}: ProductSectionCollapsibleProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="py-4">
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="w-full"
      >
        <h2 className="font-medium text-base mb-3">{title}</h2>
        
        <div className="relative">
          {/* Preview content with gradient overlay - only visible when collapsed */}
          {!isExpanded && (
            <div className="relative">
              <div className="mb-2 text-gray-600 max-h-[120px] overflow-hidden">
                {previewContent}
                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>
          )}
          
          <CollapsibleContent className="text-gray-700">
            {children}
          </CollapsibleContent>
          
          {/* Centered trigger button with shadow background */}
          <div className="flex justify-center mt-4">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost"
                className="relative px-6 py-2 text-gray-600 hover:bg-gray-50 shadow-sm bg-white/80 backdrop-blur-sm"
              >
                {isExpanded ? (
                  <>
                    Show Less <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    See More <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default ProductSectionCollapsible;
