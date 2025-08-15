import React, { useState, useMemo } from 'react';
import { Star, Filter, Camera, Play, Heart, MessageCircle, ChevronDown } from 'lucide-react';

// Button component
const Button = ({ variant = "default", size = "default", className = "", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Sample reviews data - keeping only one review for compact AliExpress style
const sampleReviews = [
  {
    id: 1,
    userName: "Sarah Johnson",
    rating: 5,
    comment: "I've been using this for 3 months now and it's been fantastic. The quality is top-notch and it works exactly as described. Highly recommend to anyone looking for a reliable solution. The shipping was fast and the packaging was excellent. Customer service was also very responsive when I had questions about the product specifications.",
    date: "2024-03-15",
    verified: true,
    likes: 42,
    comments: 8,
    helpful: 42,
    images: ["https://picsum.photos/100/100?random=1", "https://picsum.photos/100/100?random=2"]
  },
  {
    id: 2,
    userName: "Mike Chen",
    rating: 4,
    comment: "Good value for money. The product works well, though I wish the setup was a bit easier. Customer service was helpful when I had questions. Overall satisfied with the purchase and would recommend it to others.",
    date: "2024-03-10",
    verified: false,
    likes: 18,
    comments: 3,
    helpful: 18,
    video: true
  }
];

const CustomerReviews = () => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = sampleReviews;
    
    // Filter by rating
    if (filterRating > 0) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [sortBy, filterRating]);
  
  const toggleReadMore = (reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };
  
  const reviews = filteredAndSortedReviews;
  
  // Calculate rating statistics - using realistic data for AliExpress style with multiple reviews
  const averageRating = 4.2;
  const totalReviews = 247;
  const ratingCounts = [156, 45, 28, 12, 6]; // For ratings 5, 4, 3, 2, 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <button className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-gray-600 font-medium text-sm">
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-start gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-4 h-4 ${star <= averageRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{totalReviews} reviews</div>
        </div>

        <div className="flex-1 space-y-1">
          {ratingCounts.map((count, index) => {
            const rating = 5 - index;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer appearance-none"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-3"></div>

        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
          <Star className="w-4 h-4 text-gray-500" />
          <select 
            value={filterRating} 
            onChange={(e) => setFilterRating(Number(e.target.value))}
            className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer appearance-none"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-gray-700 text-sm mb-2">
              <span>
                {expandedReviews.has(review.id) ? review.comment : truncateText(review.comment)}
                {review.comment.length > 120 && (
                  <button
                    onClick={() => toggleReadMore(review.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
                  >
                    {expandedReviews.has(review.id) ? 'Read less' : 'Read more'}
                  </button>
                )}
              </span>
            </div>

            {/* Review Images/Videos */}
            {(review.images || review.video) && (
              <div className="flex gap-2 mb-2">
                {review.images?.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded cursor-pointer"
                    />
                    <Camera className="absolute bottom-1 right-1 w-3 h-3 text-white bg-black bg-opacity-50 rounded" />
                  </div>
                ))}
                {review.video && (
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center cursor-pointer">
                      <Play className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Facebook-style Actions */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-200 transition-colors py-2 rounded-full bg-gray-100">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Like</span>
                <span className="text-sm text-gray-500">({review.likes})</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-200 transition-colors py-2 rounded-full bg-gray-100">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Comment</span>
                <span className="text-sm text-gray-500">({review.comments})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-full w-full text-gray-600 font-medium">
        <span>View more</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CustomerReviews;