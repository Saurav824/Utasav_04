
export interface FestivalInfo {
  name: string;
  description: string;
  significance: string;
  rituals: string[];
  history: string;
  location: string;
  season: string;
  requirements?: string[];
}

export interface FestivalRating {
  festivalName: string;
  rating: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image?: {
    data: string;
    mimeType: string;
  };
  groundingChunks?: any[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  author: string;
  date: string;
  category: 'Community Stories' | 'Campaign Updates' | 'Volunteer Experiences' | 'Events' | 'Announcements';
  imageUrl: string;
}

export interface Craft {
  id: string;
  name: string;
  state: string;
  category: 'Textile' | 'Pottery' | 'Painting' | 'Woodwork' | 'Metal Craft' | 'Handicraft' | 'Other';
  description: string;
  imageUrl: string;
  artisanId?: string;
}

export interface Artisan {
  id: string;
  name: string;
  craft: string;
  state: string;
  story: string;
  imageUrl: string;
  videoUrl?: string;
}
