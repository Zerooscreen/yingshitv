import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Info, 
  Volume2, 
  VolumeX, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Film,
  Sparkles,
  Flame
} from 'lucide-react';
import { VideoItem } from '../types';

interface HeroBannerProps {
  featuredVideos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
  isFavorited: (videoId: string) => boolean;
  onToggleFavorite: (video: VideoItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredVideos,
  onPlayVideo,
  isFavorited,
  onToggleFavorite,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide carousel
  useEffect(() => {
    if (isHovered || featuredVideos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredVideos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered, featuredVideos.length]);

  if (!featuredVideos.length) return null;

  const currentVideo = featuredVideos[currentIndex];
  const favorited = isFavorited(currentVideo.id);

  return (
    <section 
      id="hero-banner-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[520px] sm:h-[580px] lg:h-[660px] overflow-hidden bg-[#0d0b0a]"
    >
      {/* Background Backdrop with Cinema Gradient */}
      <div className="absolute inset-0">
        <img
          src={currentVideo.backdropUrl}
          alt={currentVideo.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out"
        />
        {/* Layered Vignette and Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-[#0d0b0a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b0a] via-[#0d0b0a]/80 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0d0b0a]/40 to-[#0d0b0a]" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg shadow-red-900/50">
              <Flame className="w-3.5 h-3.5 fill-current" />
              台港人氣熱播榜首
            </span>
            <span className="bg-[#2a221d]/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {currentVideo.rating} 卓越評分
            </span>
            <span className="bg-zinc-900/80 backdrop-blur-md text-zinc-300 border border-zinc-700/40 text-xs font-medium px-2.5 py-1 rounded-md">
              {currentVideo.quality}
            </span>
            <span className="bg-zinc-900/80 backdrop-blur-md text-zinc-300 border border-zinc-700/40 text-xs font-medium px-2.5 py-1 rounded-md">
              {currentVideo.statusLabel}
            </span>
          </div>

          {/* Title & Original Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {currentVideo.title}
            </h1>
            {currentVideo.originalTitle && (
              <p className="text-sm sm:text-base font-medium text-zinc-400 mt-1 font-['Outfit'] tracking-wide">
                {currentVideo.originalTitle}
              </p>
            )}
          </div>

          {/* Metadata Meta Chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300">
            <span className="text-red-400 font-semibold">{currentVideo.year} 年</span>
            <span className="text-zinc-600">•</span>
            <span>{currentVideo.region}</span>
            <span className="text-zinc-600">•</span>
            <span>{currentVideo.duration}</span>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1.5">
              {currentVideo.genres.map((g) => (
                <span key={g} className="bg-zinc-800/70 px-2 py-0.5 rounded text-xs text-zinc-300">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow">
            {currentVideo.synopsis}
          </p>

          {/* Cast Info */}
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="text-zinc-500">主演：</span>
            <span className="text-zinc-300 truncate max-w-md">{currentVideo.cast.join(' / ')}</span>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id={`hero-play-btn-${currentVideo.id}`}
              onClick={() => onPlayVideo(currentVideo)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-xl shadow-red-950/60 hover:shadow-red-800/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>立即播放</span>
            </button>

            <button
              id={`hero-fav-btn-${currentVideo.id}`}
              onClick={() => onToggleFavorite(currentVideo)}
              className={`flex items-center gap-2 text-sm sm:text-base font-semibold px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-200 ${
                favorited
                  ? 'bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30'
                  : 'bg-[#1e1916]/80 hover:bg-[#2c241f] border-[#382f28] text-zinc-200'
              }`}
            >
              {favorited ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{favorited ? '已加入片單' : '加入收藏'}</span>
            </button>

            <button
              id="hero-sound-toggle"
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-xl bg-[#1e1916]/80 hover:bg-[#2c241f] border border-[#382f28] text-zinc-300 hover:text-white backdrop-blur-md transition-colors hidden sm:flex"
              title={isMuted ? '開啟原聲預覽' : '靜音'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-red-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Indicators */}
      <div className="absolute right-4 sm:right-8 bottom-6 z-20 flex items-center gap-3">
        <button
          id="hero-carousel-prev"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length)}
          className="p-2 rounded-full bg-[#181310]/80 hover:bg-red-600/30 text-zinc-300 hover:text-white border border-[#2f2722] backdrop-blur-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {featuredVideos.map((_, idx) => (
            <button
              key={idx}
              id={`hero-dot-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? 'w-6 bg-red-600' 
                  : 'w-2 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>

        <button
          id="hero-carousel-next"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredVideos.length)}
          className="p-2 rounded-full bg-[#181310]/80 hover:bg-red-600/30 text-zinc-300 hover:text-white border border-[#2f2722] backdrop-blur-md transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
