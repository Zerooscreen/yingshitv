import React, { useState, useEffect } from 'react';
import { 
  Search, Play, Film, Sparkles, Layers, HelpCircle, Bookmark, History, 
  Trash2, X, ChevronRight, ThumbsUp, MessageSquare, ShieldCheck, AlertCircle 
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_VIDEOS = [
  {
    id: 1,
    title: '流浪地球 2',
    year: 2023,
    genres: ['科幻', '災難', '冒險'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60',
    rating: 8.2,
    episodes: 1,
    currentEpisode: 1,
    description: '太阳危机即将来临，人类文明陷入绝境。人类决定开启流浪地球计划，试图带着地球一同逃离太阳系。'
  },
  {
    id: 2,
    title: '狂飙',
    year: 2023,
    genres: ['劇情', '犯罪', '掃黑'],
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=60',
    rating: 8.5,
    episodes: 39,
    currentEpisode: 39,
    description: '京海市一线刑警安欣与黑恶势力长达二十年的生死较量，展现了扫黑除恶斗争的艰巨与复杂。'
  },
  {
    id: 3,
    title: '星際效應',
    year: 2014,
    genres: ['科幻', '懸疑', '探索'],
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=60',
    rating: 9.3,
    episodes: 1,
    currentEpisode: 1,
    description: '近未来地球资源枯竭，前NASA飞行员Cooper受命通过虫洞为人类寻找新家园。'
  }
];

const MOCK_REVIEWS = [
  {
    id: 1,
    author: '影迷小王',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    isVerifiedCritic: true,
    date: '2小時前',
    rating: 9.0,
    movieTitle: '流浪地球 2',
    title: '超越前作的国产科幻里程碑',
    content: '特效、剧本以及对于人类命运的哲学思考都达到了国际顶尖水准，非常震撼。',
    likes: 124,
    commentsCount: 18
  }
];

const MOCK_SHORTS = [
  {
    id: 1,
    title: '高能名场面：数字生命危机爆发',
    category: '精彩片段',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    duration: '01:45',
    relatedMovieTitle: '流浪地球 2',
    views: '12.5w',
    likes: '8.2k',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const MOCK_TOPICS = [
  {
    id: 1,
    title: '硬核科幻：探索宇宙的盡頭',
    subtitle: '精选豆瓣8.0分以上、改变人类视角的伟大科幻史诗。',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60',
    badge: '史诗片单',
    itemCount: 12,
    tags: ['科幻', '探索', '宇宙']
  }
];

const MOCK_FAQS = [
  {
    id: 1,
    category: '播放與畫質',
    question: '如何切換至 4K 超高清蓝光画质？',
    answer: '在视频播放器右下角的设置选单中，您可以手动将画质从“预设高清”切换为“4K 超高清”（需您的设备及网速支持）。'
  }
];

// Komponen untuk memasang Banner Adsterra ukuran iframe dengan aman di React
function AdBanner({ adKey, width, height }) {
  useEffect(() => {
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    const container = document.getElementById(`ad-container-${adKey}`);
    if (container && container.innerHTML === '') {
      container.appendChild(confScript);
      container.appendChild(invokeScript);
    }
  }, [adKey, width, height]);

  return <div id={`ad-container-${adKey}`} className="flex justify-center my-2 overflow-hidden" />;
}

// Komponen untuk Native Banner Adsterra
function NativeAdBanner() {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = 'https://pl30557737.effectivecpmnetwork.com/6f7b03feb080b4884047d6210ed8268e/invoke.js';
    
    const container = document.getElementById('native-ad-container');
    if (container && !container.hasChildNodes()) {
      container.appendChild(script);
    }
  }, []);

  return <div id="container-6f7b03feb080b4884047d6210ed8268e" id-ref="native-ad-container" className="my-4" />;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('全部');
  const [drawerOpen, setDrawerOpen] = useState('none'); 
  const [selectedShort, setSelectedShort] = useState(null);
  
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);

  // Inisialisasi Histats (Hidden Mode)
  useEffect(() => {
    window._Hasync = window._Hasync || [];
    window._Hasync.push(['Histats.start', '1,5014113,4,1,120,40,00011111']);
    window._Hasync.push(['Histats.fasi', '1']);
    window._Hasync.push(['Histats.track_hits', '']);

    const hs = document.createElement('script');
    hs.type = 'text/javascript';
    hs.async = true;
    hs.src = '//s10.histats.com/js15_as.js';
    document.body.appendChild(hs);
  }, []);

  const toggleFavorite = (video) => {
    if (favorites.some(f => f.id === video.id)) {
      setFavorites(favorites.filter(f => f.id !== video.id));
    } else {
      setFavorites([...favorites, video]);
    }
  };

  const isFavorited = (id) => favorites.some(f => f.id === id);

  const handlePlayVideo = (video, ep = 1) => {
    setPlayingVideo(video);
    setCurrentEpisode(ep);
    const historyItem = { video, episode: ep, watchedAt: '剛剛' };
    setHistory([historyItem, ...history.filter(h => h.video.id !== video.id)]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('全部');
  };

  const filteredVideos = MOCK_VIDEOS.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = selectedGenre === '全部' || video.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-[#0c0908] text-zinc-100 flex flex-col font-sans">
      
      {/* HIDDEN HISTATS COUNTER & NOSCRIPT */}
      <div id="histats_counter" style={{ display: 'none' }}></div>
      <noscript style={{ display: 'none' }}>
        <a href="/" target="_blank">
          <img src="//sstatic1.histats.com/0.gif?5014113&101" alt="" border="0" />
        </a>
      </noscript>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#120e0c]/90 backdrop-blur-md border-b border-[#241c18] px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentTab('home'); resetFilters(); }}>
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <span className="text-base font-bold tracking-wider text-white">映視TV</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: '首頁大廳' },
              { id: 'hot', label: '熱播高分' },
              { id: 'reviews', label: '專業影評' },
              { id: 'shorts', label: '高光短視頻' },
              { id: 'topics', label: '專題策劃' },
              { id: 'faq', label: '幫助指南' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentTab === tab.id ? 'bg-red-600/10 text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="搜尋電影、劇集..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1512] border border-[#2f2520] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button onClick={() => setDrawerOpen('favorites')} className="p-2 rounded-lg bg-[#1b1512] border border-[#2f2520] text-zinc-300 relative">
            <Bookmark className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          <button onClick={() => setDrawerOpen('history')} className="p-2 rounded-lg bg-[#1b1512] border border-[#2f2520] text-zinc-300">
            <History className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* BANNER 728x90 DI ATAS KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
        <AdBanner adKey="9eab15e2d0d97de74e3ee971fe615a5e" width={728} height={90} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {playingVideo && (
          <div className="bg-[#14100e] border border-[#2a211c] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#221b17] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">正在播放</span>
                <h2 className="text-sm font-bold text-white">{playingVideo.title}</h2>
              </div>
              <button onClick={() => setPlayingVideo(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
              <Play className="w-12 h-12 text-red-600 animate-pulse" />
            </div>
          </div>
        )}

        {/* Home / Catalog View */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredVideos.map(video => (
                <div key={video.id} className="bg-[#14100e] border border-[#27201c] rounded-xl overflow-hidden flex flex-col">
                  <div className="aspect-[3/4] relative overflow-hidden bg-black">
                    <img src={video.posterUrl} alt={video.title} className="w-full h-full object-cover" />
                    <button onClick={() => handlePlayVideo(video)} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-bold text-xs">
                      <Play className="w-6 h-6 fill-white" /> 立即播放
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-white truncate">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Pasang Native Banner di tengah halaman */}
            <div id="native-ad-container" className="my-6">
              <NativeAdBanner />
            </div>
          </div>
        )}
      </main>

      {/* BANNER 468x60 & 320x50 DI FOOTER */}
      <footer className="border-t border-[#201814] bg-[#090706] py-8 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex flex-wrap justify-center gap-4">
          <AdBanner adKey="b4c5edd71dd22f2f3a51a8206816e9ac" width={468} height={60} />
          <AdBanner adKey="374f3cbadfdea331b749dcfc79f79f2c" width={320} height={50} />
        </div>
        <p>映視TV · 全球華語高清影視與熱播大片線上觀看平台</p>
      </footer>
    </div>
  );
}
