import React, { useState, useMemo, useEffect } from 'react';
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
  },
  {
    id: 'rev-3',
    videoId: 'ys-003',
    movieTitle: '淚之女王',
    moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    movieYear: 2024,
    author: '追劇達人小晴',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    isVerifiedCritic: false,
    rating: 9.0,
    title: '金秀賢與金智媛的神仙演技！反套路豪門婚姻的酸甜苦辣',
    content: '朴智恩編劇再次證明了頂級愛情劇的魅力。將「入贅駙馬」與「財閥女王」的婚姻危機拍得既幽默又虐心，金秀賢醉酒哭戲封神，金智媛高冷外表下的脆弱演繹得淋漓盡致。配樂與服化道堪稱韓劇頂級天花板！',
    likes: 852,
    commentsCount: 42,
    date: '2024-04-18'
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
  },
  {
    id: 's-3',
    title: '【鬼滅之刃】無限城決戰前夕！柱指導篇熱血燃混剪',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    videoUrl: SAMPLE_VIDEO_URL,
    duration: '01:30',
    views: '210萬',
    likes: 154000,
    category: '熱血動漫',
    relatedMovieTitle: '鬼滅之刃 柱訓練篇'
  },
  {
    id: 's-4',
    title: '【繁花】寶總與汪小姐黃河路告別！王家衛鏡頭美學解析',
    coverUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    videoUrl: SAMPLE_TRAILER_URL,
    duration: '02:05',
    views: '145萬',
    likes: 92000,
    category: '名場面解析',
    relatedMovieTitle: '繁花'
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
  },
  {
    id: 'topic-2',
    title: '2025-2026 必看全球高分神劇榜',
    subtitle: '從懸疑燒腦到時代史詩，口碑炸裂不可錯過',
    bannerUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
    itemCount: 24,
    badge: '年度推薦',
    tags: ['繁花', '淚之女王', '三體', '黑道律師'],
    videoIds: ['ys-002', 'ys-003', 'ys-004']
  },
  {
    id: 'topic-3',
    title: '二次元狂歡 · 頂級作畫動漫劇場版特輯',
    subtitle: 'ufotable、MAPPA等名廠極致光影燃燒經費之作',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    itemCount: 18,
    badge: '高分動漫',
    tags: ['鬼滅之刃', '咒術迴戰', '進擊的巨人', '宮崎駿'],
    videoIds: ['ys-006', 'ys-010', 'ys-011']
  }
];

// Mock FAQs
const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: '播放與畫質',
    question: '如何切換 4K 藍光畫質與粵語/國語多音軌？',
    answer: '在影片播放器介面下方點擊「播放線路」可切換不同的 CDN 專線（如港台專線1、藍光專線2）。若影片支持雙語，可在播放器控制欄中點擊「音軌」選擇粵語原聲或國語配音。'
  },
  {
    id: 'faq-2',
    category: '投屏與設備',
    question: '支援電視 AirPlay 或 DLNA 投屏功能嗎？',
    answer: '完全支援！在全螢幕或播放介面中點擊右下角的「投屏 (AirPlay/Cast)」按鈕，並確保手機/電腦與智慧電視處於同一 Wi-Fi 網絡，即可將 4K 影片無損投放到電視大螢幕。'
  },
  {
    id: 'faq-3',
    category: '會員與免費',
    question: '映視TV 所有影片與電視劇都是免費觀看的嗎？',
    answer: '是的，映視TV 堅持為廣大影迷提供極速、高清、無廣告插播的在線觀看體驗。所有熱播電影、劇集、動漫與影評均完全開放免費觀賞。'
  },
  {
    id: 'faq-4',
    category: '緩存與離線',
    question: '播放時遇到卡頓或加載慢該如何處理？',
    answer: '建議您在播放介面嘗試切換到「藍光專線2」或「備用專線3」，系統將自動為您匹配離您最近的高速邊緣 CDN 節點。'
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

  // Dynamic SEO & Meta Tags Sync (Point 1 & Point 2)
  useEffect(() => {
    const meta = getSeoMetadata(activeVideo, currentTab, selectedGenre, selectedActor);
    applySeoMetadataToDom(meta);
  }, [activeVideo, currentTab, selectedGenre, selectedActor]);

  // Synchronize Browser URL for SEO-friendly Slug (Point 3)
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
      // In sandboxed iframes pushState might be limited, ignore gracefully
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
          // Combine and deduplicate
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

  // Favorites & Watch History State (Stored in localStorage)
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

  // Handle Favorite Toggle
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

  // Handle Play Video & Add to History
  const handlePlayVideo = (video: VideoItem, episode = 1) => {
    setActiveVideo(video);
    updateBrowserUrl(video, currentTab, selectedGenre, selectedActor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHistory(prev => {
      const filtered = prev.filter(h => h.video.id !== video.id);
      return [{ video, watchedAt: '剛才', episode }, ...filtered].slice(0, 50);
    });
  };

  // Filter Logic (combined with TMDB live results if searching)
  const filteredVideos = useMemo(() => {
    const baseSource = searchQuery.trim() && searchResults.length > 0 
      ? [...searchResults, ...videoList.filter(v => !searchResults.some(sr => sr.id === v.id))]
      : videoList;

    return baseSource.filter(video => {
      // Actor Deep-Link Match (Point 6)
      if (selectedActor) {
        const matchActor = video.cast.some(c => c.toLowerCase().includes(selectedActor.toLowerCase())) || 
                           video.director.toLowerCase().includes(selectedActor.toLowerCase());
        if (!matchActor) return false;
      }

      // Tab Category Match
      if (currentTab === 'movie' && video.category !== 'movie') return false;
      if (currentTab === 'drama' && video.category !== 'drama') return false;
      if (currentTab === 'hot' && !video.isHot) return false;
      if (currentTab === 'latest' && !video.isNew) return false;

      // Genre Match
      if (selectedGenre !== '全部類型' && !video.genres.includes(selectedGenre)) {
        return false;
      }

      // Year Match
      if (selectedYear !== '全部年份') {
        if (selectedYear === '2026專題' && video.year !== 2026) return false;
        if (selectedYear === '2025專題' && video.year !== 2025) return false;
        if (selectedYear === '2024專題' && video.year !== 2024) return false;
        if (selectedYear === '2023專題' && video.year !== 2023) return false;
        if (selectedYear === '2022-2020' && (video.year > 2022 || video.year < 2020)) return false;
        if (selectedYear === '更早年代' && video.year >= 2020) return false;
      }

      // Region Match
      if (selectedRegion !== '全部地區' && video.region !== selectedRegion) {
        return false;
      }

      // Search Query Match
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

  // Featured Videos for Hero Banner
  const featuredVideos = useMemo(() => {
    return videoList.filter(v => v.isFeatured || v.isHot).slice(0, 6);
  }, [videoList]);

  // Hot Movies & Dramas for Home Grid Sections
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
      {/* 1. Header & Navigation */}
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

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-16 space-y-8">
        
        {/* Detail View with Full SEO H1/H2 Hierarchy & Player (Points 1, 2, 4, 6) */}
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
          /* Actor Filmography View (Point 6: Strong Internal Linking) */
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
                <p className="text-xs text-zinc-500">請嘗試更換關鍵字、搜尋演員名字或簡體/繁體字</p>
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
          /* Home View */
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
              {/* Left Column: Video Grids (8 Cols on LG) */}
              <div className="lg:col-span-8 space-y-10">
                {/* 1. Hot Trending Grid */}
                <VideoGrid
                  title="熱門上映 · 院線同步"
                  subtitle="全網評分 9.0+ 高清首播大片"
                  icon={<Flame className="w-4 h-4" />}
                  videos={hotMovies}
                  onPlayVideo={handlePlayVideo}
                  isFavorited={isFavorited}
                  onToggleFavorite={toggleFavorite}
                />

                {/* 2. Hot Drama Grid */}
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

              {/* Right Column: High-Density Rankings & Critic Quotes (4 Cols on LG) */}
              <div className="lg:col-span-4 space-y-6">
                <RankingsSection
                  videos={videoList}
                  onPlayVideo={handlePlayVideo}
                />

                {/* Featured Critic Card */}
                <div className="bg-[#14100e] border border-[#27201c] rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#251e1a]">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> 編輯部精選影評
                    </span>
                    <button
                      onClick={() => setCurrentTab('reviews')}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-0.5"
                    >
                      更多 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white line-clamp-1">
                      《九龍城寨之圍城》：香港硬派動作片的巔峰回歸！
                    </p>
                    <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                      「谷垣健治設計的武打兼具漫畫誇張感與拳拳到肉的實感，美術置景逼真重現了九龍城寨的魔幻混沌之美...」
                    </p>
                    <div className="flex items-center justify-between pt-2 text-[10px] text-zinc-500">
                      <span>影評人 · 光影捕手阿澤</span>
                      <span className="text-amber-400 font-bold">評分 9.5</span>
                    </div>
                  </div>
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

            {/* Shorts Highlights Showcase */}
            <section className="space-y-4 pt-6 border-t border-[#221b17]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">精選高光短視頻</h2>
                    <p className="text-xs text-zinc-400">2分鐘速覽經典名場面與神反轉</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab('shorts')}
                  className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                >
                  探索更多短視頻 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {MOCK_SHORTS.map((short) => (
                  <div
                    key={short.id}
                    onClick={() => setSelectedShort(short)}
                    className="group relative rounded-xl overflow-hidden bg-[#15100e] border border-[#271f1a] cursor-pointer hover:border-red-500/50 transition-all hover:scale-[1.02]"
                  >
                    <div className="aspect-video relative overflow-hidden bg-black">
                      <img
                        src={short.coverUrl}
                        alt={short.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono">
                        {short.duration}
                      </span>
                      <span className="absolute top-2 left-2 bg-red-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {short.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                        {short.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-400">
                        <span>關聯：{short.relatedMovieTitle}</span>
                        <span className="text-red-400 font-bold">{short.views} 觀看</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : currentTab === 'movie' || currentTab === 'drama' || currentTab === 'hot' || currentTab === 'latest' ? (
          /* Category Video Grid View */
          <div className="space-y-6">
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

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>
                  {currentTab === 'movie' && '全部電影大片庫'}
                  {currentTab === 'drama' && '全球電視劇集庫'}
                  {currentTab === 'hot' && '熱播高分推薦'}
                  {currentTab === 'latest' && '最新上映作品'}
                </span>
                <span className="text-xs font-normal text-zinc-400">({filteredVideos.length} 部作品)</span>
              </h2>
            </div>

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
          </div>
        ) : currentTab === 'reviews' ? (
          /* Reviews Tab */
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-[#251e1a] pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  最新深度影評與賞析
                </h1>
                <p className="text-xs text-zinc-400 mt-1">專業影評人與廣大影迷的獨家觀影視角</p>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_REVIEWS.map(rev => (
                <article
                  key={rev.id}
                  className="bg-[#14100e] border border-[#27201c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.authorAvatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover border border-red-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                          {rev.isVerifiedCritic && (
                            <span className="bg-red-600/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/30">
                              認證影評人
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500">{rev.date} · 發表於 映視TV 專欄</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-amber-300">{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors">
                      {rev.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {rev.content}
                    </p>
                  </div>

                  {/* Movie Reference Bar */}
                  <div className="flex items-center justify-between bg-[#1b1512] rounded-xl p-3 border border-[#2a211b]">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.moviePoster}
                        alt={rev.movieTitle}
                        className="w-8 h-11 object-cover rounded"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-white">{rev.movieTitle} ({rev.movieYear})</h5>
                        <p className="text-[10px] text-zinc-400">4K 藍光 / 粵語中字</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const target = MOCK_VIDEOS.find(v => v.id === rev.videoId) || MOCK_VIDEOS[0];
                        handlePlayVideo(target);
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-700 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white" /> 立即觀看
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-[#211a16]">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> {rev.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-white transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" /> {rev.commentsCount} 條討論
                      </button>
                    </div>
                    <button className="hover:text-white flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" /> 分享影評
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : currentTab === 'shorts' ? (
          /* Shorts Tab */
          <div className="space-y-6">
            <div className="border-b border-[#251e1a] pb-4">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                精選影視短視頻與高光合輯
              </h1>
              <p className="text-xs text-zinc-400 mt-1">無廣告秒開 · 精彩片段速覽</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {MOCK_SHORTS.map(short => (
                <div
                  key={short.id}
                  onClick={() => setSelectedShort(short)}
                  className="group rounded-2xl overflow-hidden bg-[#14100e] border border-[#27201c] cursor-pointer hover:border-red-500/50 transition-all hover:-translate-y-1 shadow-lg"
                >
                  <div className="aspect-[9/16] relative bg-black max-h-[380px] overflow-hidden">
                    <img
                      src={short.coverUrl}
                      alt={short.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-transparent to-black/40" />
                    
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {short.category}
                    </span>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 space-y-1">
                      <p className="text-xs font-bold text-white line-clamp-2 drop-shadow">
                        {short.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-300">
                        <span>{short.relatedMovieTitle}</span>
                        <span className="text-red-400 font-bold">{short.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentTab === 'topics' ? (
          /* Topics Tab */
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="border-b border-[#251e1a] pb-4">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-500" />
                影視專題特輯
              </h1>
              <p className="text-xs text-zinc-400 mt-1">主題策劃 · 經典系列回顧</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_TOPICS.map(topic => (
                <div
                  key={topic.id}
                  className="bg-[#14100e] border border-[#27201c] rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-red-500/40 transition-all"
                >
                  <div className="aspect-[16/9] relative overflow-hidden bg-black">
                    <img
                      src={topic.bannerUrl}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14100e] via-transparent to-black/50" />
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {topic.badge}
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs text-zinc-300 font-medium">
                      收錄 {topic.itemCount} 部精選作品
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {topic.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#231c17]">
                      {topic.tags.map(t => (
                        <span key={t} className="text-[10px] bg-[#1d1714] text-zinc-400 px-2 py-0.5 rounded border border-[#2e241e]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedGenre('全部類型');
                        setCurrentTab('movie');
                      }}
                      className="w-full py-2 bg-[#1c1613] hover:bg-red-600 text-white text-xs font-bold rounded-xl border border-[#30251f] hover:border-red-500 transition-colors text-center"
                    >
                      進入專題列表
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="pt-10 border-t border-[#251e1a] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-500" />
                常見問題與觀看指南 (FAQ)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_FAQS.map(faq => (
                  <div key={faq.id} className="bg-[#14100e] border border-[#261f1a] rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 text-red-400">
                      Q: {faq.question}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

      </main>

      {/* 3. Short Video Pop-up Modal */}
      {selectedShort && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#120e0c] border border-[#2e231d] rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedShort(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-[9/16] bg-black relative">
              <video
                src={selectedShort.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                {selectedShort.category}
              </span>
              <h4 className="text-xs font-bold text-white pt-1">{selectedShort.title}</h4>
              <p className="text-[10px] text-zinc-400">來源：《{selectedShort.relatedMovieTitle}》</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Favorites & History Drawer */}
      {drawerOpen !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#130e0c] border-l border-[#2e241e] h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#28201a]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDrawerOpen('favorites')}
                  className={`text-sm font-bold pb-1 transition-colors ${
                    drawerOpen === 'favorites' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  我的收藏 ({favorites.length})
                </button>
                <button
                  onClick={() => setDrawerOpen('history')}
                  className={`text-sm font-bold pb-1 transition-colors ${
                    drawerOpen === 'history' ? 'text-red-500 border-b-2 border-red-500' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  觀看記錄 ({history.length})
                </button>
              </div>
              <button
                onClick={() => setDrawerOpen('none')}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-[#201814]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {drawerOpen === 'favorites' ? (
                favorites.length > 0 ? (
                  favorites.map(video => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between gap-3 bg-[#191310] border border-[#292019] p-2.5 rounded-xl group"
                    >
                      <div 
                        onClick={() => {
                          setDrawerOpen('none');
                          handlePlayVideo(video);
                        }}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <img
                          src={video.posterUrl}
                          alt={video.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                            {video.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400">{video.year} · {video.quality}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(video)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                        title="取消收藏"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-zinc-500 text-xs">
                    暫無收藏影片，點擊片單上的愛心或收藏按鈕即可加入！
                  </div>
                )
              ) : (
                history.length > 0 ? (
                  history.map((h, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setDrawerOpen('none');
                        handlePlayVideo(h.video, h.episode);
                      }}
                      className="flex items-center gap-3 bg-[#191310] border border-[#292019] p-2.5 rounded-xl cursor-pointer hover:border-red-500/40 group"
                    >
                      <img
                        src={h.video.posterUrl}
                        alt={h.video.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                          {h.video.title}
                        </h4>
                        <p className="text-[10px] text-red-400">看到第 {h.episode} 集 · {h.watchedAt}</p>
                      </div>
                      <Play className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-zinc-500 text-xs">
                    暫無播放記錄，快去挑選一部好片觀看吧！
                  </div>
                )
              )}
            </div>

            {((drawerOpen === 'favorites' && favorites.length > 0) || (drawerOpen === 'history' && history.length > 0)) && (
              <button
                onClick={() => {
                  if (drawerOpen === 'favorites') setFavorites([]);
                  if (drawerOpen === 'history') setHistory([]);
                }}
                className="w-full py-2 bg-[#1f1713] hover:bg-red-950 text-red-400 text-xs font-bold rounded-xl border border-[#352720] transition-colors"
              >
                清空{drawerOpen === 'favorites' ? '收藏清單' : '歷史記錄'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Auth / User Sign-in Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#130f0d] border border-[#2e231e] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-sm flex items-center justify-center">
                  映
                </div>
                <h3 className="text-sm font-bold text-white">登錄 映視TV 帳戶</h3>
              </div>
              <button onClick={() => setAuthModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              登錄後可在不同設備（手機、平板、電腦、電視端）同步收藏清單與播放進度。
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setAuthModalOpen(false); alert('登錄成功！'); }} className="space-y-3">
              <input
                type="email"
                required
                placeholder="請輸入註冊郵箱 / 用戶名"
                className="w-full bg-[#1b1512] border border-[#2e231d] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500"
              />
              <input
                type="password"
                required
                placeholder="請輸入密碼"
                className="w-full bg-[#1b1512] border border-[#2e231d] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                立即登錄
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <footer className="w-full border-t border-[#221b16] bg-[#090807] py-10 px-4 sm:px-8 mt-auto text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                映
              </div>
              <span className="text-sm font-bold text-white tracking-wider">映視TV · YINGSHI.TV</span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
              <span className="hover:text-white cursor-pointer">免責聲明 (DMCA)</span>
              <span className="hover:text-white cursor-pointer">用戶協議</span>
              <span className="hover:text-white cursor-pointer">隱私政策</span>
              <span className="hover:text-white cursor-pointer">聯絡我們</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-600 leading-relaxed border-t border-[#1a1411] pt-4">
            本網站僅提供線上影視索引與展示技術測試，所有視頻內容均由第三方 CDN 網路爬蟲收集與聚合，伺服器不保存任何影音檔案。若有侵犯您的權益，請發送郵件通知我們及時移除相關連結。
          </p>

          <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-2">
            <span>© 2026 映視TV (YingShi.TV) · 保留所有權利</span>
            <span>Ultra Fast CDN Cluster Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
