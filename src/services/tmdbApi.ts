import { VideoItem } from '../types';
import { SAMPLE_VIDEO_URL, SAMPLE_TRAILER_URL, SAMPLE_ACTION_URL } from '../data/mockVideos';

const DEFAULT_TMDB_KEY = '513182919ede525d4b5c8292e15b3c06';
const TMDB_API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY || DEFAULT_TMDB_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_W500 = 'https://image.tmdb.org/t/p/w500';
const IMAGE_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';

// Genre ID mapping for TMDB to Traditional Chinese names
const GENRE_MAP: Record<number, string> = {
  28: '動作片',
  12: '冒險片',
  16: '動漫',
  35: '喜劇片',
  80: '犯罪片',
  99: '紀錄片',
  18: '劇情片',
  10751: '家庭片',
  14: '奇幻片',
  36: '歷史片',
  27: '恐怖片',
  10402: '音樂片',
  9648: '懸疑片',
  10749: '愛情片',
  878: '科幻片',
  10770: '電視電影',
  53: '驚悚片',
  10752: '戰爭片',
  37: '西部片',
  10759: '動作冒險',
  10762: '兒童動畫',
  10763: '新聞時事',
  10764: '真人實境秀',
  10765: '科幻奇幻劇',
  10766: '肥皂劇',
  10767: '脫口秀',
  10768: '戰爭政治劇'
};

// Region detection by original language
function getRegionFromLanguage(lang?: string): string {
  switch (lang) {
    case 'zh':
    case 'cn':
      return '中國大陸';
    case 'zh-TW':
    case 'tw':
      return '台灣';
    case 'zh-HK':
    case 'hk':
    case 'yue':
      return '香港';
    case 'ko':
      return '韓國';
    case 'ja':
      return '日本';
    case 'en':
      return '歐美';
    case 'th':
      return '泰國';
    default:
      return '海外';
  }
}

// Convert TMDB Movie/TV object to VideoItem format
export function formatTmdbItem(item: any, mediaType: 'movie' | 'drama'): VideoItem {
  const isMovie = mediaType === 'movie';
  const title = isMovie ? (item.title || item.original_title) : (item.name || item.original_name);
  const originalTitle = isMovie ? item.original_title : item.original_name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : (new Date().getFullYear());
  
  const posterUrl = item.poster_path 
    ? `${IMAGE_BASE_W500}${item.poster_path}`
    : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
    
  const backdropUrl = item.backdrop_path 
    ? `${IMAGE_BASE_ORIGINAL}${item.backdrop_path}`
    : posterUrl;

  const genres = item.genre_ids && Array.isArray(item.genre_ids)
    ? item.genre_ids.map((id: number) => GENRE_MAP[id] || '熱門').filter(Boolean)
    : ['熱門推薦'];

  const region = getRegionFromLanguage(item.original_language);
  const rating = item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5;
  const voteCount = item.vote_count || 120;
  const views = voteCount > 1000 ? `${(voteCount / 10).toFixed(0)}萬+` : `${voteCount * 12}次`;

  // Alternate sample video streams
  const videoUrls = [SAMPLE_VIDEO_URL, SAMPLE_TRAILER_URL, SAMPLE_ACTION_URL];
  const videoUrl = videoUrls[item.id % videoUrls.length] || SAMPLE_VIDEO_URL;

  return {
    id: `tmdb-${mediaType}-${item.id}`,
    title: title || '未知影片',
    originalTitle: originalTitle !== title ? originalTitle : undefined,
    posterUrl,
    backdropUrl,
    rating: rating > 0 ? rating : 8.8,
    quality: rating >= 8.0 ? '4K 藍光' : '1080P 超清',
    statusLabel: isMovie ? '4K 藍光完整版' : '全集完結 · 4K',
    year: year || 2025,
    region,
    category: isMovie ? 'movie' : 'drama',
    genres: genres.length > 0 ? genres : [isMovie ? '動作片' : '國產劇'],
    director: '知名國際名導',
    cast: ['實力派領銜主演', '全明星陣容'],
    synopsis: item.overview || `${title} 是一部精彩的 ${genres.join(' / ')} 影視巨作，現已在 映視TV 全網獨家首播！`,
    episodesCount: isMovie ? 1 : 16,
    views,
    isHot: item.popularity > 50,
    isNew: year >= 2024,
    isFeatured: item.popularity > 150,
    releaseDate: releaseDate || '2025',
    duration: isMovie ? '128 分鐘' : '16 集全',
    videoUrl,
    tags: ['4K 極速', '雙語音軌', '繁中字幕', ...genres.slice(0, 2)],
    ranking: {
      overall: Math.min(10, Math.max(1, Math.round(11 - (rating > 9 ? 1 : rating > 8 ? 2 : 4))))
    }
  };
}

// Fetch helper with error handling
async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
  try {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', TMDB_API_KEY);
    url.searchParams.set('language', 'zh-TW'); // Request Traditional Chinese
    url.searchParams.set('include_adult', 'false');
    
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.set(key, val);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.warn('TMDB fetch failed, falling back to local dataset:', err);
    return null;
  }
}

// 1. Fetch Trending Movies & TV Shows (Weekly)
export async function getTmdbTrending(): Promise<VideoItem[]> {
  const data = await fetchFromTmdb('/trending/all/week');
  if (!data || !data.results) return [];
  
  return data.results.slice(0, 20).map((item: any) => {
    const mediaType = item.media_type === 'tv' ? 'drama' : 'movie';
    return formatTmdbItem(item, mediaType);
  });
}

// 2. Fetch Popular Movies
export async function getTmdbPopularMovies(page = 1): Promise<VideoItem[]> {
  const data = await fetchFromTmdb('/movie/popular', { page: String(page) });
  if (!data || !data.results) return [];
  return data.results.map((item: any) => formatTmdbItem(item, 'movie'));
}

// 3. Fetch Popular TV Shows
export async function getTmdbPopularTvShows(page = 1): Promise<VideoItem[]> {
  const data = await fetchFromTmdb('/tv/popular', { page: String(page) });
  if (!data || !data.results) return [];
  return data.results.map((item: any) => formatTmdbItem(item, 'drama'));
}

// 4. Fetch Now Playing / Latest in Theaters
export async function getTmdbNowPlaying(): Promise<VideoItem[]> {
  const data = await fetchFromTmdb('/movie/now_playing', { page: '1' });
  if (!data || !data.results) return [];
  return data.results.map((item: any) => formatTmdbItem(item, 'movie'));
}

// 5. Search Movies & TV Shows by Query
export async function searchTmdb(query: string): Promise<VideoItem[]> {
  if (!query.trim()) return [];
  const data = await fetchFromTmdb('/search/multi', { query });
  if (!data || !data.results) return [];
  
  return data.results
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item: any) => {
      const mediaType = item.media_type === 'tv' ? 'drama' : 'movie';
      return formatTmdbItem(item, mediaType);
    });
}
