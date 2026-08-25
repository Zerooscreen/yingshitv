import React, { useState } from 'react';
import { Sparkles, Film, ChevronRight, AlertCircle } from 'lucide-react';
import { VideoItem } from '../types';
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  videos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
  isFavorited: (videoId: string) => boolean;
  onToggleFavorite: (video: VideoItem) => void;
  showAll?: boolean;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  title,
  subtitle,
  icon,
  videos,
  onPlayVideo,
  isFavorited,
  onToggleFavorite,
  showAll = false,
}) => {
  const [displayCount, setDisplayCount] = useState(showAll ? 24 : 12);

  const displayedVideos = videos.slice(0, displayCount);
  const hasMore = videos.length > displayCount;

  return (
    <section id={`video-grid-${title}`} className="space-y-4 mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
              {icon}
            </div>
          ) : (
            <div className="w-2 h-6 bg-red-600 rounded-full" />
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
              {title}
              {videos.length > 0 && (
                <span className="text-xs font-normal text-zinc-400">({videos.length})</span>
              )}
            </h2>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* View Count or Extra Info */}
        <span className="text-xs text-zinc-400 hidden sm:inline-block">
          高清片源 · 實時更新
        </span>
      </div>

      {/* Grid Container */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {displayedVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={onPlayVideo}
              isFavorited={isFavorited(video.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#14100e] border border-[#27201c] rounded-2xl p-10 text-center space-y-3 my-6">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-zinc-300 font-semibold">未找到符合條件的影視作品</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            請嘗試切換其他分類、年份或關鍵字進行篩選。
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            id={`load-more-${title}`}
            onClick={() => setDisplayCount((prev) => prev + 12)}
            className="inline-flex items-center gap-2 bg-[#181310] hover:bg-red-600/20 text-zinc-300 hover:text-red-400 border border-[#2a221c] hover:border-red-500/40 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
          >
            <span>加載更多影片</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
