import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Flame, 
  Calendar, 
  Globe, 
  ArrowUpDown, 
  Check, 
  Sparkles,
  Tag
} from 'lucide-react';
import { GENRE_LIST, YEAR_LIST, REGION_LIST } from '../data/mockVideos';

interface QuickFilterProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  selectedSort: 'hot' | 'latest' | 'rating';
  onSelectSort: (sort: 'hot' | 'latest' | 'rating') => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  selectedGenre,
  onSelectGenre,
  selectedYear,
  onSelectYear,
  selectedRegion,
  onSelectRegion,
  selectedSort,
  onSelectSort,
  onResetFilters,
  totalFilteredCount,
}) => {
  const isFiltered = selectedGenre !== '全部類型' || selectedYear !== '全部年份' || selectedRegion !== '全部地區' || selectedSort !== 'hot';

  return (
    <section 
      id="quick-filter-section" 
      className="bg-[#130f0d] border border-[#27201c] rounded-2xl p-4 sm:p-5 shadow-xl mb-8"
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#251e1a]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <Filter className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">
            影視快篩導航 <span className="text-xs font-normal text-zinc-400">(共找到 <strong className="text-red-400 font-bold">{totalFilteredCount}</strong> 部作品)</span>
          </h2>
        </div>

        {/* Sort & Reset Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1b1613] p-1 rounded-xl border border-[#2f2620]">
            <button
              id="sort-btn-hot"
              onClick={() => onSelectSort('hot')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedSort === 'hot' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              熱門推薦
            </button>
            <button
              id="sort-btn-latest"
              onClick={() => onSelectSort('latest')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedSort === 'latest' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              最新上映
            </button>
            <button
              id="sort-btn-rating"
              onClick={() => onSelectSort('rating')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedSort === 'rating' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              評分最高
            </button>
          </div>

          {isFiltered && (
            <button
              id="reset-filters-btn"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 px-2.5 py-1.5 rounded-lg bg-[#1a1412] hover:bg-[#251d18] border border-[#2a221c] transition-colors"
              title="重置所有條件"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 1: 類型入口 (Genres) */}
      <div className="flex items-start gap-3 py-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 shrink-0 mt-1 min-w-[70px]">
          <Tag className="w-3.5 h-3.5 text-red-500" />
          <span>類型入口：</span>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {GENRE_LIST.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                id={`filter-genre-${genre}`}
                onClick={() => onSelectGenre(genre)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50 font-bold border border-red-400/40 scale-105'
                    : 'bg-[#1a1411] text-zinc-300 hover:bg-[#28201a] hover:text-white border border-[#29211b]'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: 年份入口 (Years) */}
      <div className="flex items-start gap-3 py-1.5 mt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 shrink-0 mt-1 min-w-[70px]">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>年份入口：</span>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {YEAR_LIST.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                id={`filter-year-${year}`}
                onClick={() => onSelectYear(year)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50 font-bold border border-red-400/40 scale-105'
                    : 'bg-[#1a1411] text-zinc-300 hover:bg-[#28201a] hover:text-white border border-[#29211b]'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: 地區入口 (Regions) */}
      <div className="flex items-start gap-3 py-1.5 mt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 shrink-0 mt-1 min-w-[70px]">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>地區入口：</span>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {REGION_LIST.map((reg) => {
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                id={`filter-region-${reg}`}
                onClick={() => onSelectRegion(reg)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50 font-bold border border-red-400/40 scale-105'
                    : 'bg-[#1a1411] text-zinc-300 hover:bg-[#28201a] hover:text-white border border-[#29211b]'
                }`}
              >
                {reg}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
