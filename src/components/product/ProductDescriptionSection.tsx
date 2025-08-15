import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, FileText, Video, BookOpen, Wrench, Shield, Zap } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import ProductSpecifications from './ProductSpecifications';

const ProductDescriptionSection = () => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  
  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');

  if (!product) return null;

  const handleSeeFullDescription = () => {
    navigate(`/product/${paramId}/description`);
  };

  const productImages = [
    {
      type: 'main',
      caption: 'Product main features and quality',
      alt: 'Main product image'
    },
    {
      type: 'usage',
      caption: 'How to use it in daily work',
      alt: 'Product usage demonstration'
    },
    {
      type: 'quality',
      caption: 'Materials and premium quality',
      alt: 'Quality and materials details'
    },
    {
      type: 'community',
      caption: 'Perfect for your needs',
      alt: 'People using the product'
    }
  ];

  // Sample documentation data
  const documents = [
    {
      id: 1,
      title: 'Quick Start Guide',
      description: 'Get up and running in minutes with our step-by-step setup guide',
      type: 'guide',
      category: 'getting-started',
      format: 'pdf',
      size: '2.1 MB',
      downloadUrl: '#',
      viewUrl: '#',
      icon: Zap,
      featured: true
    },
    {
      id: 2,
      title: 'API Documentation',
      description: 'Complete reference for all API endpoints and integration methods',
      type: 'documentation',
      category: 'technical',
      format: 'web',
      viewUrl: '#',
      icon: FileText,
      featured: true
    },
    {
      id: 3,
      title: 'Installation Video Tutorial',
      description: 'Visual walkthrough of the complete installation process',
      type: 'video',
      category: 'getting-started',
      format: 'mp4',
      duration: '12:34',
      viewUrl: '#',
      icon: Video,
      featured: false
    },
    {
      id: 4,
      title: 'Security Best Practices',
      description: 'Essential security guidelines and configuration recommendations',
      type: 'guide',
      category: 'security',
      format: 'pdf',
      size: '1.8 MB',
      downloadUrl: '#',
      viewUrl: '#',
      icon: Shield,
      featured: false
    },
    {
      id: 5,
      title: 'Advanced Configuration',
      description: 'Deep dive into advanced settings and customization options',
      type: 'documentation',
      category: 'technical',
      format: 'pdf',
      size: '4.2 MB',
      downloadUrl: '#',
      viewUrl: '#',
      icon: Wrench,
      featured: false
    },
    {
      id: 6,
      title: 'User Manual',
      description: 'Comprehensive user guide covering all features and functionality',
      type: 'documentation',
      category: 'user-guide',
      format: 'pdf',
      size: '8.5 MB',
      downloadUrl: '#',
      viewUrl: '#',
      icon: BookOpen,
      featured: true
    },
    {
      id: 7,
      title: 'Troubleshooting Guide',
      description: 'Common issues and their solutions with detailed troubleshooting steps',
      type: 'guide',
      category: 'support',
      format: 'web',
      viewUrl: '#',
      icon: Wrench,
      featured: false
    },
    {
      id: 8,
      title: 'Integration Examples',
      description: 'Code samples and implementation examples for popular frameworks',
      type: 'documentation',
      category: 'technical',
      format: 'zip',
      size: '12.3 MB',
      downloadUrl: '#',
      icon: FileText,
      featured: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'getting-started', label: 'Getting Started' },
    { value: 'technical', label: 'Technical' },
    { value: 'user-guide', label: 'User Guides' },
    { value: 'security', label: 'Security' },
    { value: 'support', label: 'Support' }
  ];

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const featuredDocuments = filteredDocuments.filter(doc => doc.featured);
  const regularDocuments = filteredDocuments.filter(doc => !doc.featured);

  const getFormatBadgeColor = (format) => {
    const colors = {
      pdf: 'bg-red-100 text-red-800',
      web: 'bg-blue-100 text-blue-800',
      mp4: 'bg-purple-100 text-purple-800',
      zip: 'bg-green-100 text-green-800'
    };
    return colors[format] || 'bg-gray-100 text-gray-800';
  };

  // Use real product images if available
  const productImageSources = product.product_images?.map(img => img.src) || [];
  const fallbackImages = [
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
        <button 
          onClick={handleSeeFullDescription}
          className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-gray-600 font-medium text-sm"
        >
          See Full Description
        </button>
      </div>

      {/* Main Description Block */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-gray-900">{product.name}</h4>
        <p className="text-gray-700 leading-relaxed">
          {product.description || 'Experience premium quality with this carefully designed product. Built using advanced technology and high-grade materials to ensure durability and exceptional performance.'}
        </p>
      </div>

      {/* Key Features Grid */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Key Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">✨ Premium Quality</h5>
            <p className="text-sm text-gray-600">Crafted with attention to detail using high-quality materials that ensure long-lasting durability and optimal performance.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">🎯 User-Friendly Design</h5>
            <p className="text-sm text-gray-600">Intuitive design that makes it easy to use for both beginners and professionals. Perfect for everyday tasks.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">🔧 Versatile Application</h5>
            <p className="text-sm text-gray-600">Suitable for various use cases and environments. Works great at home, office, or on-the-go.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">💯 Reliable Performance</h5>
            <p className="text-sm text-gray-600">Consistent and dependable performance that you can count on. Built to exceed expectations.</p>
          </div>
        </div>
      </div>

      {/* Product Images Gallery */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Product Gallery</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(showFullContent ? productImages : productImages.slice(0, 2)).map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={
                    productImageSources[index] 
                      ? productImageSources[index]
                      : `${fallbackImages[index]}?auto=format&fit=crop&w=400&q=80`
                  }
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">{image.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Specifications */}
      <ProductSpecifications />

      {/* Guides & Documentation */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Guides & Documentation</h3>
        </div>

        {/* Featured Documents */}
        {featuredDocuments.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-gray-800">Featured Documentation</h4>
            <div className="relative">
              <select
                className="w-full p-3 rounded-lg bg-gray-100 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-200"
                value={featuredDocuments[0]?.id || ''}
                onChange={(e) => {
                  const selectedDoc = featuredDocuments.find(doc => doc.id === parseInt(e.target.value));
                  if (selectedDoc?.viewUrl) {
                    window.open(selectedDoc.viewUrl, '_blank');
                  }
                }}
              >
                {featuredDocuments.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title} - {doc.format.toUpperCase()} {doc.size && `(${doc.size})`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Video Tutorials */}
        {regularDocuments.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-gray-800">Video Tutorials</h4>
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-2">
                {regularDocuments.map(doc => (
                  <div key={doc.id} className="w-72 flex-shrink-0">
                    <div className="rounded-lg overflow-hidden cursor-pointer transition-all bg-gray-100 hover:bg-gray-200 h-full flex flex-col">
                      <div className="relative">
                        <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        {doc.duration && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                            {doc.duration}
                          </div>
                        )}
                        {doc.featured && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                            <Zap size={8} fill="white" className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-center">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm line-clamp-1">{doc.title}</span>
                            {doc.featured && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-medium text-gray-900 mb-2">No documents found</h4>
            <p className="text-sm text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Expand/Collapse Button */}
      <button 
        onClick={() => setShowFullContent(!showFullContent)}
        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-full w-full text-gray-600 font-medium"
      >
        <span>{showFullContent ? 'Show Less' : 'Show More Details'}</span>
        {showFullContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ProductDescriptionSection;