import React, { useState } from 'react';
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
  },
  {
    id: 2,
    author: '深度解片室',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
    isVerifiedCritic: true,
    date: '昨天',
    rating: 9.5,
    movieTitle: '星際效應',
    title: '重看诺兰神作，依然会被父女情击中',
    content: '科学与情感的极致结合，配乐和视听语言堪称教科书级别。',
    likes: 352,
    commentsCount: 45
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
  },
  {
    id: 2,
    title: '高燃催泪：安欣二十年白发苍苍',
    category: '角色高光',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60',
    duration: '02:10',
    relatedMovieTitle: '狂飙',
    views: '24.1w',
    likes: '1.5w',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const MOCK_TOPICS = [
  {
    id: 1,
    title: '硬核科幻：探索宇宙的尽头',
    subtitle: '精选豆瓣8.0分以上、改变人类视角的伟大科幻史诗。',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60',
    badge: '史诗片单',
    itemCount: 12,
    tags: ['科幻', '探索', '宇宙']
  },
  {
    id: 2,
    title: '扫黑除恶与人性博弈',
    subtitle: '直击社会现实，揭露幕后黑手与正义交锋的刑侦神剧。',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60',
    badge: '热门专题',
    itemCount: 8,
    tags: ['犯罪', '劇情', '掃黑']
  }
];

const MOCK_FAQS = [
  {
    id: 1,
    category: '播放與畫質',
    question: '如何切換至 4K 超高清蓝光画质？',
    answer: '在视频播放器右下角的设置选单中，您可以手动将画质从“预设高清”切换为“4K 超高清”（需您的设备及网速支持）。'
  },
  {
    id: 2,
    category: '账号與收藏',
    question: '我的收藏夹和观看历史记录会同步吗？',
    answer: '是的，当您登入账号后，所有的历史播放进度与收藏影片都会自动同步保存至云端。'
  }
];

// --- SUB-COMPONENTS ---
function VideoCard({ video, onPlay, isFavorited, onToggleFavorite }) {
  return (
    <div className="group relative bg-[#14100e] border border-[#27201c] rounded-xl overflow-hidden flex flex-col hover:border-red-500/50 transition-all">
      <div className="aspect-[3/4] relative overflow-hidden bg-black">
        <img 
          src={video.posterUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <button 
            onClick={() => onPlay(video)}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> 立即播放
          </button>
        </div>
        <span className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-amber-400 font-bold border border-amber-500/20">
          ★ {video.rating}
        </span>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white truncate">{video.title}</h3>
            <button 
              onClick={() => onToggleFavorite(video)} 
              className={`text-xs ${isFavorited ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
            </button>
          </div>
          <p className="text-[10px] text-zinc-400">{video.year} · {video.genres.join(' / ')}</p>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('全部');
  const [drawerOpen, setDrawerOpen] = useState('none'); // 'none' | 'favorites' | 'history'
  const [selectedShort, setSelectedShort] = useState(null);
  
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);

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
    // Add to history
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

          <button 
            onClick={() => setDrawerOpen('favorites')}
            className="p-2 rounded-lg bg-[#1b1512] border border-[#2f2520] text-zinc-300 hover:text-white relative"
            title="我的收藏"
          >
            <Bookmark className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setDrawerOpen('history')}
            className="p-2 rounded-lg bg-[#1b1512] border border-[#2f2520] text-zinc-300 hover:text-white"
            title="觀看歷史"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Video Player Modal / Active Player */}
        {playingVideo && (
          <div className="bg-[#14100e] border border-[#2a211c] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#221b17] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">正在播放</span>
                <h2 className="text-sm font-bold text-white">{playingVideo.title}</h2>
                <span className="text-xs text-zinc-400">第 {currentEpisode} 集</span>
              </div>
              <button onClick={() => setPlayingVideo(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
              <div className="text-center space-y-2">
                <Play className="w-12 h-12 text-red-600 mx-auto animate-pulse" />
                <p className="text-xs text-zinc-400">正在串流播放 4K 藍光片源：{playingVideo.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Tab Views */}
        {currentTab === 'home' || currentTab === 'hot' || currentTab === 'latest' ? (
          <div className="space-y-6">
            {/* Genre Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['全部', '科幻', '劇情', '犯罪', '災難', '懸疑'].map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedGenre === genre ? 'bg-red-600 text-white font-bold' : 'bg-[#15110e] text-zinc-400 hover:text-white border border-[#271f1a]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-500" />
                  {currentTab === 'home' && '精選熱播推薦'}
                  {currentTab === 'hot' && '熱播高分推薦'}
                  {currentTab === 'latest' && '最新上架首播'}
                </span>
                <span className="text-xs text-zinc-400">
                  共找到 <strong className="text-white">{filteredVideos.length}</strong> 部影片
                </span>
              </h2>
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
                <p className="text-base text-zinc-300 font-medium">沒有找到符合條件的影視作品</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  重置篩選條件
                </button>
              </div>
            )}
          </div>
        ) : currentTab === 'reviews' ? (
          /* Critic Reviews Tab */
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-[#251e1a] pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  <span>專業影評與深度解析</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">匯聚資深影評人與硬核影迷的真實深度觀影心得</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_REVIEWS.map(rev => (
                <div key={rev.id} className="bg-[#14100e] border border-[#27201c] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.authorAvatar} alt={rev.author} className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            {rev.author}
                            {rev.isVerifiedCritic && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                          <span className="text-[10px] text-zinc-500">{rev.date}</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-lg">
                        {rev.rating} 分
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-red-400 font-bold">評：{rev.movieTitle}</span>
                      <h3 className="text-sm font-bold text-white leading-snug">{rev.title}</h3>
                      <p className="text-xs text-zinc-300 leading-relaxed line-clamp-5">{rev.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#221b17] text-xs text-zinc-400">
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" /> <span>{rev.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" /> <span>{rev.commentsCount} 條評論</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentTab === 'shorts' ? (
          /* Shorts Tab */
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-[#251e1a] pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-red-500" />
                  <span>精選高光短視頻專區</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">2分鐘速覽全網爆款名場面、打鬥高光與催淚精華</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_SHORTS.map(short => (
                <div
                  key={short.id}
                  onClick={() => setSelectedShort(short)}
                  className="group rounded-xl overflow-hidden bg-[#15100e] border border-[#271f1a] cursor-pointer hover:border-red-500/50 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden bg-black">
                    <img src={short.coverUrl} alt={short.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono">
                      {short.duration}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-white line-clamp-2 group-hover:text-red-400">{short.title}</h3>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-400">
                      <span>{short.relatedMovieTitle}</span>
                      <span className="text-red-400 font-bold">{short.views} 觀看</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentTab === 'topics' ? (
          /* Curated Topics Tab */
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-[#251e1a] pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-500" />
                  <span>編輯部精心策劃專題</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">深度聚合影史經典、年度神劇與特定風格主題片單</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_TOPICS.map(topic => (
                <div key={topic.id} className="group rounded-2xl overflow-hidden bg-[#14100e] border border-[#27201c] hover:border-red-500/50 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={topic.bannerUrl} alt={topic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14100e] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-xs font-bold shadow">
                        {topic.badge}
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-zinc-300 text-[10px] font-mono">
                        共 {topic.itemCount} 部作品
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{topic.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{topic.subtitle}</p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {topic.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-[#1f1714] border border-[#302520] text-[10px] text-zinc-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setSearchQuery(topic.tags[0]);
                        setCurrentTab('home');
                      }}
                      className="w-full py-2 rounded-xl bg-[#1f1714] hover:bg-red-600 hover:text-white text-xs font-bold text-zinc-300 transition-colors flex items-center justify-center gap-1"
                    >
                      進入專題片單 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentTab === 'faq' ? (
          /* FAQ Tab */
          <div className="space-y-6 pt-2 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-[#251e1a] pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-red-500" />
                  <span>常見問題與播放指南 (FAQ)</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">解答關於 4K 藍光畫質切換、多音軌選擇與電視投屏的所有疑問</p>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_FAQS.map(faq => (
                <div key={faq.id} className="bg-[#14100e] border border-[#27201c] rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#201814] bg-[#090706] py-8 text-center text-xs text-zinc-500 space-y-3">
        <p>映視TV · 全球華語高清影視與熱播大片線上觀看平台</p>
        <p className="text-[10px] text-zinc-600">本站所有視頻均來自互聯網分享，版權歸原作者所有。如有侵權請聯繫刪除。</p>
      </footer>

      {/* Favorites & History Drawer */}
      {drawerOpen !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#120e0c] border-l border-[#271f1a] h-full flex flex-col p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#221b17] pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {drawerOpen === 'favorites' ? <Bookmark className="w-4 h-4 text-red-500" /> : <History className="w-4 h-4 text-red-500" />}
                <span>{drawerOpen === 'favorites' ? '我的收藏夹' : '观看历史记录'}</span>
              </h2>
              <button onClick={() => setDrawerOpen('none')} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {drawerOpen === 'favorites' ? (
                favorites.length > 0 ? (
                  favorites.map(video => (
                    <div key={video.id} className="flex items-center gap-3 bg-[#181210] p-2.5 rounded-xl border border-[#271f1a]">
                      <img src={video.posterUrl} alt={video.title} className="w-14 h-20 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{video.year} · {video.genres.join(' / ')}</p>
                        <button
                          onClick={() => {
                            setDrawerOpen('none');
                            handlePlayVideo(video);
                          }}
                          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700"
                        >
                          立即播放
                        </button>
                      </div>
                      <button
                        onClick={() => toggleFavorite(video)}
                        className="p-2 text-zinc-500 hover:text-red-400"
                        title="移除收藏"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-zinc-500 text-xs">暫無收藏記錄，快去探索心儀電影吧！</div>
                )
              ) : (
                history.length > 0 ? (
                  history.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#181210] p-2.5 rounded-xl border border-[#271f1a]">
                      <img src={item.video.posterUrl} alt={item.video.title} className="w-14 h-20 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.video.title}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">看到第 {item.episode} 集 · {item.watchedAt}</p>
                        <button
                          onClick={() => {
                            setDrawerOpen('none');
                            handlePlayVideo(item.video, item.episode);
                          }}
                          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700"
                        >
                          繼續觀看
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-zinc-500 text-xs">暫無觀看歷史</div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Short Video Player Modal */}
      {selectedShort && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#130f0d] border border-[#271f1a] rounded-2xl overflow-hidden shadow-2xl space-y-4 pb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#221b17]">
              <span className="text-xs font-bold text-red-400">{selectedShort.category}</span>
              <button onClick={() => setSelectedShort(null)} className="p-1 rounded-lg text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black relative">
              <iframe
                src={selectedShort.videoUrl}
                title={selectedShort.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-4 space-y-2">
              <h3 className="text-sm font-bold text-white">{selectedShort.title}</h3>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>關聯作品：{selectedShort.relatedMovieTitle}</span>
                <span className="text-red-400 font-bold">{selectedShort.likes} 點贊 · {selectedShort.views} 播放</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
