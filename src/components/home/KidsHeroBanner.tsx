import { useState, useEffect, useRef } from 'react';
import { BannerType } from './hero/types';
import BannerSlides from './hero/BannerSlides';
import BannerControls from './hero/BannerControls';
import NewsTicker from './hero/NewsTicker';
import FloatingVideo from '../hero/FloatingVideo';

export default function KidsHeroBanner() {
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

  // Kids-specific banners
  const kidsBanners: BannerType[] = [
    {
      id: "kids-1",
      image: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
      type: "image",
      alt: "Educational Toys",
      position: 0,
      duration: 4500
    },
    {
      id: "kids-2", 
      image: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png",
      type: "image",
      alt: "Creative Arts & Crafts",
      position: 1,
      duration: 5000
    },
    {
      id: "kids-3",
      image: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png", 
      type: "video",
      alt: "Interactive Learning",
      position: 2,
      duration: 7000
    }
  ];

  // Handle video duration updates
  const handleVideoDurationChange = (index: number, duration: number) => {
    setVideoDurations(prev => ({ ...prev, [index]: duration }));
  };

  // Get duration for current slide
  const getCurrentSlideDuration = () => {
    const slide = kidsBanners[activeIndex];
    if (!slide) return 5000;
    
    if (slide.type === "video" && videoDurations[activeIndex]) {
      return videoDurations[activeIndex];
    }
    
    return slide.duration || 5000;
  };

  // Banner rotation with dynamic video duration
  useEffect(() => {
    if (kidsBanners.length <= 1) return;
    
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
        setActiveIndex((current) => (current + 1) % kidsBanners.length);
      }, duration);
    };

    startSlideTimer();

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      if (progressIntervalRef) clearInterval(progressIntervalRef);
    };
  }, [activeIndex, kidsBanners.length, videoDurations]);

  // Scroll detection for floating video
  useEffect(() => {
    const handleScroll = () => {
      if (!heroBannerRef.current) return;
      
      const currentSlide = kidsBanners[activeIndex];
      if (!currentSlide || currentSlide.type !== "video") {
        setShowFloatingVideo(false);
        return;
      }

      const rect = heroBannerRef.current.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      
      if (!isVisible && !showFloatingVideo) {
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && !videoElement.paused) {
          const exactTime = videoElement.currentTime;
          videoElement.pause();
          videoElement.muted = true;
          setVideoCurrentTime(exactTime);
          setShowFloatingVideo(true);
        }
      } else if (isVisible && showFloatingVideo) {
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && videoElement.paused) {
          videoElement.play().catch(console.error);
        }
        setShowFloatingVideo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, kidsBanners, showFloatingVideo]);

  const handleCloseFloatingVideo = () => {
    setShowFloatingVideo(false);
  };

  const handleExpandFloatingVideo = () => {
    setShowFloatingVideo(false);
    heroBannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSlide = kidsBanners[activeIndex];

  return (
    <>
      <div
        ref={heroBannerRef}
        className="relative overflow-hidden w-full"
        style={{ marginTop: offset }}
      >
        <BannerSlides 
          slides={kidsBanners}
          activeIndex={activeIndex}
          previousIndex={previousIndex}
          onVideoDurationChange={handleVideoDurationChange}
        />
        <BannerControls
          slidesCount={kidsBanners.length}
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