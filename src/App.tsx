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
// KODE KOMPONEN ADSTERRA BANNER
// ==========================================
function AdsterraBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    if (!bannerRef.current) return;

    scriptLoaded.current = true;

    try {
      // Konfigurasi Adsterra atOptions (Ganti key dengan kode unit iklan Anda jika perlu)
      const atOptions = {
        'key': 'masukkan_key_adsterra_anda_disini',
        'format': 'iframe',
        'height': 50,
        'width': 320,
        'params': {}
      };

      const confScript = document.createElement('script');
      confScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/' + atOptions.key + '/invoke.js';

      bannerRef.current.innerHTML = '';
      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(invokeScript);
    } catch (e) {
      console.error('Adsterra load error:', e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden">
      <div ref={bannerRef} className="min-h-[50px] flex justify-center items-center bg-[#130f0d] border border-[#27201c] rounded-xl p-2" />
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
        
        {/* Sisipan Iklan Adsterra di Bagian Atas / Bawah Header */}
        <AdsterraBanner />

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

                {/* Sisipan Iklan Adsterra di Tengah Konten */}
                <AdsterraBanner />

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
                </span>
              </h2>
            </div>
          </div>
        ) : null}

        {/* Sisipan Iklan Adsterra di Bagian Bawah Halaman */}
        <AdsterraBanner />

      </main>
    </div>
  );
}
