import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StickyCheckoutBar = ({ 
  productId, 
  onCheckout, 
  onLike, 
  onComment, 
  onShare, 
  onSave,
  isLiked = false,
  isSaved = false,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleCommentClick = () => {
    if (onComment) {
      onComment();
    } else {
      navigate(`/product/${productId}/comments`);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 ${className}`}>
      {/* Action Buttons */}
      <div className="px-4 py-3 flex gap-3 items-stretch">
        <button className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-full font-medium text-base hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Message
        </button>
        <button 
          onClick={onCheckout}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-full font-medium text-base hover:opacity-90 flex items-center justify-center"
        >
          Achter
        </button>
      </div>
    </div>
  );
};

export default StickyCheckoutBar;