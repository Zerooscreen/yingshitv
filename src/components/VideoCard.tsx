import React from 'react';
import { Play, Star, Bookmark, Check, Flame, Film, Tv } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  isFavorited = false,
  onToggleFavorite,
}) => {
  return (
    <div
      id={`video-card-${video.id}`}
      className="group relative flex flex-col rounded-xl bg-[#14100e] border border-[#261f1a] hover:border-red-600/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/40 hover:-translate-y-1.5"
    >
      {/* Poster Image Container */}
      <div 
        onClick={() => onPlay(video)}
        className="relative aspect-[2/3] w-full overflow-hidden bg-[#1f1915] cursor-pointer"
      >
        <img
          src={video.posterUrl}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          {/* Quality / Language Badge */}
          <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded shadow-md border border-red-400/30 tracking-tight">
            {video.quality}
          </span>

          {/* Star Rating Badge */}
          <div className="bg-[#120e0c]/90 backdrop-blur-md border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300 font-['Outfit']">
              {video.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Bottom Episode / Status Label Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0d0b0a] via-[#0d0b0a]/70 to-transparent p-2.5 pt-6 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-medium text-red-300 bg-[#2b1816]/80 border border-red-500/20 px-2 py-0.5 rounded-full truncate max-w-[80%]">
            {video.statusLabel}
          </span>
          {video.isHot && (
            <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-semibold shrink-0">
              <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
              {video.views}
            </span>
          )}
        </div>

        {/* Hover Center Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-900/60 transform scale-75 group-hover:scale-100 transition-transform duration-300 border border-red-400/40">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Quick Favorite Button */}
        {onToggleFavorite && (
          <button
            id={`card-fav-btn-${video.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(video);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-lg z-30 transition-all duration-200 ${
              isFavorited
                ? 'bg-red-600 text-white opacity-100'
                : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-red-600 opacity-0 group-hover:opacity-100'
            }`}
            title={isFavorited ? '取消收藏' : '加入收藏'}
          >
            {isFavorited ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Info Body */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-1.5 bg-[#14100e]">
        <div>
          <h3 
            onClick={() => onPlay(video)}
            className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
            title={video.title}
          >
            {video.title}
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-['Outfit']">
            <span>{video.year}</span>
            <span className="text-zinc-600">•</span>
            <span className="font-['Noto_Sans_TC']">{video.region}</span>
            <span className="text-zinc-600">•</span>
            <span className="font-['Noto_Sans_TC'] text-zinc-400 truncate max-w-[90px]">
              {video.genres[0]}
            </span>
          </div>
        </div>

        {/* Cast Preview */}
        <p className="text-[11px] text-zinc-400 truncate">
          主演：{video.cast.join(' / ')}
        </p>
      </div>
    </div>
  );
};
