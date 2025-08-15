import { useState, useEffect, useRef } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchHeroBanners } from "@/integrations/supabase/hero";
import { setupStorageBuckets } from "@/integrations/supabase/setupStorage";
import { toast } from "sonner";
import BannerSlides from './hero/BannerSlides';
import BannerControls from './hero/BannerControls';
import NewsTicker from './hero/NewsTicker';
import FloatingVideo from '../hero/FloatingVideo';
import { BannerType } from './hero/types';

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [showNews, setShowNews] = useState(true);
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState<number>(0);
  const [videoDurations, setVideoDurations] = useState<{[key: number]: number}>({});
  const [showFloatingVideo, setShowFloatingVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  // Dynamically measure header height
  useEffect(() => {
    function updateOffset() {
      const header = document.getElementById("ali-header");
      setOffset(header ? header.offsetHeight : 0);
    }
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  // Initialize storage buckets if needed
  useEffect(() => {
    const initStorage = async () => {
      await setupStorageBuckets();
      console.log('Storage buckets initialized');
    };
    initStorage();
  }, []);

  // Fetch banners from Supabase
  const { data: banners, isLoading, error } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: fetchHeroBanners,
    staleTime: 5000,
    refetchInterval: 10000,
  });

  // Show error if banner fetch fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load banner images");
      console.error("Banner fetch error:", error);
    }
  }, [error]);

  // Preload images
  useEffect(() => {
    if (banners) {
      console.log("Banners loaded from query:", banners);
      banners.forEach(banner => {
        if (banner.image) {
          const img = new Image();
          img.src = banner.image;
        }
      });
    }
  }, [banners]);

  // Fallback banners with unique durations
  const fallbackBanners: BannerType[] = [
    {
      id: "1",
      image: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
      type: "image",
      alt: "Banner 1",
      position: 0,
      duration: 4000
    },
    {
      id: "2",
      image: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png",
      type: "video",
      alt: "Banner 2", 
      position: 1,
      duration: 6000
    },
    {
      id: "3",
      image: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png",
      type: "image",
      alt: "Banner 3",
      position: 2,
      duration: 8000
    }
  ];

  // Transform banners to match BannerType interface
  const transformedBanners: BannerType[] = banners?.map(banner => {
    // Detect if it's a video file based on extension or URL path
    // Handle both encoded and non-encoded URLs
    const decodedUrl = decodeURIComponent(banner.image);
    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(decodedUrl) || 
                    /\.(mp4|webm|ogg|mov|avi)$/i.test(banner.image);
    
    console.log(`Banner ${banner.id}: ${banner.image} -> isVideo: ${isVideo}`);
    
    return {
      ...banner,
      type: isVideo ? "video" as const : "image" as const,
      duration: banner.duration || (isVideo ? 10000 : 5000) // Use database duration or default
    };
  }) || [];
  
  const slidesToShow = transformedBanners.length > 0 ? transformedBanners : fallbackBanners;

  // Handle video duration updates
  const handleVideoDurationChange = (index: number, duration: number) => {
    setVideoDurations(prev => ({ ...prev, [index]: duration }));
  };

  // Get duration for current slide (use video duration if available, otherwise default)
  const getCurrentSlideDuration = () => {
    const slide = slidesToShow[activeIndex];
    if (!slide) return 5000;
    
    // If it's a video and we have its duration, use that
    if (slide.type === "video" && videoDurations[activeIndex]) {
      return videoDurations[activeIndex];
    }
    
    // Otherwise use the slide's duration or default
    return slide.duration || 5000;
  };

  // Banner rotation with dynamic video duration
  useEffect(() => {
    if (slidesToShow.length <= 1) return;
    
    let timeoutRef: ReturnType<typeof setTimeout> | null = null;
    let progressIntervalRef: ReturnType<typeof setInterval> | null = null;

    const duration = getCurrentSlideDuration();
    const progressStep = (50 / duration) * 100;

    const startSlideTimer = () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      if (progressIntervalRef) clearInterval(progressIntervalRef);
      setProgress(0);

      progressIntervalRef = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + progressStep));
      }, 50);

      timeoutRef = setTimeout(() => {
        setProgress(0);
        setPreviousIndex(activeIndex);
        setActiveIndex((current) => (current + 1) % slidesToShow.length);
      }, duration);
    };

    startSlideTimer();

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      if (progressIntervalRef) clearInterval(progressIntervalRef);
    };
  }, [activeIndex, slidesToShow.length, videoDurations]); // Include videoDurations in dependencies

  // Scroll detection for floating video
  useEffect(() => {
    const handleScroll = () => {
      if (!heroBannerRef.current) return;
      
      const currentSlide = slidesToShow[activeIndex];
      if (!currentSlide || currentSlide.type !== "video") {
        setShowFloatingVideo(false);
        return;
      }

      const rect = heroBannerRef.current.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      
      if (!isVisible && !showFloatingVideo) {
        // Get current video time and pause the main video for perfect sync
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && !videoElement.paused) {
          const exactTime = videoElement.currentTime;
          videoElement.pause(); // Pause main video to prevent drift
          videoElement.muted = true; // Mute main video when floating appears
          setVideoCurrentTime(exactTime);
          setShowFloatingVideo(true);
        }
      } else if (isVisible && showFloatingVideo) {
        // Resume main video when returning to hero banner
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && videoElement.paused) {
          videoElement.play().catch(console.error);
        }
        setShowFloatingVideo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, slidesToShow, showFloatingVideo]);

  // Continuously sync video time while floating video is visible
  useEffect(() => {
    if (!showFloatingVideo || !heroBannerRef.current) return;

    // Remove the continuous sync that was causing the scratching effect
    // The floating video will now play independently after initial sync
  }, [showFloatingVideo]);

  const handleCloseFloatingVideo = () => {
    setShowFloatingVideo(false);
  };

  const handleExpandFloatingVideo = () => {
    setShowFloatingVideo(false);
    // Scroll back to hero banner
    heroBannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSlide = slidesToShow[activeIndex];

  if (isLoading) {
    return (
      <div 
        className="relative w-full bg-gray-200 animate-pulse h-[60vh] overflow-hidden"
        style={{ marginTop: offset }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">Loading banners...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={heroBannerRef}
        className="relative overflow-hidden w-full"
        style={{ marginTop: offset }}
      >
        <BannerSlides 
          slides={slidesToShow}
          activeIndex={activeIndex}
          previousIndex={previousIndex}
          onVideoDurationChange={handleVideoDurationChange}
        />
        <BannerControls
          slidesCount={slidesToShow.length}
          activeIndex={activeIndex}
          previousIndex={previousIndex}
          setActiveIndex={setActiveIndex}
          setPreviousIndex={setPreviousIndex}
          progress={progress}
        />
      </div>
      {showNews && <NewsTicker />}
      
      {/* Floating Video */}
      {showFloatingVideo && currentSlide && currentSlide.type === "video" && (
        <FloatingVideo
          src={currentSlide.image}
          alt={currentSlide.alt}
          isVisible={showFloatingVideo}
          onClose={handleCloseFloatingVideo}
          onExpand={handleExpandFloatingVideo}
          currentTime={videoCurrentTime}
          headerOffset={offset}
        />
      )}
    </>
  );
}