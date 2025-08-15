import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageSquare, Share, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useVideos, Video } from "@/hooks/useVideos";
import ReelsSkeleton from "@/components/skeletons/ReelsSkeleton";

// Mock custom hook - returns true for mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  return isMobile;
};

// Avatar components
const Avatar = ({ className, children }) => (
  <div className={`relative inline-block rounded-full overflow-hidden ${className}`}>
    {children}
  </div>
);
const AvatarImage = ({ src, alt }) => (
  <img src={src} alt={alt} className="h-full w-full object-cover" />
);
const AvatarFallback = ({ children }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-500 text-white">
    {children}
  </div>
);

// Button component
const Button = ({ variant = "default", size = "md", className, children, ...props }) => {
  let sizeClasses = "py-2 px-4";
  if (size === "sm") sizeClasses = "py-1 px-3 text-sm";
  return (
    <button 
      className={`font-medium rounded ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Reel interface
interface Reel {
  id: number;
  username: string;
  avatar: string;
  description: string;
  videoUrl: string;
  likes: string;
  comments: number;
  productName: string;
  productPrice: string;
  productImage: string;
}

export default function Reels() {
  const [searchParams] = useSearchParams();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playingStates, setPlayingStates] = useState<boolean[]>([]);
  const reelRefs = useRef([]);
  const observerRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { data: videos, isLoading } = useVideos();
  const videoParam = searchParams.get('video');

  // Initialize playing states when videos load
  useEffect(() => {
    if (videos) {
      setPlayingStates(new Array(videos.length).fill(false));
    }
  }, [videos]);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${Math.round(views / 1000)}K`;
    }
    return views.toString();
  };

  // Find initial video index if video param is provided
  useEffect(() => {
    if (videos && videoParam) {
      const videoIndex = videos.findIndex(video => video.id === videoParam);
      if (videoIndex !== -1) {
        setActiveReelIndex(videoIndex);
      }
    }
  }, [videos, videoParam]);

  useEffect(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const videoId = Number(entry.target.id.replace('reel-', ''));
              setActiveReelIndex(videoId);
              reelRefs.current.forEach((videoRef, idx) => {
                if (videoRef) {
                  if (idx === videoId) {
                    videoRef.currentTime = 0;
                    videoRef.play().catch(err => console.log('Autoplay prevented:', err));
                  } else {
                    videoRef.pause();
                  }
                }
              });
            }
          });
        },
        { threshold: 0.7 }
      );
    }
  }, []);

  useEffect(() => {
    if (observerRef.current && reelRefs.current.length > 0 && videos) {
      reelRefs.current.forEach((ref, index) => {
        if (ref && ref.parentElement) {
          observerRef.current.observe(ref.parentElement);
        }
      });
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isReady, videos]);

  useEffect(() => {
    if (isMobile !== undefined) {
      setIsReady(true);
    }
  }, [isMobile]);

  // Start playing the first video or the specific video from URL param
  useEffect(() => {
    if (videos && isReady && reelRefs.current.length > 0) {
      const targetIndex = activeReelIndex;
      const targetVideo = reelRefs.current[targetIndex];
      if (targetVideo) {
        targetVideo.currentTime = 0;
        // Force play the video
        targetVideo.play().then(() => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[targetIndex] = true;
            return newStates;
          });
        }).catch(err => {
          console.log('Autoplay prevented, user interaction required:', err);
          // If autoplay fails, show play button
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[targetIndex] = false;
            return newStates;
          });
        });
      }
    }
  }, [videos, isReady, activeReelIndex]);

  const handleVideoClick = (index: number, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    console.log('Video click handler called for index:', index);
    const video = reelRefs.current[index];
    
    if (video) {
      console.log('Video element found, paused:', video.paused, 'currentTime:', video.currentTime);
      
      if (video.paused) {
        video.currentTime = 0; // Reset to beginning
        console.log('Attempting to play video...');
        
        video.play().then(() => {
          console.log('Video play succeeded');
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }).catch(err => {
          console.error('Play failed:', err);
          // Force the playing state to false so the play button shows
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = false;
            return newStates;
          });
        });
      } else {
        console.log('Pausing video...');
        video.pause();
        setPlayingStates(prev => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }
    } else {
      console.error('Video element not found for index:', index);
    }
  };

  // Add event listeners to track video play/pause state
  useEffect(() => {
    reelRefs.current.forEach((video, index) => {
      if (video) {
        const handlePlay = () => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        };
        
        const handlePause = () => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = false;
            return newStates;
          });
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('pause', handlePause);
        };
      }
    });
  }, [videos]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    reelRefs.current.forEach(videoRef => {
      if (videoRef) {
        videoRef.muted = !isMuted;
      }
    });
  };

  if (isLoading) {
    return <ReelsSkeleton />;
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-black items-center justify-center text-white">
        <p>No videos available</p>
      </div>
    );
  }

  if (!isReady) {
    return <ReelsSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="absolute top-0 z-10 w-full flex justify-center px-3 py-2">
        <div className="bg-black/30 backdrop-blur-sm rounded-full flex p-1">
          <div className="whitespace-nowrap px-3 py-1 bg-red-500 rounded-full text-white text-sm font-medium">
            For You
          </div>
          <div className="whitespace-nowrap px-3 py-1 text-gray-300 text-sm font-medium">
            Following
          </div>
        </div>
      </div>

      <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory">
        {videos.map((video, index) => (
          <div 
            key={video.id}
            id={`reel-${index}`}
            className="w-full h-screen relative snap-start snap-always"
          >
            <video
              ref={(el) => (reelRefs.current[index] = el)}
              src={video.video_url}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              onLoadStart={() => console.log('Video load started for:', video.video_url)}
              onCanPlay={() => console.log('Video can play for:', video.video_url)}
              onError={(e) => console.error('Video error for:', video.video_url, e)}
              onClick={(e) => handleVideoClick(index, e)}
            />

            {/* Play/Pause Overlay */}
            {!playingStates[index] && (
              <div 
                className="absolute inset-0 flex items-center justify-center z-10"
                onClick={(e) => handleVideoClick(index, e)}
              >
                <div className="bg-black/50 rounded-full p-4">
                  <Play className="h-12 w-12 text-white fill-white" />
                </div>
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
              <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="relative z-10 px-4 pb-16 pointer-events-auto">
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-9 w-9 border-2 border-white">
                      <AvatarImage src={video.avatar_url || "/api/placeholder/100/100"} alt={video.username} />
                      <AvatarFallback>{video.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 font-semibold text-white">@{video.username}</span>
                    <Button variant="default" size="sm" className="ml-2 bg-red-500 hover:bg-red-600 text-white text-xs h-7 px-3 rounded-full">
                      Follow
                    </Button>
                  </div>
                  <p className="text-white mb-3 text-sm">{video.description}</p>
                </div>

                {/* Sample product (you can replace this with actual product data later) */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center">
                  <img 
                    src={video.thumbnail_url}
                    alt="Featured Product"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-white text-sm font-medium">Featured Product</p>
                    <p className="text-red-400 font-bold">$19.99</p>
                  </div>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 h-8 rounded-full">
                    Buy
                  </Button>
                </div>
              </div>

              <div className="absolute bottom-16 right-3 flex flex-col items-center space-y-6 pointer-events-auto">
                <button onClick={toggleMute} className="flex flex-col items-center">
                  <div className="rounded-full bg-black/30 p-2">
                    {isMuted ? (
                      <VolumeX className="h-6 w-6 text-white" />
                    ) : (
                      <Volume2 className="h-6 w-6 text-white" />
                    )}
                  </div>
                </button>
                <button className="flex flex-col items-center">
                  <div className="rounded-full bg-black/30 p-2">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs mt-1">{formatViews(video.likes)}</span>
                </button>
                <button className="flex flex-col items-center">
                  <div className="rounded-full bg-black/30 p-2">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs mt-1">0</span>
                </button>
                <button className="flex flex-col items-center">
                  <div className="rounded-full bg-black/30 p-2">
                    <Share className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs mt-1">Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}