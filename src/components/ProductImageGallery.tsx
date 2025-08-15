import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import VideoControls from "@/components/product/VideoControls";
import { GalleryThumbnails } from "@/components/product/GalleryThumbnails";
import ImageGalleryControls from "@/components/product/ImageGalleryControls";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ArrowUpToLine } from "lucide-react";
import InfoBand from "@/components/product/InfoBand";

interface ProductImageGalleryProps {
  images: string[];
  videos?: {
    id: string;
    video_url: string;
    title?: string;
    description?: string;
    thumbnail_url?: string;
  }[];
}

interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  videoData?: any;
  index: number;
}

interface TouchPosition {
  x: number;
  y: number;
}

// Helper function to combine images and videos into a unified gallery
function createGalleryItems(images: string[], videos: any[] = []): GalleryItem[] {
  const items: GalleryItem[] = [];

  // Add images first
  images.forEach((image) => {
    items.push({
      type: 'image',
      src: image,
      index: items.length
    });
  });

  // Add videos
  videos.forEach((video) => {
    items.push({
      type: 'video',
      src: video.video_url,
      videoData: video,
      index: items.length
    });
  });

  return items;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  videos = []
}) => {
  // Create unified gallery items
  const galleryItems = createGalleryItems(images, videos);
  const totalItems = galleryItems.length;
  const videoIndices = galleryItems.map((item, index) => item.type === 'video' ? index : -1).filter(i => i !== -1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isRotated, setIsRotated] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [preloadedItems, setPreloadedItems] = useState<string[]>([]);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [autoScrollInterval, setAutoScrollInterval] = useState<NodeJS.Timeout | null>(null);
  const [thumbnailViewMode, setThumbnailViewMode] = useState<"row" | "grid">("row");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [hoveredThumbnail, setHoveredThumbnail] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const [volume, setVolume] = useState(1);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCompareMode, setShowCompareMode] = useState(false);
  const [compareIndex, setCompareIndex] = useState(0);
  const [showImageInfo, setShowImageInfo] = useState(false);
  const [viewHistory, setViewHistory] = useState<number[]>([0]);
  const [imageFilter, setImageFilter] = useState<string>("none");
  const [showOtherColors, setShowOtherColors] = useState<boolean>(false);
  const [showAllControls, setShowAllControls] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"default" | "immersive">("default");

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartPosition = useRef<TouchPosition | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [openedThumbnailMenu, setOpenedThumbnailMenu] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);

  // Get current item
  const currentItem = galleryItems[currentIndex];
  const isCurrentVideo = currentItem?.type === 'video';

  // Debug logging
  useEffect(() => {
    console.log('Gallery items:', galleryItems);
    console.log('Current index:', currentIndex);
    console.log('Current item:', currentItem);
    console.log('Is current video:', isCurrentVideo);
  }, [galleryItems, currentIndex, currentItem, isCurrentVideo]);

  useEffect(() => {
    const preloadItems = async () => {
      const preloaded = await Promise.all(
        galleryItems.map((item) => {
          return new Promise<string>((resolve) => {
            if (item.type === 'image') {
              const img = new Image();
              img.src = item.src;
              img.onload = () => resolve(item.src);
              img.onerror = () => resolve(item.src);
            } else {
              // For videos, just resolve the URL
              resolve(item.src);
            }
          });
        })
      );
      setPreloadedItems(preloaded);
    };

    preloadItems();
  }, [galleryItems]);

  // Fixed video event listeners
  useEffect(() => {
    if (!isCurrentVideo || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime || 0);
    const onLoadedMetadata = () => setDuration(video.duration || 0);
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onError = (e: Event) => {
      console.error('Video error:', e);
      // Don't crash the component on video error
    };

    try {
      video.addEventListener('play', onPlay);
      video.addEventListener('pause', onPause);
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('progress', onProgress);
      video.addEventListener('error', onError);

      return () => {
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('progress', onProgress);
        video.removeEventListener('error', onError);
      };
    } catch (error) {
      console.error('Error setting up video event listeners:', error);
    }
  }, [isCurrentVideo, currentIndex]); // Added currentIndex as dependency

  const onApiChange = useCallback((api: CarouselApi | null) => {
    if (!api) return;

    setApi(api);
    setCurrentIndex(api.selectedScrollSnap());

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);
      setIsRotated(0);
      setIsFlipped(false);
      setZoomLevel(1);
      setIsPlaying(false); // Reset video playing state
      setCurrentTime(0);
      setDuration(0);
      setBufferedTime(0);

      setViewHistory(prev => [...prev, index]);
    });
  }, []);

  const handleThumbnailClick = useCallback((index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  }, [api]);

  const handlePrevious = useCallback(() => {
    if (api) api.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    if (api) api.scrollNext();
  }, [api]);

  const handleRotate = useCallback(() => {
    setIsRotated(prev => (prev + 90) % 360);
  }, []);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const downloadItem = useCallback((index: number) => {
    const item = galleryItems[index];
    const link = document.createElement('a');
    link.href = item.src;
    link.download = `product-${item.type}-${index + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: `${item.type === 'video' ? 'Video' : 'Image'} downloaded`,
      description: `${item.type === 'video' ? 'Video' : 'Image'} ${index + 1} has been downloaded`,
      duration: 2000,
    });
  }, [galleryItems]);

  const copyItemUrl = useCallback((index: number) => {
    const item = galleryItems[index];
    navigator.clipboard.writeText(item.src);

    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);

    toast({
      title: `${item.type === 'video' ? 'Video' : 'Image'} URL copied`,
      description: `${item.type === 'video' ? 'Video' : 'Image'} URL has been copied to clipboard`,
      duration: 2000,
    });
  }, [galleryItems]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreenMode(prev => !prev);

    if (!isFullscreenMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isFullscreenMode]);

  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => !prev);
  }, []);

  const handleImageClick = useCallback(() => {
    if (focusMode) {
      setFocusMode(false);
    } else if (!isCurrentVideo) {
      toggleFullscreen();
    }
  }, [focusMode, toggleFullscreen, isCurrentVideo]);

  // Video control handlers
  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min((videoRef.current.currentTime || 0) + 10, duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max((videoRef.current.currentTime || 0) - 10, 0);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreenVideo = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      }
    }
  };

  const toggleAutoScroll = useCallback(() => {
    setAutoScrollEnabled(prev => !prev);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenMode) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreenMode, toggleFullscreen]);

  useEffect(() => {
    if (autoScrollEnabled && api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 3000);

      setAutoScrollInterval(interval);

      return () => {
        clearInterval(interval);
      };
    } else if (!autoScrollEnabled && autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }

    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, [autoScrollEnabled, api]);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col bg-transparent">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">No images or videos available</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col bg-transparent">
      <div className="relative w-full aspect-square overflow-hidden">
        <Carousel
          className="w-full h-full"
          opts={{
            loop: totalItems > 1,
          }}
          setApi={onApiChange}
        >
          <CarouselContent className="h-full">
            {galleryItems.map((item, index) => (
              <CarouselItem key={`${item.type}-${index}`} className="h-full">
                <div className="flex h-full w-full items-center justify-center overflow-hidden relative">
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        ref={index === currentIndex ? videoRef : undefined}
                        src={item.src}
                        className="w-full h-full object-contain cursor-pointer"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          aspectRatio: '1/1', 
                          objectFit: 'cover' 
                        }}
                        onClick={toggleVideo}
                        playsInline
                        loop
                        muted={isMuted}
                        autoPlay={false}
                        poster={item.videoData?.thumbnail_url}
                        preload="metadata"
                        onError={(e) => {
                          console.error('Video loading error:', e);
                          // You might want to show a fallback image here
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                      {index === currentIndex && isCurrentVideo && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="pointer-events-auto h-full w-full flex items-end">
                            <VideoControls
                              isPlaying={isPlaying}
                              isMuted={isMuted}
                              volume={volume}
                              onPlayPause={toggleVideo}
                              onMuteToggle={handleMuteToggle}
                              onVolumeChange={handleVolumeChange}
                              currentTime={currentTime}
                              duration={duration}
                              bufferedTime={bufferedTime}
                              onSeek={handleSeek}
                              onSkipForward={handleSkipForward}
                              onSkipBackward={handleSkipBackward}
                              onFullscreenToggle={handleFullscreenVideo}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      ref={index === currentIndex ? imageRef : undefined}
                      src={item.src}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-contain transition-transform"
                      style={{
                        transform: `
                          rotate(${isRotated}deg)
                          ${isFlipped ? 'scaleX(-1)' : ''}
                          scale(${zoomLevel})
                        `,
                        transition: "transform 0.2s ease-out",
                        filter: imageFilter !== "none"
                          ? imageFilter === "grayscale" ? "grayscale(1)"
                            : imageFilter === "sepia" ? "sepia(0.7)"
                              : imageFilter === "brightness" ? "brightness(1.2)"
                                : imageFilter === "contrast" ? "contrast(1.2)"
                                  : "none"
                          : "none"
                      }}
                      draggable={false}
                      onClick={handleImageClick}
                      onError={(e) => {
                        console.error('Image loading error:', e);
                        // You might want to show a fallback image here
                      }}
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Show image controls only for images */}
          {!isCurrentVideo && (
            <ImageGalleryControls
              currentIndex={currentIndex}
              totalImages={totalItems}
              isRotated={isRotated}
              isFlipped={isFlipped}
              autoScrollEnabled={autoScrollEnabled}
              focusMode={focusMode}
              isPlaying={false}
              showControls={!(focusMode || (isCurrentVideo && isPlaying))}
              onRotate={handleRotate}
              onFlip={handleFlip}
              onToggleAutoScroll={toggleAutoScroll}
              onToggleFocusMode={toggleFocusMode}
            />
          )}
        </Carousel>
      </div>

      <InfoBand />

      {/* Thumbnails */}
      {totalItems > 1 && (
        <div className="mt-1 w-full">
          <GalleryThumbnails
            images={galleryItems.map(item => item.src)}
            currentIndex={currentIndex}
            onThumbnailClick={handleThumbnailClick}
            isPlaying={isPlaying}
            videoIndices={videoIndices}
            galleryItems={galleryItems}
          />
        </div>
      )}

      {/* Fullscreen Mode */}
      {isFullscreenMode && (
        <div 
          ref={fullscreenRef}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in"
          onClick={toggleFullscreen}
        >
          <button 
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            onClick={toggleFullscreen}
          >
            <ArrowUpToLine className="h-5 w-5" />
          </button>

          {isCurrentVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                src={currentItem.src}
                className="max-w-[90%] max-h-[90%] object-contain"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideo();
                }}
                playsInline
                loop
                muted={isMuted}
                autoPlay={false}
                style={{ background: "black" }}
                controls={false}
                onError={(e) => {
                  console.error('Fullscreen video loading error:', e);
                }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 pointer-events-none">
                <div className="pointer-events-auto h-full w-full flex items-end">
                  <VideoControls
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    volume={volume}
                    onPlayPause={toggleVideo}
                    onMuteToggle={handleMuteToggle}
                    onVolumeChange={handleVolumeChange}
                    currentTime={currentTime}
                    duration={duration}
                    bufferedTime={bufferedTime}
                    onSeek={handleSeek}
                    onSkipForward={handleSkipForward}
                    onSkipBackward={handleSkipBackward}
                    onFullscreenToggle={handleFullscreenVideo}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <img 
                src={currentItem.src} 
                alt={`Product fullscreen image ${currentIndex + 1}`} 
                className="max-w-[90%] max-h-[90%] object-contain"
                style={{
                  transform: `
                    rotate(${isRotated}deg)
                    ${isFlipped ? 'scaleX(-1)' : ''}
                    scale(${zoomLevel})
                  `,
                  filter: imageFilter !== "none"
                    ? imageFilter === "grayscale" ? "grayscale(1)"
                      : imageFilter === "sepia" ? "sepia(0.7)"
                        : imageFilter === "brightness" ? "brightness(1.2)"
                          : imageFilter === "contrast" ? "contrast(1.2)"
                            : "none"
                    : "none"
                }}
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  console.error('Fullscreen image loading error:', e);
                }}
              />
              <ImageGalleryControls
                currentIndex={currentIndex}
                totalImages={totalItems}
                isRotated={isRotated}
                isFlipped={isFlipped}
                autoScrollEnabled={autoScrollEnabled}
                focusMode={focusMode}
                variant="fullscreen"
                onRotate={(e) => {
                  if (e) e.stopPropagation();
                  handleRotate();
                }}
                onFlip={(e) => {
                  if (e) e.stopPropagation();
                  handleFlip();
                }}
                onToggleAutoScroll={toggleAutoScroll}
                onToggleFocusMode={toggleFocusMode}
                onPrevious={(e) => {
                  if (e) e.stopPropagation();
                  handlePrevious();
                }}
                onNext={(e) => {
                  if (e) e.stopPropagation();
                  handleNext();
                }}
                onDownload={(e) => {
                  if (e) e.stopPropagation();
                  downloadItem(currentIndex);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;