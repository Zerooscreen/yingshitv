import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Film, 
  Tv, 
  Sparkles, 
  Flame, 
  Clock, 
  Bookmark, 
  Play, 
  Star, 
  X, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Radio, 
  Tv2, 
  Maximize, 
  Volume2, 
  AlertCircle,
  HelpCircle,
  Layers,
  History,
  Trash2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { QuickFilter } from './components/QuickFilter';
import { VideoGrid } from './components/VideoGrid';
import { RankingsSection } from './components/RankingsSection';
import { VideoCard } from './components/VideoCard';
import { 
  MOCK_VIDEOS, 
  SAMPLE_VIDEO_URL, 
  SAMPLE_TRAILER_URL, 
  SAMPLE_ACTION_URL 
} from './data/mockVideos';
import { 
  getTmdbTrending, 
  getTmdbPopularMovies, 
  getTmdbPopularTvShows, 
  getTmdbNowPlaying, 
  searchTmdb 
} from './services/tmdbApi';
import { MovieDetailPage } from './components/MovieDetailPage';
import { 
  getSeoMetadata, 
  applySeoMetadataToDom, 
  createMovieSlug, 
  parseIdFromSlug 
} from './utils/seo';
import { VideoItem, MainNavTab, ReviewItem, ShortClipItem, TopicCollection, FaqItem } from './types';

// ==========================================
// KOMPONEN ADSTERRA GLOBAL & BANNER
// ==========================================

// Komponen untuk memuat Popunder & Social Bar secara aman di React
function AdsterraGlobalScripts() {
  useEffect(() => {
    // Popunder Script
    const popunder = document.createElement('script');
    popunder.src = 'https://pl30557735.effectivecpmnetwork.com/51/65/ed/5165ed7649b06fc95e9d3bbc1839dcd9.js';
    popunder.async = true;
    document.body.appendChild(popunder);

    // Social Bar Script
    const socialBar = document.createElement('script');
    socialBar.src = 'https://pl30557736.effectivecpmnetwork.com/af/c1/6d/afc16d8a70f1f493abf2098939fca8f7.js';
    socialBar.async = true;
    document.body.appendChild(socialBar);

    return () => {
      // Cleanup jika komponen unmount
      try {
        if (popunder.parentNode) popunder.parentNode.removeChild(popunder);
        if (socialBar.parentNode) socialBar.parentNode.removeChild(socialBar);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return null;
}

// Komponen Native Banner
function AdsterraNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (!containerRef.current) return;
    loaded.current = true;

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl30557737.effectivecpmnetwork.com/6f7b03feb080b4884047d6210ed8268e/invoke.js';
      
      containerRef.current.appendChild(script);
    } catch (e) {
      console.error('Native banner load error:', e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6 overflow-hidden">
      <div 
        ref={containerRef} 
        id="container-6f7b03feb080b4884047d6210ed8268e" 
        className="min-h-[100px] flex justify-center items-center bg-[#130f0d] border border-[#27201c] rounded-xl p-2 w-full max-w-4xl" 
      />
    </div>
  );
}

// Komponen Banner Iframe (Mendukung berbagai ukuran: 728x90, 320x50, 468x60, 160x600)
interface AdsterraIframeBannerProps {
  size: '728x90' | '320x50' | '468x60' | '160x600';
}

function AdsterraIframeBanner({ size }: AdsterraIframeBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  // Konfigurasi Key berdasarkan ukuran
  const configs = {
    '728x90': { key: '9eab15e2d0d97de74e3ee971fe615a5e', width: 728, height: 90 },
    '320x50': { key: '374f3cbadfdea331b749dcfc79f79f2c', width: 320, height: 50 },
    '468x60': { key: 'b4c5edd71dd22f2f3a51a8206816e9ac', width: 468, height: 60 },
    '160x600': { key: '25247fde261d8f76e06b91b9d74945f4', width: 160, height: 600 }
  };

  const currentConfig = configs[size];

  useEffect(() => {
    if (scriptLoaded.current) return;
    if (!bannerRef.current) return;
    scriptLoaded.current = true;

    try {
      const atOptions = {
        'key': currentConfig.key,
        'format': 'iframe',
        'height': currentConfig.height,
        'width': currentConfig.width,
        'params': {}
      };

      const confScript = document.createElement('script');
      confScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${currentConfig.key}/invoke.js`;

      bannerRef.current.innerHTML = '';
      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(invokeScript);
    } catch (e) {
      console.error(`Banner ${size} load error:`, e);
    }
  }, [size, currentConfig]);

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden">
      <div 
        ref={bannerRef} 
        style={{ minWidth: currentConfig.width, minHeight: currentConfig.height }}
        className="flex justify-center items-center bg-[#130f0d] border border-[#27201c] rounded-xl p-2" 
      />
    </div>
  );
}

// Mock reviews data
const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    videoId: 'ys-001',
    movieTitle: '九龍城寨之圍城',
    moviePoster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    movieYear: 2025,
    author: '光影捕手阿澤',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    isVerifiedCritic: true,
    rating: 9.5,
    title: '香港硬派動作片的巔峰回歸！港漫風格與工業美學的極致碰撞',
    content: '《九龍城寨之圍城》不僅僅是一部爽快的動作打鬥片，更是導演鄭保瑞對八九十年代香港黃金時代電影的深情輓歌。谷垣健治設計的武打兼具漫畫誇張感與拳拳到肉的打擊實感，美術置景的九龍城寨逼真重現了那座魔幻混沌之城的窒息與溫情。古天樂的「龍捲風」沉穩大氣，林峯等人組成的城寨四子熱血激昂。必看粵語原聲，聲效與節奏無懈可擊！',
    likes: 1248,
    commentsCount: 86,
    date: '2025-05-12'
  },
  {
    id: 'rev-2',
    videoId: 'ys-005',
    movieTitle: '破·地獄',
    moviePoster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    movieYear: 2024,
    author: '香港文藝觀影會',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    isVerifiedCritic: true,
    rating: 9.4,
    title: '生死渡人，超度的是死者，也是生者的執念與救贖',
    content: '黃子華與許冠文兩代喜劇大師在嚴肅殯葬題材中的精彩對壘。喃嘸師傅與婚禮策劃師的碰撞，將傳統殯葬儀式「破地獄」轉化為對現代家庭創傷、性別偏見與生死觀的深刻剖析。結尾的破地獄儀式不僅視覺震撼，更讓人熱淚盈眶。這是一部能洗滌心靈的香港人文佳作。',
    likes: 986,
    commentsCount: 54,
    date: '2024-11-20'
  }
];

// Mock shorts
const MOCK_SHORTS: ShortClipItem[] = [
  {
    id: 's-1',
    title: '【九龍城寨】王九硬氣功單挑城寨四子！燃炸決戰高光剪輯',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    videoUrl: SAMPLE_ACTION_URL,
    duration: '01:45',
    views: '128萬',
    likes: 89000,
    category: '高光名場面',
    relatedMovieTitle: '九龍城寨之圍城'
  },
  {
    id: 's-2',
    title: '【破·地獄】黃子華超催淚告別致辭！生死皆是人生修行',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    videoUrl: SAMPLE_TRAILER_URL,
    duration: '02:10',
    views: '96萬',
    likes: 64000,
    category: '走心催淚',
    relatedMovieTitle: '破·地獄'
  }
];

// Mock curated topics
const MOCK_TOPICS: TopicCollection[] = [
  {
    id: 'topic-1',
    title: '港影不死 · 香港硬派動作與經典犯罪片盤點',
    subtitle: '拳拳到肉的武行精神，熱血沸騰的江湖義氣',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    itemCount: 16,
    badge: '熱門精選',
    tags: ['九龍城寨', '警匪對決', '粵語原聲', '4K修復'],
    videoIds: ['ys-001', 'ys-005', 'ys-009']
  }
];

// Mock FAQs
const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: '播放與畫質',
    question: '如何切換 4K 藍光畫質與粵語/國語多音軌？',
    answer: '在影片播放器介面下方點擊「播放線路」可切換不同的 CDN 專線（如港台專線1、藍光專線2）。若影片支持雙語，可在播放器控制欄中點擊「音軌」選擇粵語原聲或國語配音。'
  }
];

export default function App() {
  // Navigation & Filter State
  const [currentTab, setCurrentTab] = useState<MainNavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('全部類型');
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedYear, setSelectedYear] = useState('全部年份');
  const [selectedRegion, setSelectedRegion] = useState('全部地區');
  const [selectedSort, setSelectedSort] = useState<'hot' | 'latest' | 'rating'>('hot');

  // Video State with TMDB Live API integration
  const [videoList, setVideoList] = useState<VideoItem[]>(MOCK_VIDEOS);
  const [isTmdbLoaded, setIsTmdbLoaded] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);

  // Video Player / Detail View State
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Dynamic SEO & Meta Tags Sync
  useEffect(() => {
    const meta = getSeoMetadata(activeVideo, currentTab, selectedGenre, selectedActor);
    applySeoMetadataToDom(meta);
  }, [activeVideo, currentTab, selectedGenre, selectedActor]);

  // Synchronize Browser URL for SEO-friendly Slug
  const updateBrowserUrl = (
    video: VideoItem | null, 
    tab: MainNavTab, 
    genre: string, 
    actor: string
  ) => {
    try {
      if (video) {
        const path = `/${video.category === 'drama' ? 'drama' : 'movie'}/${createMovieSlug(video)}`;
        window.history.pushState({ videoId: video.id }, '', path);
      } else if (actor) {
        window.history.pushState({ actor }, '', `/actor/${encodeURIComponent(actor)}`);
      } else if (genre && genre !== '全部類型') {
        window.history.pushState({ genre }, '', `/genre/${encodeURIComponent(genre)}`);
      } else if (tab !== 'home') {
        window.history.pushState({ tab }, '', `/${tab}`);
      } else {
        window.history.pushState({ home: true }, '', '/');
      }
    } catch (e) {
      // ignore
    }
  };

  // Popstate listener for back/forward browser button navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/movie/') || path.startsWith('/drama/')) {
        const slug = path.split('/')[2];
        if (slug) {
          const id = parseIdFromSlug(slug);
          const found = videoList.find(v => v.id === id);
          if (found) setActiveVideo(found);
        }
      } else {
        setActiveVideo(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [videoList]);

  // Load live TMDB Data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadLiveTmdbData() {
      try {
        const [trending, popMovies, popDramas] = await Promise.all([
          getTmdbTrending(),
          getTmdbPopularMovies(1),
          getTmdbPopularTvShows(1)
        ]);

        if (isMounted && (trending.length > 0 || popMovies.length > 0 || popDramas.length > 0)) {
          const combined = [...MOCK_VIDEOS];
          const existingIds = new Set(combined.map(v => v.id));
          
          [...trending, ...popMovies, ...popDramas].forEach(item => {
            if (!existingIds.has(item.id)) {
              existingIds.add(item.id);
              combined.push(item);
            }
          });

          setVideoList(combined);
          setIsTmdbLoaded(true);
        }
      } catch (e) {
        console.warn('TMDB API init warning:', e);
      }
    }

    loadLiveTmdbData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle live TMDB search on user query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchingApi(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const liveResults = await searchTmdb(searchQuery.trim());
        setSearchResults(liveResults);
      } catch (err) {
        console.error('TMDB Search error:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Favorites & Watch History State
  const [favorites, setFavorites] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('yingshi_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<{ video: VideoItem; watchedAt: string; episode: number }[]>(() => {
    try {
      const saved = localStorage.getItem('yingshi_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [drawerOpen, setDrawerOpen] = useState<'none' | 'favorites' | 'history'>('none');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedShort, setSelectedShort] = useState<ShortClipItem | null>(null);

  // Persist Favorites & History
  useEffect(() => {
    try {
      localStorage.setItem('yingshi_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('yingshi_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  const isFavorited = (videoId: string) => {
    return favorites.some(v => v.id === videoId);
  };

  const toggleFavorite = (video: VideoItem) => {
    setFavorites(prev => {
      if (prev.some(v => v.id === video.id)) {
        return prev.filter(v => v.id !== video.id);
      } else {
        return [video, ...prev];
      }
    });
  };

  const handlePlayVideo = (video: VideoItem, episode = 1) => {
    setActiveVideo(video);
    updateBrowserUrl(video, currentTab, selectedGenre, selectedActor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHistory(prev => {
      const filtered = prev.filter(h => h.video.id !== video.id);
      return [{ video, watchedAt: '剛才', episode }, ...filtered].slice(0, 50);
    });
  };

  const filteredVideos = useMemo(() => {
    const baseSource = searchQuery.trim() && searchResults.length > 0 
      ? [...searchResults, ...videoList.filter(v => !searchResults.some(sr => sr.id === v.id))]
      : videoList;

    return baseSource.filter(video => {
      if (selectedActor) {
        const matchActor = video.cast.some(c => c.toLowerCase().includes(selectedActor.toLowerCase())) || 
                         video.director.toLowerCase().includes(selectedActor.toLowerCase());
        if (!matchActor) return false;
      }

      if (currentTab === 'movie' && video.category !== 'movie') return false;
      if (currentTab === 'drama' && video.category !== 'drama') return false;
      if (currentTab === 'hot' && !video.isHot) return false;
      if (currentTab === 'latest' && !video.isNew) return false;

      if (selectedGenre !== '全部類型' && !video.genres.includes(selectedGenre)) {
        return false;
      }

      if (selectedYear !== '全部年份') {
        if (selectedYear === '2026專題' && video.year !== 2026) return false;
        if (selectedYear === '2025專題' && video.year !== 2025) return false;
        if (selectedYear === '2024專題' && video.year !== 2024) return false;
        if (selectedYear === '2023專題' && video.year !== 2023) return false;
        if (selectedYear === '2022-2020' && (video.year > 2022 || video.year < 2020)) return false;
        if (selectedYear === '更早年代' && video.year >= 2020) return false;
      }

      if (selectedRegion !== '全部地區' && video.region !== selectedRegion) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = video.title.toLowerCase().includes(q);
        const matchOrig = video.originalTitle?.toLowerCase().includes(q);
        const matchCast = video.cast.some(c => c.toLowerCase().includes(q));
        const matchDirector = video.director.toLowerCase().includes(q);
        const matchGenre = video.genres.some(g => g.toLowerCase().includes(q));
        if (!matchTitle && !matchOrig && !matchCast && !matchDirector && !matchGenre) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'latest') return b.year - a.year;
      if (selectedSort === 'rating') return b.rating - a.rating;
      return (b.ranking?.overall || 0) - (a.ranking?.overall || 0);
    });
  }, [currentTab, selectedGenre, selectedActor, selectedYear, selectedRegion, selectedSort, searchQuery, videoList, searchResults]);

  const featuredVideos = useMemo(() => {
    return videoList.filter(v => v.isFeatured || v.isHot).slice(0, 6);
  }, [videoList]);

  const hotMovies = useMemo(() => {
    return videoList.filter(v => v.category === 'movie');
  }, [videoList]);

  const hotDramas = useMemo(() => {
    return videoList.filter(v => v.category === 'drama');
  }, [videoList]);

  const resetFilters = () => {
    setSelectedGenre('全部類型');
    setSelectedActor('');
    setSelectedYear('全部年份');
    setSelectedRegion('全部地區');
    setSelectedSort('hot');
    setSearchQuery('');
    updateBrowserUrl(null, currentTab, '全部類型', '');
  };

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-zinc-100 selection:bg-red-600 selection:text-white flex flex-col font-sans">
      
      {/* Memuat Pop-under & Social Bar secara Global di Background */}
      <AdsterraGlobalScripts />

      {/* Header & Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectVideo={handlePlayVideo}
        favoritesCount={favorites.length}
        historyCount={history.length}
        onOpenHistoryFavorites={(tab) => setDrawerOpen(tab)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-16 space-y-8">
        
        {/* Banner Ikan atas (Contoh ukuran 728x90 / Responsif) */}
        <AdsterraIframeBanner size="728x90" />

        {/* Detail View / Player */}
        {activeVideo ? (
          <MovieDetailPage
            video={activeVideo}
            allVideos={videoList}
            onBack={() => {
              setActiveVideo(null);
              updateBrowserUrl(null, currentTab, selectedGenre, selectedActor);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectVideo={handlePlayVideo}
            isFavorited={isFavorited(activeVideo.id)}
            onToggleFavorite={toggleFavorite}
            onSelectGenre={(genre) => {
              setActiveVideo(null);
              setSelectedActor('');
              setSelectedGenre(genre);
              updateBrowserUrl(null, currentTab, genre, '');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectActor={(actor) => {
              setActiveVideo(null);
              setSelectedActor(actor);
              setSelectedGenre('全部類型');
              updateBrowserUrl(null, currentTab, '全部類型', actor);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : selectedActor ? (
          <div className="pt-4 space-y-6">
            <div className="flex items-center justify-between border-b border-[#251e1a] pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>影人專題：</span>
                  <span className="text-red-400 font-black">{selectedActor}</span>
                  <span className="text-sm font-normal text-zinc-400">主演及參演作品全集</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  共收錄 <strong className="text-white font-bold">{filteredVideos.length}</strong> 部由 {selectedActor} 參演的高清電影與熱播電視劇
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedActor('');
                  updateBrowserUrl(null, currentTab, selectedGenre, '');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#1a1411] border border-[#302520] hover:border-red-500/50 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                返回全部影視
              </button>
            </div>

            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {filteredVideos.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={handlePlayVideo}
                    isFavorited={isFavorited(video.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 bg-[#130f0d] border border-[#27201c] rounded-2xl">
                <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-base text-zinc-300 font-medium">未找到 {selectedActor} 的相關影視作品</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  重置篩選
                </button>
              </div>
            )}
          </div>
        ) : searchQuery.trim() !== '' ? (
          <div className="pt-4 space-y-6">
            <div className="flex items-center justify-between border-b border-[#251e1a] pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>搜尋結果：</span>
                  <span className="text-red-400 font-black">"{searchQuery}"</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  找到 <strong className="text-white font-bold">{filteredVideos.length}</strong> 個符合的影片與劇集
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-lg bg-[#1a1411] border border-[#302520] hover:border-red-500/50 text-xs text-zinc-300 transition-colors"
              >
                清除搜尋
              </button>
            </div>

            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {filteredVideos.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={handlePlayVideo}
                    isFavorited={isFavorited(video.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 bg-[#130f0d] border border-[#27201c] rounded-2xl">
                <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-base text-zinc-300 font-medium">未找到與 "{searchQuery}" 相關的影片</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  重置全部篩選
                </button>
              </div>
            )}
          </div>
        ) : currentTab === 'home' ? (
          <>
            {/* Carousel Banner */}
            <HeroBanner
              featuredVideos={featuredVideos}
              onPlayVideo={handlePlayVideo}
              isFavorited={isFavorited}
              onToggleFavorite={toggleFavorite}
            />

            {/* Quick Filter Bar */}
            <QuickFilter
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              onResetFilters={resetFilters}
              totalFilteredCount={filteredVideos.length}
            />

            {/* Main Content Layout with Density Rank Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Video Grids */}
              <div className="lg:col-span-8 space-y-10">
                <VideoGrid
                  title="熱門上映 · 院線同步"
                  subtitle="全網評分 9.0+ 高清首播大片"
                  icon={<Flame className="w-4 h-4" />}
                  videos={hotMovies}
                  onPlayVideo={handlePlayVideo}
                  isFavorited={isFavorited}
                  onToggleFavorite={toggleFavorite}
                />

                {/* Sisipan Native Banner Adsterra */}
                <AdsterraNativeBanner />

                <VideoGrid
                  title="華語與日韓劇集精選"
                  subtitle="同步跟播中 · 每日更新"
                  icon={<Tv className="w-4 h-4" />}
                  videos={hotDramas}
                  onPlayVideo={handlePlayVideo}
                  isFavorited={isFavorited}
                  onToggleFavorite={toggleFavorite}
                />
              </div>

              {/* Right Column: Rankings & Banner 160x600 */}
              <div className="lg:col-span-4 space-y-6">
                <RankingsSection
                  videos={videoList}
                  onPlayVideo={handlePlayVideo}
                />

                {/* Banner 160x600 Sidebar */}
                <div className="hidden lg:flex justify-center">
                  <AdsterraIframeBanner size="160x600" />
                </div>

                {/* Broadcast CDN & TMDB API Status */}
                <div className="space-y-2">
                  <div className="bg-[#110e0c] border border-[#231b17] rounded-xl p-3 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>CDN 4K 60FPS 節點：良好</span>
                    </div>
                    <span className="text-zinc-500 text-[10px]">延遲 18ms</span>
                  </div>

                  <div className="bg-[#110e0c] border border-[#231b17] rounded-xl p-3 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>TMDB 數據源：{isTmdbLoaded ? '已連線 (即時同步)' : '連線中...'}</span>
                    </div>
                    <span className="text-blue-400/80 text-[10px] font-mono font-bold">LIVE API</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Banner Bawah (Contoh ukuran 320x50 untuk Mobile & Desktop) */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <AdsterraIframeBanner size="320x50" />
          <AdsterraIframeBanner size="468x60" />
        </div>

      </main>
    </div>
  );
}
