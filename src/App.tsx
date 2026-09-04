import React, { useState, useEffect } from 'react';
import { 
  Film, Tv, Sparkles, Flame, Clock, Bookmark, Play, Star, X, 
  Share2, ThumbsUp, MessageSquare, Send, Check, ChevronRight, 
  ShieldCheck, Radio, Tv2, Maximize, Volume2, AlertCircle, Search, History, Trash2, Layers, HelpCircle
} from 'lucide-react';

// --- MOCK DATA LENGKAP ---
const MOCK_VIDEOS = [
  {
    id: 'ys-001',
    title: '九龍城寨之圍城',
    englishTitle: 'Twilight of the Warriors: Walled In',
    year: 2025,
    category: '電影',
    genres: ['動作', '犯罪', '劇情'],
    regions: ['香港'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=60',
    rating: 9.3,
    views: '358.4萬',
    quality: '4K 藍光',
    episodes: 1,
    currentEpisode: 1,
    cast: ['古天樂', '洪金寶', '任賢齊', '林峯'],
    director: '鄭保瑞',
    description: '落魄青年陈洛军误入充满神秘色彩与血雨腥风的九龙城寨，在此结识了一群生死之交，并卷入一场黑帮争夺战中。'
  },
  {
    id: 'ys-002',
    title: '沙丘：第二部',
    englishTitle: 'Dune: Part Two',
    year: 2024,
    category: '電影',
    genres: ['科幻', '冒險', '劇情'],
    regions: ['歐美'],
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=60',
    rating: 9.2,
    views: '412.0萬',
    quality: 'IMAX 4K',
    episodes: 1,
    currentEpisode: 1,
    cast: ['蒂莫西·柴勒梅德', '赞达亚', '丽贝卡·弗格森'],
    director: '丹尼斯·维伦纽瓦',
    description: '保罗·厄崔迪与契尼以及弗雷曼人联合，踏上复仇之路，同时试图阻止可怕的未来降临。'
  },
  {
    id: 'ys-006',
    title: '異形：羅穆路斯',
    englishTitle: 'Alien: Romulus',
    year: 2024,
    category: '電影',
    genres: ['科幻', '懸疑', '恐怖'],
    regions: ['歐美'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=60',
    rating: 8.6,
    views: '245.7萬',
    quality: '4K 杜比',
    episodes: 1,
    currentEpisode: 1,
    cast: ['卡莉·史派妮', '大卫·荣松'],
    director: '费德·阿尔瓦雷兹',
    description: '一群年轻的太空殖民者在清理一座废弃的太空站时，意外遭遇宇宙中最可怕且致命的恐怖生命体「异形」。'
  },
  {
    id: 'ys-003',
    title: '狂飙',
    englishTitle: 'The Knockout',
    year: 2023,
    category: '電視劇',
    genres: ['劇情', '犯罪', '掃黑'],
    regions: ['中國大陸'],
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=60',
    rating: 8.9,
    views: '654.1萬',
    quality: '1080P 超清',
    episodes: 39,
    currentEpisode: 39,
    cast: ['张译', '张颂文', '李一桐'],
    director: '徐纪周',
    description: '京海市一线刑警安欣与黑恶势力长达二十年的生死较量，展现了扫黑除恶斗争的艰巨与复杂。'
  }
];

// Komponen Banner Adsterra Iframe
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

// Komponen Native Banner Adsterra
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
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'hot' | 'latest' | 'movie' | 'tv' | 'reviews' | 'shorts' | 'topics'
  const [selectedRegion, setSelectedRegion] = useState('全部地區');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState('none'); // 'none' | 'favorites' | 'history'

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
    setSelectedVideo(video);
    setCurrentEpisode(ep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const historyItem = { video, episode: ep, watchedAt: '剛剛' };
    setHistory([historyItem, ...history.filter(h => h.video.id !== video.id)]);
  };

  const filteredVideos = MOCK_VIDEOS.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === '全部地區' || video.regions.includes(selectedRegion);
    const matchesTab = 
      currentTab === 'home' || currentTab === 'hot' || currentTab === 'latest' ? true :
      currentTab === 'movie' ? video.category === '電影' :
      currentTab === 'tv' ? video.category === '電視劇' : true;
    
    return matchesSearch && matchesRegion && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#0c0908] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* HIDDEN HISTATS COUNTER & NOSCRIPT */}
      <div id="histats_counter" style={{ display: 'none' }}></div>
      <noscript style={{ display: 'none' }}>
        <a href="/" target="_blank">
          <img src="//sstatic1.histats.com/0.gif?5014113&101" alt="" border="0" />
        </a>
      </noscript>

      {/* HEADER UTAMA */}
      <header className="sticky top-0 z-40 bg-[#120e0c]/95 backdrop-blur-md border-b border-[#241c18] px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setSelectedVideo(null); setCurrentTab('home'); }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/30">
              映
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider text-white">映視TV</span>
                <span className="px-1.5 py-0.2 rounded bg-red-600/20 text-red-400 text-[9px] font-bold border border-red-500/30">4K 港台</span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-tight">YingShi.tv · 臺灣線上影視</p>
            </div>
          </div>

          {/* MENU NAVIGASI UTAMA */}
          <nav className="hidden xl:flex items-center gap-1">
            {[
              { id: 'home', label: '首頁', icon: Flame },
              { id: 'hot', label: '熱播', icon: Sparkles },
              { id: 'latest', label: '最新', icon: Clock },
              { id: 'movie', label: '電影', icon: Film },
              { id: 'tv', label: '電視劇', icon: Tv },
              { id: 'reviews', label: '影評', icon: MessageSquare },
              { id: 'shorts', label: '短視頻', icon: Play },
              { id: 'topics', label: '專題', icon: Layers },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setSelectedVideo(null); setCurrentTab(tab.id); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    currentTab === tab.id && !selectedVideo ? 'bg-red-600/15 text-red-500 font-bold border border-red-500/30' : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SEARCH & USER ACTIONS */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 lg:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="搜尋影視、演員..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1512] border border-[#2f2520] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          <button onClick={() => setDrawerOpen('favorites')} className="p-2 rounded-xl bg-[#1b1512] border border-[#2f2520] text-zinc-300 hover:text-white relative">
            <Bookmark className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          <button onClick={() => setDrawerOpen('history')} className="p-2 rounded-xl bg-[#1b1512] border border-[#2f2520] text-zinc-300 hover:text-white">
            <History className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* BANNER 728x90 DI ATAS KONTEN */}
      <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
        <AdBanner adKey="9eab15e2d0d97de74e3ee971fe615a5e" width={728} height={90} />
      </div>

      {/* KONTEN UTAMA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        
        {/* JIKA VIDEO SEDANG DIPUTAR (HALAMAN PEMUTAR) */}
        {selectedVideo ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-[#1b1512] border border-[#2f2520] px-3 py-1.5 rounded-lg w-fit"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> 返回列表
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">4K 杜比</span>
                <h1 className="text-lg lg:text-xl font-bold text-white">{selectedVideo.title} ({selectedVideo.year})</h1>
                <span className="text-xs text-amber-400 font-bold">★ {selectedVideo.rating} 分</span>
              </div>
              <p className="text-xs text-zinc-400">原名 / 英文名：{selectedVideo.englishTitle}</p>
            </div>

            {/* Video Player Box */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-[#27201c] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse cursor-pointer">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <p className="text-xs text-zinc-400">正在播放線路 1 (4K極速) · 第 {currentEpisode} 集</p>
              </div>
            </div>

            {/* Pemilihan Line / Server */}
            <div className="flex items-center gap-2 bg-[#14100e] p-3 rounded-xl border border-[#27201c]">
              <span className="text-xs text-zinc-400 font-bold">播放專線：</span>
              {[1, 2, 3].map(srv => (
                <button
                  key={srv}
                  onClick={() => setSelectedServer(srv)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedServer === srv ? 'bg-red-600 text-white' : 'bg-[#1b1512] text-zinc-300 hover:text-white border border-[#2f2520]'
                  }`}
                >
                  專線 {srv} {srv === 1 ? '(4K極速)' : srv === 2 ? '(藍光備用)' : '(海外專線)'}
                </button>
              ))}
            </div>

            {/* Sinopsis */}
            <div className="bg-[#14100e] border border-[#27201c] rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" /> 劇情簡介
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">{selectedVideo.description}</p>
              <div className="pt-2 border-t border-[#221b17] flex flex-wrap gap-4 text-xs text-zinc-400">
                <span>導演作品：<strong className="text-white">{selectedVideo.director}</strong></span>
                <span>主演陣容：<strong className="text-white">{selectedVideo.cast.join('、')}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* TAMPILAN KATALOG UTAMA & HOT RANKING */
          <div className="space-y-6">
            
            {/* Filter Wilayah */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
              <span className="text-zinc-400 font-bold whitespace-nowrap">地區入口：</span>
              {['全部地區', '臺灣', '香港', '韓國', '日本', '歐美', '中國大陸'].map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedRegion === region ? 'bg-red-600 text-white font-bold' : 'bg-[#14100e] text-zinc-400 hover:text-white border border-[#27201c]'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Kolom Kiri: Grid Film Utama */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" /> 熱門上映 · 院線同步
                  </h2>
                  <span className="text-xs text-zinc-400">共找到 <strong className="text-white">{filteredVideos.length}</strong> 部作品</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {filteredVideos.map(video => (
                    <div 
                      key={video.id} 
                      className="group bg-[#14100e] border border-[#27201c] rounded-xl overflow-hidden flex flex-col hover:border-red-500/50 transition-all cursor-pointer"
                      onClick={() => handlePlayVideo(video)}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden bg-black">
                        <img src={video.posterUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <button className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow">
                            <Play className="w-3.5 h-3.5 fill-white" /> 立即播放
                          </button>
                        </div>
                        <span className="absolute top-2 left-2 bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {video.quality}
                        </span>
                        <span className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-amber-400 font-bold border border-amber-500/20">
                          ★ {video.rating}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h3 className="text-xs font-bold text-white truncate">{video.title}</h3>
                        <p className="text-[10px] text-zinc-400">{video.year} · {video.genres.join(' / ')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Native Banner Adsterra di tengah */}
                <div id="native-ad-container" className="my-6">
                  <NativeAdBanner />
                </div>
              </div>

              {/* Kolom Kanan: Hot Ranking (Peringkat) */}
              <div className="space-y-4">
                <div className="bg-[#14100e] border border-[#27201c] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#221b17] pb-3">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 熱播排行榜 HOT TOP
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {MOCK_VIDEOS.map((video, idx) => (
                      <div 
                        key={video.id} 
                        onClick={() => handlePlayVideo(video)}
                        className="flex items-center gap-3 p-2 rounded-xl bg-[#1b1512]/60 hover:bg-[#1b1512] border border-transparent hover:border-red-500/30 cursor-pointer transition-all"
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0 ? 'bg-red-600 text-white' : idx === 1 ? 'bg-amber-500 text-black' : idx === 2 ? 'bg-zinc-600 text-white' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <img src={video.posterUrl} alt={video.title} className="w-10 h-14 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{video.views} 觀看 · ★ {video.rating}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* FOOTER & BANNER ADSTERRA TAMBAHAN */}
      <footer className="border-t border-[#201814] bg-[#090706] py-8 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex flex-wrap justify-center gap-4">
          <AdBanner adKey="b4c5edd71dd22f2f3a51a8206816e9ac" width={468} height={60} />
          <AdBanner adKey="374f3cbadfdea331b749dcfc79f79f2c" width={320} height={50} />
        </div>
        <p>映視TV · 全球華語高清影視與熱播大片線上觀看平台</p>
        <p className="text-[10px] text-zinc-600">本站所有視頻均來自互聯網分享，版權歸原作者所有。</p>
      </footer>

      {/* DRAWER FAVORIT & HISTORY */}
      {drawerOpen !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#120e0c] border-l border-[#271f1a] h-full flex flex-col p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#221b17] pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {drawerOpen === 'favorites' ? <Bookmark className="w-4 h-4 text-red-500" /> : <History className="w-4 h-4 text-red-500" />}
                <span>{drawerOpen === 'favorites' ? '我的收藏夾' : '觀看歷史記錄'}</span>
              </h2>
              <button onClick={() => setDrawerOpen('none')} className="p-1 rounded-lg text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {drawerOpen === 'favorites' ? (
                favorites.length > 0 ? (
                  favorites.map(video => (
                    <div key={video.id} className="flex items-center gap-3 bg-[#181210] p-2.5 rounded-xl border border-[#271f1a]">
                      <img src={video.posterUrl} alt={video.title} className="w-14 h-20 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
                        <button onClick={() => { setDrawerOpen('none'); handlePlayVideo(video); }} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold">
                          立即播放
                        </button>
                      </div>
                      <button onClick={() => toggleFavorite(video)} className="p-2 text-zinc-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : <div className="py-20 text-center text-zinc-500 text-xs">暫無收藏記錄</div>
              ) : (
                history.length > 0 ? (
                  history.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#181210] p-2.5 rounded-xl border border-[#271f1a]">
                      <img src={item.video.posterUrl} alt={item.video.title} className="w-14 h-20 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.video.title}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">看到第 {item.episode} 集</p>
                        <button onClick={() => { setDrawerOpen('none'); handlePlayVideo(item.video, item.episode); }} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold">
                          繼續觀看
                        </button>
                      </div>
                    </div>
                  ))
                ) : <div className="py-20 text-center text-zinc-500 text-xs">暫無觀看歷史</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
