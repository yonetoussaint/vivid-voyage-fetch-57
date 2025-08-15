import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useSeller, 
  useSellerProducts, 
  useSellerCollections,
  useSellerReviews,
  useSellerReels 
} from '@/hooks/useSeller';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, Users, Shield, MapPin, Mail, Phone, Grid, Play, 
  ChevronLeft, FolderOpen, Edit, Eye, MessageCircle, 
  Instagram, Facebook, Twitter, Youtube, Linkedin, Globe,
  Settings, ExternalLink, Loader2, Plus 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

import { SocialMediaEditDialog } from '@/components/seller/SocialMediaEditDialog';
import { SellerEditDialog } from '@/components/seller/SellerEditDialog';
import { VideoUploadDialog } from '@/components/seller/VideoUploadDialog';
import { Product } from '@/integrations/supabase/products';
import TabsNavigation from '@/components/home/TabsNavigation';
import UnifiedHeader from '@/components/shared/UnifiedHeader';

const SellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showSocialEditDialog, setShowSocialEditDialog] = useState(false);
  const [showSellerEditDialog, setShowSellerEditDialog] = useState(false);
  const [showVideoUploadDialog, setShowVideoUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useSellerProducts(sellerId!);
  const { data: videos = [], isLoading: videosLoading, refetch: refetchVideos } = useSellerReels(sellerId!);
  const { data: collections = [], isLoading: collectionsLoading } = useSellerCollections(sellerId!);
  const { data: reviews = [], isLoading: reviewsLoading } = useSellerReviews(sellerId!);

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading seller...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Seller Not Found</h1>
          <p className="text-muted-foreground">The seller you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

    const { data } = supabase.storage
      .from('seller-logos')
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  const getProductImageUrl = (product: Product): string => {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].src;
    }
    return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/product/${product.id}/edit`);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };


  const handleVideoClick = (videoId: string) => {
    navigate(`/reels?video=${videoId}`);
  };

  const handleVideoUploadSuccess = () => {
    refetchVideos();
    setShowVideoUploadDialog(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-5 h-5" };
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram {...iconProps} />;
      case 'facebook': return <Facebook {...iconProps} />;
      case 'twitter': return <Twitter {...iconProps} />;
      case 'youtube': return <Youtube {...iconProps} />;
      case 'linkedin': return <Linkedin {...iconProps} />;
      case 'website':
      case 'site': return <Globe {...iconProps} />;
      default: return <ExternalLink {...iconProps} />;
    }
  };

  const mockSocialLinks = [
    { platform: 'instagram', url: 'https://instagram.com/seller', username: '@seller' },
    { platform: 'facebook', url: 'https://facebook.com/seller', username: 'Seller Page' },
    { platform: 'twitter', url: 'https://twitter.com/seller', username: '@seller' },
    { platform: 'website', url: 'https://seller-website.com', username: 'seller-website.com' }
  ];

  const getTrustLevel = (score: number): { level: string; color: string } => {
    if (score >= 90) return { level: "Excellent", color: "text-green-600" };
    if (score >= 80) return { level: "Very Good", color: "text-blue-600" };
    if (score >= 70) return { level: "Good", color: "text-yellow-600" };
    return { level: "Fair", color: "text-orange-600" };
  };

  const trustInfo = getTrustLevel(seller.trust_score);

  const sellerTabs = [
    { id: 'products', label: `Products (${products.length})`, icon: <Grid className="w-4 h-4" /> },
    { id: 'collections', label: `Collections (${collections.length})`, icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'reels', label: `Reels (${videos.length})`, icon: <Play className="w-4 h-4" /> }, // Updated to use videos length
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button - Fixed to match UnifiedHeader exactly */}
      <div className="sticky top-0 z-50 border-b">
        <UnifiedHeader
          title={seller?.name || 'Seller Profile'}
          showCloseButton={false}
          showHelpButton={true}
          leftButton={
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          }
        />
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Seller Profile Header Content */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={getSellerLogoUrl(seller.image_url)} 
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-lg font-bold text-gray-900">{seller.name}</h1>
                {seller.verified && (
                  <Shield className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{formatNumber(seller.followers_count)}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{formatNumber(seller.total_sales)}</div>
                  <div className="text-xs text-gray-500">Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{products.length}</div>
                  <div className="text-xs text-gray-500">Products</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */} 
          <div className="flex gap-2 mb-3">
            <Button 
              onClick={handleFollow}
              variant={isFollowing ? "secondary" : "default"}
              className="flex-1"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              Chat
            </Button>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-2 mb-3">
            {mockSocialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
            <button
              onClick={() => setShowSocialEditDialog(true)}
              className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
              title="Edit social links"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Additional Info Section */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            {seller.description && (
              <p className="text-xs text-gray-500 mb-2 text-center">{seller.description}</p>
            )}

            {seller.category && (
              <div className="flex justify-center mb-2">
                <Badge variant="outline" className="text-xs">{seller.category}</Badge>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 relative">
              {seller.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{seller.address}</span>
                </div>
              )}
              {seller.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{seller.email}</span>
                </div>
              )}
              {seller.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{seller.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{seller.rating?.toFixed(1)} • Trust: {seller.trust_score}%</span>
              </div>

              <button
                onClick={() => setShowSellerEditDialog(true)}
                className="absolute -top-2 -right-2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                title="Edit contact information"
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="w-full bg-white border-b border-gray-200">
        <TabsNavigation 
          tabs={sellerTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className=""
          style={{ backgroundColor: 'transparent' }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="mt-2">
          {activeTab === 'products' && (
            <div className="space-y-6">
              {productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square bg-muted animate-pulse"></div>
                      <CardContent className="p-3">
                        <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-muted rounded animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group relative">
                      <div className="aspect-square bg-muted relative">
                        <img 
                          src={getProductImageUrl(product)} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="bg-white text-black hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleViewProduct(product.id)}
                              variant="outline"
                              className="bg-white/90 text-black hover:bg-white border-gray-300"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold">${product.price}</span>
                          {product.discount_price && (
                            <span className="text-xs text-muted-foreground line-through">${product.discount_price}</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Stock: {product.inventory || 0}</span>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {product.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Grid className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Products Yet</h3>
                  <p className="text-muted-foreground">This seller hasn't added any products yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-6">
              {collectionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-[4/3] bg-muted animate-pulse"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-muted rounded animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : collections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map((collection) => (
                    <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-[4/3] bg-muted relative">
                        <img 
                          src={collection.image_url || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop`} 
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {collection.product_count} items
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1 line-clamp-1">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Collections Yet</h3>
                  <p className="text-muted-foreground">This seller hasn't created any collections yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reels' && (
            <div className="space-y-6">
              {/* Upload Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Reels</h3>
                <Button
                  onClick={() => setShowVideoUploadDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Upload Video
                </Button>
              </div>
              
              {videosLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-[3/4] bg-muted animate-pulse"></div>
                      <CardContent className="p-3">
                        <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-muted rounded animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="aspect-[3/4] bg-muted relative" onClick={() => handleVideoClick(video.id)}>
                        <video 
                          src={video.video_url} 
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        {/* Duration indicator */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                        {/* Bottom overlay with info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <div className="text-white text-xs font-medium line-clamp-2 mb-1">{video.title}</div>
                          <div className="flex items-center gap-2 text-white/80 text-xs">
                            <span>{formatNumber(video.views)} views</span>
                            <span>{formatNumber(video.likes)} likes</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Reels Yet</h3>
                  <p className="text-muted-foreground">This seller hasn't posted any reels yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviewsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            by {review.user_name} • {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm mt-2">{review.comment}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">This seller hasn't received any reviews yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Seller Edit Dialog */}
      <SellerEditDialog
        open={showSellerEditDialog}
        onOpenChange={setShowSellerEditDialog}
        seller={seller}
        onSuccess={() => {
          setShowSellerEditDialog(false);
        }}
      />

      {/* Social Media Edit Dialog */}
      <SocialMediaEditDialog
        open={showSocialEditDialog}
        onOpenChange={setShowSocialEditDialog}
        sellerId={sellerId!}
        currentLinks={mockSocialLinks}
        onSuccess={() => {
          setShowSocialEditDialog(false);
        }}
      />

      {/* Video Upload Dialog */}
      <VideoUploadDialog
        open={showVideoUploadDialog}
        onOpenChange={setShowVideoUploadDialog}
        sellerId={sellerId!}
        onSuccess={handleVideoUploadSuccess}
      />
    </div>
  );
};

export default SellerPage;