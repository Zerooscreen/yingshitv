import { VideoItem } from '../types';

/**
 * Generates an SEO-friendly URL slug for movies and TV series
 * Example format: /movie/ys-001-jiulong-chengzhai or /drama/ys-002-fan-hua
 */
export function createMovieSlug(video: VideoItem): string {
  const sanitizedTitle = video.title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  return `${video.id}-${sanitizedTitle}`;
}

/**
 * Parse movie ID from a slug (e.g., "ys-001-kowloon-walled-city" -> "ys-001" or "tmdb-movie-12345-title" -> "tmdb-movie-12345")
 */
export function parseIdFromSlug(slug: string): string {
  if (slug.startsWith('tmdb-movie-') || slug.startsWith('tmdb-drama-')) {
    const parts = slug.split('-');
    // tmdb-[movie|drama]-[id]
    return parts.slice(0, 3).join('-');
  }
  const match = slug.match(/^(ys-\d+)/);
  return match ? match[1] : slug.split('-')[0];
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'video.movie' | 'video.tv_show';
  schemaJson?: Record<string, any>;
}

/**
 * Builds dynamic SEO meta tags and Schema.org structured data based on current view/movie
 */
export function getSeoMetadata(
  activeVideo: VideoItem | null,
  currentTab: string,
  selectedGenre?: string,
  selectedActor?: string
): SeoMetadata {
  const siteName = 'YingShi.tv (映視TV)';
  const baseUrl = 'https://yingshitv.tv';

  // 1. Movie / TV Series Detail View
  if (activeVideo) {
    const isDrama = activeVideo.category === 'drama';
    const mediaTypeLabel = isDrama ? '電視劇全集' : '完整版';
    const categoryPath = isDrama ? 'drama' : 'movie';
    const slug = createMovieSlug(activeVideo);
    const canonicalUrl = `${baseUrl}/${categoryPath}/${slug}`;

    // Dynamic Title Format: [Nama Film] [Tahun] 完整版高清免費線上看 — YingShi.tv
    const title = `${activeVideo.title} ${activeVideo.year} ${mediaTypeLabel}高清免費線上看 — YingShi.tv`;

    // Dynamic Description Format: 觀看《[Nama Film]》完整版高清線上看。主演：[Nama Aktor]. 劇情簡介：[Sinopsis singkat film]. 立即在 YingShi.tv 免費追劇。
    const castString = activeVideo.cast.length > 0 ? activeVideo.cast.slice(0, 4).join('、') : '實力派演員陣容';
    const shortSynopsis = activeVideo.synopsis.replace(/\s+/g, ' ').slice(0, 110);
    const description = `觀看《${activeVideo.title}》${mediaTypeLabel}高清線上看。主演：${castString}。劇情簡介：${shortSynopsis}... 立即在 YingShi.tv 免費追劇。`;

    // Schema.org JSON-LD Structured Data
    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': isDrama ? 'TVSeries' : 'Movie',
      name: activeVideo.title,
      alternateName: activeVideo.originalTitle || activeVideo.title,
      image: activeVideo.posterUrl,
      description: activeVideo.synopsis,
      genre: activeVideo.genres,
      datePublished: String(activeVideo.year),
      inLanguage: 'zh-TW',
      duration: activeVideo.duration,
      director: {
        '@type': 'Person',
        name: activeVideo.director || '名導'
      },
      actor: activeVideo.cast.map(name => ({
        '@type': 'Person',
        name
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(activeVideo.rating || 8.5),
        bestRating: '10',
        worstRating: '1',
        ratingCount: activeVideo.views.includes('萬') 
          ? String(parseInt(activeVideo.views) * 1000 + 250) 
          : '1250'
      }
    };

    return {
      title,
      description,
      canonicalUrl,
      ogImage: activeVideo.backdropUrl || activeVideo.posterUrl,
      ogType: isDrama ? 'video.tv_show' : 'video.movie',
      schemaJson
    };
  }

  // 2. Filter by Actor
  if (selectedActor) {
    const title = `${selectedActor} 主演電影電視劇作品全集 4K高清免費線上看 — YingShi.tv`;
    const description = `立即在 YingShi.tv 免費在線觀看 ${selectedActor} 參演的最新熱播電影、電視劇及高分經典代表作，支援 4K 藍光極速播放。`;
    const canonicalUrl = `${baseUrl}/actor/${encodeURIComponent(selectedActor)}`;
    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website'
    };
  }

  // 3. Filter by Genre
  if (selectedGenre && selectedGenre !== '全部類型') {
    const title = `${selectedGenre}精選推薦 · 最新高分${selectedGenre}排行榜免費線上看 — YingShi.tv`;
    const description = `映視TV (YingShi.tv) 為您提供最新、最全的${selectedGenre}在線觀看，包含 2024-2026 年度熱播院線大片與經典高分神作。`;
    const canonicalUrl = `${baseUrl}/genre/${encodeURIComponent(selectedGenre)}`;
    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website'
    };
  }

  // 4. Tab Specific Pages
  switch (currentTab) {
    case 'movie':
      return {
        title: '電影大片庫 · 最新院線動作/喜劇/科幻大片 4K高清免費線上看 — YingShi.tv',
        description: '映視TV電影庫收錄全球最新上映院線大片、香港經典動作片、歐美好萊塢科幻片及文藝高分電影，4K藍光無廣告極速觀看。',
        canonicalUrl: `${baseUrl}/movie`,
        ogType: 'website'
      };
    case 'drama':
      return {
        title: '熱門電視劇 · 陸劇/港劇/台劇/韓劇/日劇全集同步跟播 — YingShi.tv',
        description: '每日同步更新最新熱播陸劇、TVB港劇、高分韓劇與日劇全集。免登錄無廣告，極速多線路高清觀看。',
        canonicalUrl: `${baseUrl}/drama`,
        ogType: 'website'
      };
    case 'reviews':
      return {
        title: '深度影評與賞析 · 專業影評人觀影指南與評分 — YingShi.tv',
        description: '匯集專業影評人與廣大影迷的獨家觀影解析、劇情反轉剖析與金句台詞推薦，帶你發現更多寶藏好片。',
        canonicalUrl: `${baseUrl}/reviews`,
        ogType: 'website'
      };
    case 'shorts':
      return {
        title: '影視高光短視頻 · 2分鐘精彩名場面速覽 — YingShi.tv',
        description: '精選電影電視劇高光名場面、武打打鬥混剪與名場面解析，沉浸式短視頻秒開即看。',
        canonicalUrl: `${baseUrl}/shorts`,
        ogType: 'website'
      };
    case 'topics':
      return {
        title: '影視專題特輯 · 港影不死與全球高分神劇策劃 — YingShi.tv',
        description: '精心策劃的主題觀影指南，帶你重溫香港黃金時代硬派動作片、豆瓣高分神劇與頂級動漫劇場版。',
        canonicalUrl: `${baseUrl}/topics`,
        ogType: 'website'
      };
    default:
      return {
        title: '映視TV (YingShi.tv) - 台港首選 4K 高清線上影視串流平台',
        description: '映視TV (YingShi.tv) 提供最新繁體中文熱播電影、電視劇、動漫、綜藝及高光短視頻。支援 4K 超清流暢播放，港台專線極速加載。',
        canonicalUrl: baseUrl,
        ogType: 'website'
      };
  }
}

/**
 * Updates DOM head tags dynamically for search engine bots and social share crawlers
 */
export function applySeoMetadataToDom(metadata: SeoMetadata) {
  if (typeof document === 'undefined') return;

  // 1. Update <title>
  document.title = metadata.title;

  // Helper to set or create meta tag
  const setMeta = (attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Update Description
  setMeta('name', 'description', metadata.description);

  // 3. Update Canonical <link rel="canonical">
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', metadata.canonicalUrl);

  // 4. Update OpenGraph Tags
  setMeta('property', 'og:title', metadata.title);
  setMeta('property', 'og:description', metadata.description);
  setMeta('property', 'og:url', metadata.canonicalUrl);
  setMeta('property', 'og:type', metadata.ogType || 'website');
  if (metadata.ogImage) {
    setMeta('property', 'og:image', metadata.ogImage);
  }

  // 5. Update Twitter Card Tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', metadata.title);
  setMeta('name', 'twitter:description', metadata.description);
  if (metadata.ogImage) {
    setMeta('name', 'twitter:image', metadata.ogImage);
  }

  // 6. Update or Inject Schema.org JSON-LD Structured Data
  let schemaScript = document.getElementById('schema-structured-data') as HTMLScriptElement;
  if (metadata.schemaJson) {
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'schema-structured-data';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(metadata.schemaJson, null, 2);
  } else if (schemaScript) {
    schemaScript.remove();
  }
}
