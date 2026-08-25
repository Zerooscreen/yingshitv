export type VideoCategory = 'all' | 'movie' | 'drama' | 'anime' | 'variety' | 'short';

export type MainNavTab = 'home' | 'hot' | 'latest' | 'movie' | 'drama' | 'reviews' | 'shorts' | 'topics';

export interface VideoItem {
  id: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  quality: string;
  statusLabel: string;
  year: number;
  region: string;
  category: 'movie' | 'drama' | 'anime' | 'variety' | 'short';
  genres: string[];
  director: string;
  cast: string[];
  synopsis: string;
  episodesCount: number;
  views: string;
  isHot?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  releaseDate: string;
  duration: string;
  videoUrl?: string;
  tags: string[];
  ranking?: {
    overall?: number;
    daily?: number;
    weekly?: number;
  };
}

export interface ReviewItem {
  id: string;
  videoId: string;
  movieTitle: string;
  moviePoster: string;
  movieYear: number;
  author: string;
  authorAvatar: string;
  isVerifiedCritic: boolean;
  rating: number;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  date: string;
}

export interface ShortClipItem {
  id: string;
  title: string;
  coverUrl: string;
  videoUrl: string;
  duration: string;
  views: string;
  likes: number;
  category: string;
  relatedMovieTitle: string;
}

export interface TopicCollection {
  id: string;
  title: string;
  subtitle: string;
  bannerUrl: string;
  itemCount: number;
  badge: string;
  tags: string[];
  videoIds: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface UserHistoryItem {
  videoId: string;
  videoTitle: string;
  posterUrl: string;
  episode: number;
  progressPercent: number;
  timestamp: string;
}
