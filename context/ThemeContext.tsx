
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FestivalTheme {
  id: string;
  name: string;
  festival: string;
  startDate: string; // MM-DD
  endDate: string;   // MM-DD
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
  };
  elements: string[];
  aesthetic: string;
  heroPrompt: string;
  fallbackImage: string;
}

const FESTIVAL_THEMES: FestivalTheme[] = [
  {
    id: 'republic_day',
    name: 'Patriotic Celebration',
    festival: 'Republic Day',
    startDate: '01-01',
    endDate: '01-26',
    colors: { primary: '#FF9933', secondary: '#FFFFFF', accent: '#138808', bg: 'bg-stone-950', text: 'text-amber-100' },
    elements: ['flag', 'chakra'],
    aesthetic: 'Tricolor animation, Ashoka Chakra effects.',
    heroPrompt: 'Grand Indian Republic Day celebration scene, majestic Red Fort in background, Indian tricolor flag waving dramatically in the sky, Ashoka Chakra glowing softly, patriotic atmosphere, golden sunrise lighting, cinematic clouds, confetti in saffron white green, ultra realistic, high detail, 4K resolution, website hero banner style, modern clean composition, space for headline text on left side.',
    fallbackImage: 'https://picsum.photos/seed/republic-day/1920/1080'
  },
  {
    id: 'maha_shivaratri',
    name: 'Maha Shivaratri',
    festival: 'Maha Shivaratri',
    startDate: '02-01',
    endDate: '02-15',
    colors: { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#60a5fa', bg: 'bg-blue-950', text: 'text-blue-100' },
    elements: ['trishul', 'om'],
    aesthetic: 'Dark blue, trishul, temple glow aesthetic.',
    heroPrompt: 'Spiritual Maha Shivaratri night scene, glowing Shiva lingam with soft blue aura, crescent moon in dark sky, Himalaya mountains silhouette, floating diyas and temple bells, mystical fog, deep indigo and silver color palette, cinematic lighting, ultra detailed, sacred atmosphere, website front page background, elegant and minimal layout with text space.',
    fallbackImage: 'https://picsum.photos/seed/shiva/1920/1080'
  },
  {
    id: 'holi',
    name: 'Festival of Colors',
    festival: 'Holi',
    startDate: '03-01',
    endDate: '03-03',
    colors: { primary: '#ec4899', secondary: '#8b5cf6', accent: '#10b981', bg: 'bg-stone-950', text: 'text-pink-100' },
    elements: ['splash', 'powder'],
    aesthetic: 'Bright splash animation, powder effects.',
    heroPrompt: 'Vibrant Holi festival explosion of colorful powder in air, people celebrating joyfully in background silhouette, bright pink yellow blue colors splashing dynamically, sunlight glow, festive Indian street vibe, motion blur powder particles, ultra high detail, energetic composition, website hero banner, clean space for bold typography.',
    fallbackImage: 'https://picsum.photos/seed/holi/1920/1080'
  },
  {
    id: 'baisakhi',
    name: 'Harvest Celebration',
    festival: 'Baisakhi',
    startDate: '04-01',
    endDate: '04-14',
    colors: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#10b981', bg: 'bg-stone-950', text: 'text-amber-100' },
    elements: ['wheat', 'drum'],
    aesthetic: 'Golden wheat fields + Punjabi cultural elements.',
    heroPrompt: 'Golden wheat fields during sunset, Punjabi cultural celebration, traditional bhangra dancers silhouette, warm golden sunlight, festive flags, rural India harvest atmosphere, rich earthy tones, cinematic landscape, ultra realistic, website header background, clean composition with space for title text.',
    fallbackImage: 'https://picsum.photos/seed/harvest-india/1920/1080'
  },
  {
    id: 'buddha_purnima',
    name: 'Peace & Enlightenment',
    festival: 'Buddha Purnima',
    startDate: '05-01',
    endDate: '05-01',
    colors: { primary: '#fbbf24', secondary: '#fef3c7', accent: '#ffffff', bg: 'bg-stone-900', text: 'text-amber-100' },
    elements: ['lotus', 'wheel'],
    aesthetic: 'Soft golden, lotus, calm spiritual theme.',
    heroPrompt: 'Peaceful Buddha meditating under Bodhi tree, soft golden aura, lotus flowers glowing gently, serene water reflection, calm sunrise sky, spiritual tranquil environment, warm gold and soft beige palette, ultra detailed, minimalistic luxury design, website front page hero image with text space.',
    fallbackImage: 'https://picsum.photos/seed/buddha/1920/1080'
  },
  {
    id: 'muharram',
    name: 'Devotion & Journey',
    festival: 'Muharram',
    startDate: '06-01',
    endDate: '06-26',
    colors: { primary: '#10b981', secondary: '#34d399', accent: '#fcd34d', bg: 'bg-emerald-950', text: 'text-emerald-100' },
    elements: ['crescent', 'lantern'],
    aesthetic: 'Elegant crescent, lantern glow.',
    heroPrompt: 'Elegant Islamic Muharram theme, glowing crescent moon in night sky, soft lantern lights, subtle calligraphy patterns in background, deep emerald and gold tones, peaceful and respectful atmosphere, cinematic lighting, high detail, website landing page background, modern and minimal composition.',
    fallbackImage: 'https://picsum.photos/seed/islamic-art/1920/1080'
  },
  {
    id: 'guru_purnima',
    name: 'Gratitude & Wisdom',
    festival: 'Guru Purnima',
    startDate: '07-01',
    endDate: '07-20',
    colors: { primary: '#f97316', secondary: '#ffffff', accent: '#fbbf24', bg: 'bg-stone-950', text: 'text-orange-100' },
    elements: ['book', 'lamp'],
    aesthetic: 'Soft saffron & white theme.',
    heroPrompt: 'Spiritual full moon night (Guru Purnima), glowing full moon reflecting on calm river, silhouette of guru and disciple under tree, soft saffron and white tones, divine light rays, peaceful Indian spiritual setting, ultra realistic, high detail, website hero section background with text space.',
    fallbackImage: 'https://picsum.photos/seed/guru/1920/1080'
  },
  {
    id: 'independence_day',
    name: 'Patriotic Celebration',
    festival: 'Independence Day',
    startDate: '08-01',
    endDate: '08-15',
    colors: { primary: '#FF9933', secondary: '#FFFFFF', accent: '#138808', bg: 'bg-stone-950', text: 'text-amber-100' },
    elements: ['flag', 'chakra'],
    aesthetic: 'Tricolor animation, Ashoka Chakra effects.',
    heroPrompt: 'Indian Independence Day celebration, tricolor smoke forming Indian flag in sky, Ashoka Chakra glowing, Red Fort silhouette, dramatic sunlight rays, patriotic confetti in saffron white green, cinematic epic composition, ultra high resolution, website front page hero banner with space for heading text.',
    fallbackImage: 'https://picsum.photos/seed/india-flag/1920/1080'
  },
  {
    id: 'janmashtami',
    name: 'Devotion & Celebration',
    festival: 'Janmashtami',
    startDate: '09-01',
    endDate: '09-04',
    colors: { primary: '#4f46e5', secondary: '#818cf8', accent: '#fbbf24', bg: 'bg-indigo-950', text: 'text-indigo-100' },
    elements: ['flute', 'feather'],
    aesthetic: 'Krishna flute, peacock feather aesthetics.',
    heroPrompt: 'Baby Krishna (Bal Krishna) sitting with flute, peacock feather glowing softly, butter pot beside him, soft blue and gold divine aura, temple background blurred, magical sparkles in air, devotional peaceful atmosphere, ultra detailed, website hero background style with clean text space.',
    fallbackImage: 'https://picsum.photos/seed/krishna/1920/1080'
  },
  {
    id: 'dussehra',
    name: 'Victory of Good over Evil',
    festival: 'Dussehra',
    startDate: '10-01',
    endDate: '10-20',
    colors: { primary: '#dc2626', secondary: '#f59e0b', accent: '#7f1d1d', bg: 'bg-stone-950', text: 'text-red-100' },
    elements: ['bow', 'fire'],
    aesthetic: 'Ravan silhouette, fire & royal theme.',
    heroPrompt: 'Dramatic Dussehra scene, silhouette of Lord Rama aiming arrow at large Ravana effigy, fiery sunset sky, glowing flames and sparks, epic cinematic lighting, royal red and gold color palette, ultra detailed, high resolution, website landing page hero background with bold text space.',
    fallbackImage: 'https://picsum.photos/seed/dussehra/1920/1080'
  },
  {
    id: 'diwali',
    name: 'Festival of Lights',
    festival: 'Diwali',
    startDate: '11-01',
    endDate: '11-08',
    colors: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#ffffff', bg: 'bg-stone-950', text: 'text-amber-100' },
    elements: ['diya', 'sparkle'],
    aesthetic: 'Golden diyas, glowing particles, luxury festive look.',
    heroPrompt: 'Luxurious Diwali celebration, glowing diyas arranged beautifully, golden bokeh lights, fireworks in night sky, rich royal gold and deep purple tones, sparkling particles, elegant Indian festive atmosphere, cinematic lighting, ultra high detail, premium website hero banner with space for text overlay.',
    fallbackImage: 'https://picsum.photos/seed/diwali-lights/1920/1080'
  },
  {
    id: 'christmas',
    name: 'Winter Celebration',
    festival: 'Christmas',
    startDate: '12-01',
    endDate: '12-25',
    colors: { primary: '#ef4444', secondary: '#10b981', accent: '#fbbf24', bg: 'bg-stone-950', text: 'text-red-100' },
    elements: ['snow', 'tree'],
    aesthetic: 'Snow animation, warm red & gold palette.',
    heroPrompt: 'Magical Christmas night scene, beautifully decorated Christmas tree glowing with warm lights, soft snowfall, cozy golden ambiance, red and green festive tones, sparkling ornaments, cinematic lighting, ultra realistic 4K resolution, website front page hero banner style, clean composition with text space.',
    fallbackImage: 'https://picsum.photos/seed/christmas-tree/1920/1080'
  }
];

interface ThemeContextType {
  activeTheme: FestivalTheme | null;
  currentDate: Date;
  setOverrideThemeId: (id: string | null) => void;
  allThemes: FestivalTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState<FestivalTheme | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date('2026-03-03T12:00:00')); // Mocking Holi (March 3, 2026)
  const [overrideThemeId, setOverrideThemeId] = useState<string | null>(null);

  useEffect(() => {
    const checkTheme = () => {
      if (overrideThemeId) {
        const theme = FESTIVAL_THEMES.find(t => t.id === overrideThemeId);
        setActiveTheme(theme || null);
        return;
      }

      const now = currentDate;
      const year = now.getFullYear();

      if (year !== 2026) {
        setActiveTheme(null);
        return;
      }

      const currentTheme = FESTIVAL_THEMES.find(theme => {
        const [startMonth, startDay] = theme.startDate.split('-').map(Number);
        const [endMonth, endDay] = theme.endDate.split('-').map(Number);

        const start = new Date(2026, startMonth - 1, startDay);
        const end = new Date(2026, endMonth - 1, endDay);
        end.setHours(23, 59, 59);

        return now >= start && now <= end;
      });

      setActiveTheme(currentTheme || null);
    };

    checkTheme();
  }, [currentDate, overrideThemeId]);

  return (
    <ThemeContext.Provider value={{ activeTheme, currentDate, setOverrideThemeId, allThemes: FESTIVAL_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useFestivalTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useFestivalTheme must be used within a ThemeProvider');
  }
  return context;
};
