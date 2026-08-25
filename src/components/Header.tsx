import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Film, 
  Tv, 
  Sparkles, 
  Flame, 
  Clock, 
  Bookmark, 
  User, 
  Menu, 
  X, 
  Layers, 
  Video, 
  MessageSquareText, 
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  History
} from 'lucide-react';
import { MainNavTab, VideoItem } from '../types';
import { MOCK_VIDEOS } from '../data/mockVideos';

interface HeaderProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectVideo: (video: VideoItem) => void;
  favoritesCount: number;
  historyCount: number;
  onOpenHistoryFavorites: (tab: 'favorites' | 'history') => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSelectVideo,
  favoritesCount,
  historyCount,
  onOpenHistoryFavorites,
  onOpenAuthModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: MainNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '首頁', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'hot', label: '熱播', icon: <Flame className="w-4 h-4 text-red-500" /> },
    { id: 'latest', label: '最新', icon: <Clock className="w-4 h-4" /> },
    { id: 'movie', label: '電影', icon: <Film className="w-4 h-4" /> },
    { id: 'drama', label: '電視劇', icon: <Tv className="w-4 h-4" /> },
    { id: 'reviews', label: '影評', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'shorts', label: '短視頻', icon: <Video className="w-4 h-4" /> },
    { id: 'topics', label: '專題', icon: <Layers className="w-4 h-4" /> },
  ];

  const hotSearchKeywords = ['九龍城寨', '正港分局', '沙丘2', '不夠善良的我們', '咒術迴戰', '繁花', '死侍與金鋼狼'];

  const searchResults = searchQuery.trim()
    ? MOCK_VIDEOS.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.originalTitle && v.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0d0b0a]/95 backdrop-blur-md border-b border-[#27201c] shadow-2xl py-2.5' 
          : 'bg-gradient-to-b from-[#0d0b0a]/90 via-[#0d0b0a]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-8 shrink-0">
          <button 
            id="logo-brand-btn"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform duration-200 border border-red-500/30">
              映
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                  映視<span className="text-red-500">TV</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 hidden sm:inline-block">
                  4K 港台
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-wider hidden sm:block">YingShi.tv · 高清線上影視</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-red-600/15 text-red-400 border border-red-500/30 shadow-sm' 
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search Bar & User Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
          
          {/* Search Box with Autocomplete */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="搜尋影視、演員、導演..."
                className="w-full bg-[#171310] text-zinc-100 placeholder-zinc-500 text-sm pl-9 pr-8 py-2 rounded-full border border-[#2f2722] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-200"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Popover */}
            {searchFocused && (
              <div 
                id="search-popover"
                className="absolute left-0 right-0 top-full mt-2 bg-[#171310] border border-[#2f2722] rounded-2xl p-3 shadow-2xl z-50 backdrop-blur-xl"
              >
                {searchQuery.trim() ? (
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 mb-2 px-1 flex items-center justify-between">
                      <span>搜尋結果</span>
                      <span className="text-red-400">{searchResults.length} 部相關影片</span>
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="space-y-1.5">
                        {searchResults.map((item) => (
                          <div
                            key={item.id}
                            id={`search-result-${item.id}`}
                            onClick={() => {
                              onSelectVideo(item);
                              setSearchFocused(false);
                            }}
                            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-zinc-800/80 cursor-pointer transition-colors"
                          >
                            <img 
                              src={item.posterUrl} 
                              alt={item.title} 
                              className="w-10 h-14 object-cover rounded-lg shrink-0 border border-zinc-800"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-white truncate">{item.title}</p>
                              <p className="text-xs text-zinc-400 truncate">
                                {item.year} · {item.region} · {item.genres.slice(0, 2).join('/')}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-amber-400 font-bold">⭐ {item.rating}</span>
                                <span className="text-[10px] text-zinc-400 px-1 py-0.2 rounded bg-zinc-800">{item.quality}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 py-3 text-center">查無相關影視，請嘗試其他關鍵字</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 mb-2 px-1">
                      <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                      <span>台港熱搜排行榜</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hotSearchKeywords.map((kw, idx) => (
                        <button
                          key={kw}
                          id={`hot-kw-${idx}`}
                          onClick={() => {
                            onSearchChange(kw);
                          }}
                          className="text-xs bg-[#241e1a] hover:bg-red-600/20 hover:text-red-400 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <span className={`text-[10px] font-bold ${idx < 3 ? 'text-red-400' : 'text-zinc-400'}`}>
                            0{idx + 1}
                          </span>
                          <span>{kw}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Watch History & Favorites Drawer Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              id="header-history-btn"
              onClick={() => onOpenHistoryFavorites('history')}
              className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
              title="觀看歷史"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>

            <button
              id="header-favorites-btn"
              onClick={() => onOpenHistoryFavorites('favorites')}
              className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
              title="我的收藏"
            >
              <Bookmark className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-red-600 text-white rounded-full px-1.5 py-0.2 min-w-[16px] text-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          {/* Login / VIP Button */}
          <button
            id="header-login-btn"
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full shadow-lg shadow-red-950/50 hover:shadow-red-800/30 transition-all duration-200 shrink-0 border border-red-400/20"
          >
            <User className="w-3.5 h-3.5" />
            <span>登錄</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/60 lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu-drawer"
          className="lg:hidden bg-[#120f0e] border-b border-[#27201c] px-4 pt-3 pb-5 mt-2 space-y-3"
        >
          <div className="grid grid-cols-4 gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium gap-1.5 transition-colors ${
                    isActive 
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
                      : 'text-zinc-300 bg-[#1b1613] hover:bg-zinc-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-[#27201c] text-xs text-zinc-400">
            <button
              onClick={() => {
                onOpenHistoryFavorites('history');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-zinc-800 text-zinc-300"
            >
              <History className="w-3.5 h-3.5" />
              <span>觀看歷史 ({historyCount})</span>
            </button>
            <button
              onClick={() => {
                onOpenHistoryFavorites('favorites');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-zinc-800 text-zinc-300"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>我的收藏 ({favoritesCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
