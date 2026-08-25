import React, { useState } from 'react';
import { 
  Play, 
  Star, 
  Bookmark, 
  Share2, 
  Radio, 
  Tv2, 
  Maximize, 
  Send, 
  MessageSquare, 
  Check, 
  ArrowLeft, 
  Flame, 
  Clock, 
  Film, 
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles
} from 'lucide-react';
import { VideoItem } from '../types';
import { SAMPLE_VIDEO_URL } from '../data/mockVideos';
import { createMovieSlug } from '../utils/seo';

interface MovieDetailPageProps {
  video: VideoItem;
  allVideos: VideoItem[];
  onBack: () => void;
  onSelectVideo: (video: VideoItem, episode?: number) => void;
  isFavorited: boolean;
  onToggleFavorite: (video: VideoItem) => void;
  onSelectGenre: (genre: string) => void;
  onSelectActor: (actor: string) => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  video,
  allVideos,
  onBack,
  onSelectVideo,
  isFavorited,
  onToggleFavorite,
  onSelectGenre,
  onSelectActor
}) => {
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [activeLine, setActiveLine] = useState('專線1 (4K極速)');
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string; likes: number }[]>([
    { id: 'c1', user: '尖沙咀段王爺', text: '畫質真的太頂了，4K粵語原聲，城寨最後一戰太燃了！', time: '10分鐘前', likes: 24 },
    { id: 'c2', user: '電影老饕', text: '這條播放線路載入速度超快，完全不卡頓，收藏了！', time: '25分鐘前', likes: 18 },
    { id: 'c3', user: '追劇小狂人', text: '請問會更新花絮和導演剪輯版嗎？太好看了！', time: '1小時前', likes: 9 }
  ]);

  // Find similar movies based on shared genre or region (Point 6: Internal Linking)
  const similarVideos = allVideos
    .filter(v => v.id !== video.id && (v.genres.some(g => video.genres.includes(g)) || v.region === video.region))
    .slice(0, 6);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      {
        id: Date.now().toString(),
        user: '影迷用戶' + Math.floor(1000 + Math.random() * 9000),
        text: newComment.trim(),
        time: '剛剛',
        likes: 0
      },
      ...comments
    ]);
    setNewComment('');
  };

  const isDrama = video.category === 'drama';
  const categoryLabel = isDrama ? '電視劇' : '電影';

  return (
    <div id="movie-detail-container" className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Breadcrumbs for SEO & Fast Navigation (Point 6) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400">
        <button 
          onClick={onBack}
          className="hover:text-red-400 transition-colors flex items-center gap-1"
        >
          首頁
        </button>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <button 
          onClick={() => onSelectGenre(video.genres[0] || '全部類型')}
          className="hover:text-red-400 transition-colors"
        >
          {categoryLabel}
        </button>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <button 
          onClick={() => onSelectGenre(video.genres[0])}
          className="hover:text-red-400 transition-colors text-red-400/90 font-medium"
        >
          {video.genres[0]}
        </button>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-zinc-200 truncate max-w-[200px] sm:max-w-xs">{video.title}</span>
      </nav>

      {/* 2. Top Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#251e19]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#17120f] border border-[#2c221b] text-xs font-bold text-zinc-300 hover:text-white hover:border-red-500/50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> 返回列表
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(video)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isFavorited
                ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                : 'bg-[#17120f] text-zinc-300 hover:text-white border border-[#2c221b]'
            }`}
          >
            {isFavorited ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            {isFavorited ? '已加入收藏' : '收藏本片'}
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              alert(`已複製《${video.title}》線上看播放連結！`);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#17120f] text-zinc-300 hover:text-white border border-[#2c221b] flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> 分享本片
          </button>
        </div>
      </div>

      {/* 3. Movie Title & Main SEO H1 Heading (Point 4: Only One H1) */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded shadow-sm">
            {video.quality}
          </span>
          <span className="bg-[#241914] text-red-300 border border-red-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
            {video.statusLabel}
          </span>
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-bold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{video.rating.toFixed(1)} 分</span>
          </div>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {video.views} 次觀看
          </span>
        </div>

        {/* H1 Primary SEO Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
          {video.title} <span className="text-zinc-400 font-light">({video.year})</span> 完整版高清免費線上看
        </h1>

        {video.originalTitle && video.originalTitle !== video.title && (
          <p className="text-sm text-zinc-400 font-medium">
            原名 / 英文名：<span className="text-zinc-300">{video.originalTitle}</span>
          </p>
        )}
      </header>

      {/* 4. Video Player Frame & Screen Controls */}
      <section aria-labelledby="player-heading" className="space-y-3">
        <div className={`relative bg-black rounded-2xl overflow-hidden border border-[#2b211a] shadow-2xl transition-all duration-300 ${
          isTheaterMode ? 'w-full aspect-[21/9]' : 'w-full aspect-video'
        }`}>
          <video
            key={`${video.id}-${activeEpisode}`}
            src={video.videoUrl || SAMPLE_VIDEO_URL}
            controls
            autoPlay
            poster={video.backdropUrl || video.posterUrl}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Player Toolbar: CDN Lines & Theater Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14100e] border border-[#261f1a] p-3 rounded-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
              <Radio className="w-3.5 h-3.5 text-red-500" /> 播放專線：
            </span>
            {['專線1 (4K極速)', '專線2 (藍光備用)', '專線3 (海外專線)'].map(line => (
              <button
                key={line}
                onClick={() => setActiveLine(line)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  activeLine === line
                    ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950'
                    : 'bg-[#1d1613] text-zinc-400 hover:text-white border border-[#2e231d]'
                }`}
              >
                {line}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="px-3 py-1 text-xs text-zinc-300 hover:text-white bg-[#1d1613] rounded-lg border border-[#2e231d] transition-colors hidden sm:flex items-center gap-1.5 font-medium"
          >
            <Maximize className="w-3.5 h-3.5" />
            {isTheaterMode ? '標準視窗' : '劇院寬屏模式'}
          </button>
        </div>
      </section>

      {/* 5. Multi-Episode Picker (H2 Heading: 在線播放與選集) */}
      {video.episodesCount > 1 && (
        <section aria-labelledby="episodes-heading" className="space-y-3 bg-[#14100e] p-4 sm:p-5 rounded-2xl border border-[#261f1a]">
          <div className="flex items-center justify-between border-b border-[#241c17] pb-3">
            <h2 id="episodes-heading" className="text-base font-bold text-white flex items-center gap-2">
              <Tv2 className="w-4 h-4 text-red-500" />
              在線播放與選集列表
            </h2>
            <span className="text-xs text-zinc-400 font-mono">共 {video.episodesCount} 集全</span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {Array.from({ length: video.episodesCount }).map((_, idx) => {
              const epNum = idx + 1;
              return (
                <button
                  key={epNum}
                  onClick={() => {
                    setActiveEpisode(epNum);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`w-12 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    activeEpisode === epNum
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950 scale-105'
                      : 'bg-[#1b1511] text-zinc-400 hover:text-white border border-[#2d221b] hover:border-red-500/40'
                  }`}
                >
                  第 {epNum < 10 ? `0${epNum}` : epNum} 集
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Metadata Grid & Synopsis (H2 Heading: 劇情簡介 & 演職員表) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Poster (Point 5: Modern WebP / Lazy Loading) */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden border border-[#281f19] bg-[#15100e] shadow-xl">
            <img
              src={video.posterUrl}
              alt={`${video.title} 海報`}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[2/3] object-cover"
            />
            <div className="p-4 space-y-2.5 text-xs text-zinc-300">
              <div className="flex justify-between pb-2 border-b border-[#251e18]">
                <span className="text-zinc-500">上映地區</span>
                <span className="font-bold text-white">{video.region}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#251e18]">
                <span className="text-zinc-500">上映年份</span>
                <span className="font-bold text-white">{video.year} 年</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#251e18]">
                <span className="text-zinc-500">片長 / 規格</span>
                <span className="font-bold text-white">{video.duration} · {video.quality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">更新狀態</span>
                <span className="font-bold text-red-400">{video.statusLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info: Synopsis & Internal Links for Actors/Genres (Points 4 & 6) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Synopsis Section (H2 Heading: 劇情簡介) */}
          <section aria-labelledby="synopsis-heading" className="bg-[#14100e] p-5 sm:p-6 rounded-2xl border border-[#261f1a] space-y-3">
            <h2 id="synopsis-heading" className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#241c17] pb-3">
              <Film className="w-4 h-4 text-red-500" />
              劇情簡介
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed tracking-wide">
              {video.synopsis}
            </p>
          </section>

          {/* Cast & Crew Section (H2 Heading: 演職員表 with Point 6: Internal Links) */}
          <section aria-labelledby="cast-heading" className="bg-[#14100e] p-5 sm:p-6 rounded-2xl border border-[#261f1a] space-y-4">
            <h2 id="cast-heading" className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#241c17] pb-3">
              <User className="w-4 h-4 text-red-500" />
              演職員表與分類標籤
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-zinc-500 w-16 shrink-0 pt-1 font-medium">導演作品：</span>
                <button
                  onClick={() => onSelectActor(video.director)}
                  className="px-2.5 py-1 rounded-lg bg-[#1e1713] text-zinc-200 hover:text-white hover:bg-red-600 border border-[#30241e] hover:border-red-500 transition-colors font-medium"
                >
                  {video.director}
                </button>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-zinc-500 w-16 shrink-0 pt-1 font-medium">主演陣容：</span>
                <div className="flex flex-wrap gap-2">
                  {video.cast.map(actor => (
                    <button
                      key={actor}
                      onClick={() => onSelectActor(actor)}
                      className="px-2.5 py-1 rounded-lg bg-[#1e1713] text-zinc-200 hover:text-white hover:bg-red-600 border border-[#30241e] hover:border-red-500 transition-colors font-medium"
                      title={`查看 ${actor} 的所有參演作品`}
                    >
                      {actor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-zinc-500 w-16 shrink-0 pt-1 font-medium">所屬類型：</span>
                <div className="flex flex-wrap gap-2">
                  {video.genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => onSelectGenre(genre)}
                      className="px-2.5 py-1 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 transition-colors font-bold"
                      title={`瀏覽 ${genre} 分類所有影片`}
                    >
                      #{genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Point 6: Similar Movies (H2 Heading: 猜你喜歡 · 同類熱播推薦) */}
          {similarVideos.length > 0 && (
            <section aria-labelledby="similar-heading" className="bg-[#14100e] p-5 sm:p-6 rounded-2xl border border-[#261f1a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#241c17] pb-3">
                <h2 id="similar-heading" className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  猜你喜歡 · 同類熱播推薦
                </h2>
                <span className="text-xs text-zinc-500">為您精心挑選</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {similarVideos.map(sim => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectVideo(sim)}
                    className="group cursor-pointer space-y-1.5"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1f1915] border border-[#2b211a] group-hover:border-red-500/50 transition-all group-hover:scale-105">
                      <img
                        src={sim.posterUrl}
                        alt={sim.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-zinc-300 font-bold">
                        {sim.year}
                      </span>
                      <span className="absolute bottom-1.5 right-1.5 bg-amber-500/90 text-black px-1.5 py-0.2 rounded text-[10px] font-black">
                        ⭐ {sim.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-zinc-200 group-hover:text-red-400 transition-colors line-clamp-1">
                      {sim.title}
                    </h3>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Comments Section (H2 Heading: 實時影友交流區) */}
          <section aria-labelledby="comments-heading" className="bg-[#14100e] p-5 sm:p-6 rounded-2xl border border-[#261f1a] space-y-4">
            <h2 id="comments-heading" className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#241c17] pb-3">
              <MessageSquare className="w-4 h-4 text-red-500" />
              實時影友交流區 ({comments.length})
            </h2>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`對《${video.title}》發表你的觀影心得與彈幕...`}
                className="flex-1 bg-[#1a1411] border border-[#2e241e] focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> 發送評論
              </button>
            </form>

            <div className="space-y-2.5">
              {comments.map(c => (
                <div key={c.id} className="bg-[#181310] border border-[#261e18] p-3 rounded-xl text-xs flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-bold text-red-400 mr-2">{c.user}：</span>
                    <span className="text-zinc-200 leading-relaxed">{c.text}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0 ml-4">{c.time}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

    </div>
  );
};
