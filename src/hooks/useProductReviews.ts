import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      console.log('Fetching reviews for product:', productId);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
      }
      console.log('Fetched reviews:', data);
      return data || [];
    },
    enabled: !!productId,
  });
};

export const useProductReviewsStats = (productId: string) => {
  return useQuery({
    queryKey: ['product-reviews-stats', productId],
    queryFn: async () => {
      console.log('Fetching review stats for product:', productId);
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product review stats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No reviews found for product:', productId);
        return { count: 0, averageRating: 0 };
      }

      const count = data.length;
      const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / count;
      
      console.log('Review stats:', { count, averageRating });
      return { count, averageRating: Math.round(averageRating * 10) / 10 };
    },
    enabled: !!productId,
  });
};