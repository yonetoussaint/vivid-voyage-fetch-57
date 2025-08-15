
import React, { useState } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from 'lucide-react';
import SimpleAuthPage from '@/pages/SimpleAuthPage';

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ isOpen, onClose }) => {
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragStartY(e.clientY);
    setIsDragging(true);
  };

  // Handle drag movement
  const handleDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY === null || !isDragging) return;
    
    const deltaY = e.clientY - dragStartY;
    if (deltaY > 0) { // Only allow dragging down
      setTranslateY(deltaY);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (translateY > 150) {
      // Close the overlay if dragged down more than 150px
      onClose();
    }
    
    // Reset states
    setDragStartY(null);
    setTranslateY(0);
    setIsDragging(false);
  };
  
  // Handle pointer up globally (in case user releases outside the handle)
  React.useEffect(() => {
    const handlePointerUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <SheetContent 
        className="w-full sm:max-w-md p-0 border-0 overflow-hidden" 
        style={{ 
          transform: isDragging ? `translateY(${translateY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        {/* Prominent close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-gray-200/60 hover:bg-gray-300/80 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Enhanced drag handle */}
        <div className="absolute left-0 right-0 top-0 flex justify-center z-40 pt-2">
          <div 
            className="w-16 h-1.5 bg-gray-300 rounded-full mb-3 cursor-grab active:cursor-grabbing shadow-sm hover:bg-gray-400 transition-colors"
            onPointerDown={handleDragStart}
            onPointerMove={handleDrag}
            onPointerUp={handleDragEnd}
          />
        </div>
        
        <ScrollArea className="h-full max-h-screen pt-8">
          <SimpleAuthPage isOverlay={true} onClose={onClose} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AuthOverlay;
