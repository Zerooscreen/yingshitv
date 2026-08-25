import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  TrendingUp, 
  Play, 
  Star, 
  ChevronRight,
  Film,
  Tv,
  Sparkles
} from 'lucide-react';
import { VideoItem } from '../types';

interface RankingsSectionProps {
  videos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
}

export const RankingsSection: React.FC<RankingsSectionProps> = ({
  videos,
  onPlayVideo,
}) => {
  const [rankingTab, setRankingTab] = useState<'overall' | 'movie' | 'drama' | 'anime'>('overall');

  const filteredRankings = videos
    .filter((v) => {
      if (rankingTab === 'movie') return v.category === 'movie';
      if (rankingTab === 'drama') return v.category === 'drama';
      if (rankingTab === 'anime') return v.category === 'anime';
      return true;
    })
    .sort((a, b) => (b.ranking?.overall || 99) - (a.ranking?.overall || 99))
    .slice(0, 10);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 text-black font-black text-xs flex items-center justify-center shadow-lg shadow-yellow-600/40">
          1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-400 text-black font-black text-xs flex items-center justify-center shadow-lg shadow-zinc-400/40">
          2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-amber-800/40">
          3
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-lg bg-[#201a16] text-zinc-400 font-bold text-xs flex items-center justify-center border border-[#2e2520]">
        {index + 1}
      </span>
    );
  };

  return (
    <section id="rankings-section" className="bg-[#130f0d] border border-[#27201c] rounded-2xl p-5 sm:p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#251e1a]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              熱播排行榜
              <span className="text-[11px] font-semibold text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded-full">
                HOT TOP 10
              </span>
            </h2>
            <p className="text-xs text-zinc-400">台港用戶實時點播熱度榜</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-[#1c1714] p-1 rounded-xl border border-[#2e2621]">
          <button
            id="rank-tab-overall"
            onClick={() => setRankingTab('overall')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              rankingTab === 'overall'
                ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            總榜
          </button>
          <button
            id="rank-tab-movie"
            onClick={() => setRankingTab('movie')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              rankingTab === 'movie'
                ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            電影
          </button>
          <button
            id="rank-tab-drama"
            onClick={() => setRankingTab('drama')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              rankingTab === 'drama'
                ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            電視劇
          </button>
          <button
            id="rank-tab-anime"
            onClick={() => setRankingTab('anime')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              rankingTab === 'anime'
                ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            動漫
          </button>
        </div>
      </div>

      {/* Rankings List (2 columns on lg screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
        {filteredRankings.map((item, idx) => (
          <div
            key={item.id}
            id={`rank-item-${item.id}`}
            onClick={() => onPlayVideo(item)}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-[#181310] hover:bg-[#231b16] border border-[#27201a] hover:border-red-600/40 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Rank Number Badge */}
              <div className="shrink-0">{getRankBadge(idx)}</div>

              {/* Poster Thumbnail */}
              <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-[#241c18] border border-[#302620]">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-zinc-100 group-hover:text-red-400 transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {item.year} · {item.region} · {item.genres.slice(0, 2).join('/')}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {item.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-red-400 bg-red-950/50 px-1.5 py-0.2 rounded border border-red-900/30">
                    {item.statusLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Hot Index */}
            <div className="text-right shrink-0 pl-2">
              <div className="flex items-center gap-1 text-xs font-semibold text-rose-400">
                <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{item.views}</span>
              </div>
              <span className="text-[10px] text-zinc-500">點播熱度</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
