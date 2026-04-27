
import React, { useState, useMemo, useEffect } from 'react';
import { Post } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, X, Share2, ArrowRight, Plus, Trash2, Search, ExternalLink, Star } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Magic of Diwali in Varanasi',
    subtitle: 'A journey through the city of lights',
    description: 'Experience the breathtaking beauty of thousands of diyas floating on the Ganges during the festival of lights.',
    content: 'Varanasi, the spiritual heart of India, transforms into a celestial dreamscape during Diwali. As the sun sets, the ancient ghats are illuminated by millions of oil lamps, reflecting in the sacred waters of the Ganges. Our volunteers joined local communities to distribute eco-friendly lamps and share the message of sustainable celebration. The atmosphere was thick with the scent of incense and the sound of devotional songs, creating an unforgettable experience of unity and light.',
    author: 'Arjun Mehta',
    date: 'Oct 24, 2025',
    category: 'Community Stories',
    imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '2',
    title: 'New Feature: AI Festival Art Generator',
    subtitle: 'Manifesting traditions through technology',
    description: 'We are excited to announce our latest update that brings your favorite festivals to life using cutting-edge AI.',
    content: 'Our mission has always been to bridge the gap between ancient traditions and modern technology. With our new AI Art Generator, users can now manifest cinematic representations of any festival. Whether it is the vibrant colors of Holi or the serene beauty of Onam, our AI understands the cultural nuances to create art that is both authentic and inspiring. This update also includes performance improvements and a more intuitive user interface.',
    author: 'Utsav Team',
    date: 'Nov 02, 2025',
    category: 'Campaign Updates',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '3',
    title: 'Volunteer Spotlight: Sarah’s Journey',
    subtitle: 'Finding home in the heart of Punjab',
    description: 'Sarah shares her experience volunteering during Baisakhi and how it changed her perspective on community.',
    content: 'Coming from London, I never expected to feel so at home in a small village in Punjab. During Baisakhi, I helped organize the local community kitchen (Langar). The spirit of selfless service (Seva) was contagious. I learned that festivals are not just about rituals; they are about the people and the bonds we share. This experience has been the highlight of my gap year, and I encourage everyone to join our volunteer program.',
    author: 'Sarah Jenkins',
    date: 'Apr 15, 2025',
    category: 'Volunteer Experiences',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '4',
    title: 'Upcoming Event: The Great Indian Harvest',
    subtitle: 'A virtual celebration of nature',
    description: 'Join us for a week-long virtual event exploring the diverse harvest festivals across India.',
    content: 'From Pongal in the South to Bihu in the East, India’s harvest festivals are a testament to our deep connection with nature. We are hosting a series of webinars, virtual tours, and interactive workshops to celebrate this diversity. Register now to get exclusive access to traditional recipes, folk music performances, and expert-led discussions on the history of these celebrations.',
    author: 'Events Coordinator',
    date: 'Jan 10, 2026',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '5',
    title: 'Announcing Our Cultural Heritage Grant',
    subtitle: 'Supporting local artisans and storytellers',
    description: 'We are launching a new initiative to provide financial support to those preserving our ancient traditions.',
    content: 'Preserving our cultural heritage requires more than just documentation; it requires supporting the people who keep these traditions alive. Our new grant program is designed to provide funding to local artisans, folk performers, and traditional storytellers. We believe that by empowering these individuals, we can ensure that the vibrant tapestry of Indian culture continues to thrive for generations to come. Applications open next month.',
    author: 'Director of Outreach',
    date: 'Feb 20, 2026',
    category: 'Announcements',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200'
  }
];

const CATEGORIES = ['All', 'Community Stories', 'Campaign Updates', 'Volunteer Experiences', 'Events', 'Announcements'];

const StarRating: React.FC<{
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}> = ({ rating, onRate, size = 16, interactive = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={(e) => {
            e.stopPropagation();
            if (interactive && onRate) onRate(star);
          }}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-all duration-200 transform ${interactive && star <= (hover || rating) ? 'scale-110' : 'scale-100'}`}
        >
          <Star
            size={size}
            className={`${
              star <= (hover || rating) ? 'fill-amber-500 text-amber-500' : 'text-stone-700'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export const StoriesSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [displayLimit, setDisplayLimit] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // Load ratings from local storage
  useEffect(() => {
    const savedRatings = localStorage.getItem('utsav_story_ratings');
    if (savedRatings) {
      try {
        setRatings(JSON.parse(savedRatings));
      } catch (e) {
        console.error('Failed to parse ratings', e);
      }
    }
  }, []);

  // Save ratings to local storage
  const handleRate = (postId: string, rating: number) => {
    const newRatings = { ...ratings, [postId]: rating };
    setRatings(newRatings);
    localStorage.setItem('utsav_story_ratings', JSON.stringify(newRatings));
  };

  const handleAiAnalysis = async (imageUrl: string, title: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeImage(base64, blob.type, `Analyze this image from the story "${title}". Tell me about the cultural context, the festival or event depicted, and its significance in Indian tradition.`);
        setAiAnalysis(analysis || "I couldn't analyze this story image at the moment.");
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      setAiAnalysis("Failed to connect to the AI spirits. Please try again.");
      setIsAnalyzing(false);
    }
  };
  const [newPost, setNewPost] = useState<Partial<Post>>({
    category: 'Community Stories',
    author: '',
    imageUrl: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    return filtered;
  }, [selectedCategory, searchQuery, posts]);

  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, displayLimit);
  }, [filteredPosts, displayLimit]);

  // Infinite Scroll Logic
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        if (displayLimit < filteredPosts.length) {
          setDisplayLimit(prev => prev + 3);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayLimit, filteredPosts.length]);

  const featuredPost = posts[0] || MOCK_POSTS[0];

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description || !newPost.content || !newPost.author) {
      alert('Please fill in all required fields (Title, Author, Description, Content)');
      return;
    }
    
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      subtitle: newPost.subtitle || '',
      description: newPost.description,
      content: newPost.content,
      author: newPost.author,
      date: newPost.date || '',
      category: newPost.category as any,
      imageUrl: newPost.imageUrl || `https://picsum.photos/seed/${Date.now()}/1200/600`
    };

    setPosts(prev => [post, ...prev]);
    setIsAdding(false);
    setNewPost({
      category: 'Community Stories',
      author: '',
      imageUrl: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this story?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleShare = (platform: string, post: Post) => {
    const url = window.location.href;
    const text = `Check out this story: ${post.title}`;
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <section id="stories" className="py-24 px-4 bg-stone-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-amber-100 mb-6">Stories & Posts</h2>
          <p className="text-stone-400 text-lg max-w-3xl mx-auto mb-8">
            A window into the vibrant community, campaign updates, and the inspiring experiences that define our odyssey.
          </p>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-8 py-3 bg-stone-900 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-stone-950 font-bold rounded-full transition-all flex items-center gap-2 mx-auto"
          >
            <i className="fa-solid fa-plus"></i>
            Share Your Story
          </button>
        </div>

        {/* Featured Story Banner */}
        {!selectedPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-[2.5rem] overflow-hidden mb-16 group cursor-pointer"
            onClick={() => setSelectedPost(featuredPost)}
          >
            <img 
              src={featuredPost.imageUrl} 
              alt={featuredPost.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-8 md:p-16">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit">
                  Featured Story
                </span>
                <StarRating rating={ratings[featuredPost.id] || 0} size={14} />
              </div>
              <h3 className="text-4xl md:text-6xl font-serif text-white mb-4 max-w-3xl leading-tight">
                {featuredPost.title}
              </h3>
              <p className="text-stone-300 text-lg max-w-2xl line-clamp-2 mb-6">
                {featuredPost.description}
              </p>
              <div className="flex items-center gap-4 text-stone-400 text-sm">
                <span>By {featuredPost.author}</span>
                <span className="w-1 h-1 bg-stone-600 rounded-full"></span>
                <span>{featuredPost.date}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters & Search */}
        {!selectedPost && (
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold' 
                      : 'bg-stone-900 border-white/10 text-stone-400 hover:border-amber-500/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-80">
              <input 
                type="text" 
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-white/10 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white text-sm"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-stone-500 text-xs"></i>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!selectedPost && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {visiblePosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ 
                    y: -12,
                    boxShadow: '0 20px 40px -15px rgba(251, 191, 36, 0.2)',
                    borderColor: 'rgba(251, 191, 36, 0.3)'
                  }}
                  className="glass rounded-[2rem] overflow-hidden border border-white/5 flex flex-col group cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-md text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                      {post.category}
                    </span>
                    <button 
                      onClick={(e) => handleDeletePost(post.id, e)}
                      className="absolute top-4 right-4 w-8 h-8 bg-red-500/20 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-500/30"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-2xl font-serif text-amber-100 group-hover:text-amber-500 transition-colors">
                          {post.title}
                        </h4>
                        <StarRating rating={ratings[post.id] || 0} size={14} />
                      </div>
                      <p className="text-stone-500 text-sm line-clamp-3 mb-6 flex-1">
                        {post.description}
                      </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-stone-400 text-xs font-medium">{post.author}</span>
                        <span className="text-stone-600 text-[10px]">{post.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleShare('whatsapp', post); }}
                            className="w-7 h-7 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-stone-500 hover:text-green-500 transition-all"
                            title="Share on WhatsApp"
                          >
                            <i className="fa-brands fa-whatsapp text-[10px]"></i>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleShare('facebook', post); }}
                            className="w-7 h-7 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-stone-500 hover:text-blue-500 transition-all"
                            title="Share on Facebook"
                          >
                            <i className="fa-brands fa-facebook-f text-[10px]"></i>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleShare('x', post); }}
                            className="w-7 h-7 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-stone-500 hover:text-white transition-all"
                            title="Share on X"
                          >
                            <i className="fa-brands fa-x-twitter text-[10px]"></i>
                          </button>
                        </div>
                        <button className="text-amber-500 text-xs font-bold flex items-center gap-2 group/btn">
                          Read More 
                          <i className="fa-solid fa-arrow-right transition-transform group-hover/btn:translate-x-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!selectedPost && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500 italic">No stories found matching your criteria.</p>
          </div>
        )}

        {/* Post Detail View */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-stone-950 overflow-y-auto"
            >
              <div className="min-h-screen flex flex-col">
                {/* Header Image */}
                <div className="relative h-[60vh] w-full">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent"></div>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-8 left-8 w-12 h-12 bg-stone-900/80 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-stone-950 transition-all border border-white/10"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-24">
                  <div className="glass p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
                        {selectedPost.category}
                      </span>
                      <span className="text-stone-500 text-xs">{selectedPost.date}</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-serif text-amber-100 mb-4 leading-tight">
                      {selectedPost.title}
                    </h1>
                    <p className="text-xl text-amber-500/80 font-serif italic mb-12">
                      {selectedPost.subtitle}
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-12 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-amber-500 font-bold border border-white/10">
                          {selectedPost.author[0]}
                        </div>
                        <div>
                          <p className="text-stone-200 font-bold">{selectedPost.author}</p>
                          <p className="text-stone-500 text-xs">Contributor & Cultural Enthusiast</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className="text-stone-500 text-xs font-bold uppercase tracking-widest">Rate this story</span>
                        <StarRating 
                          rating={ratings[selectedPost.id] || 0} 
                          interactive 
                          size={24} 
                          onRate={(r) => handleRate(selectedPost.id, r)} 
                        />
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-stone-300 text-lg leading-relaxed mb-8">
                        {selectedPost.content}
                      </p>
                      <p className="text-stone-300 text-lg leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                    </div>

                    {/* AI Analysis Section */}
                    <div className="mt-12 pt-12 border-t border-white/5">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-serif text-amber-100">AI Story Analysis</h3>
                        <button 
                          onClick={() => handleAiAnalysis(selectedPost.imageUrl, selectedPost.title)}
                          disabled={isAnalyzing}
                          className="px-6 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-500 hover:text-black transition-all disabled:opacity-50"
                        >
                          {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                          {isAnalyzing ? "Analyzing..." : "Analyze Image with AI"}
                        </button>
                      </div>

                      {aiAnalysis && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-stone-950 rounded-[2rem] border border-amber-500/20 text-stone-300 leading-relaxed prose prose-invert max-w-none"
                        >
                          <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                        </motion.div>
                      )}
                    </div>

                    {/* Social Share */}
                    <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-4">
                        <span className="text-stone-500 text-sm">Share this story:</span>
                        <div className="flex gap-3">
                          <button onClick={() => handleShare('whatsapp', selectedPost)} className="w-10 h-10 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-stone-400 hover:bg-green-600 hover:text-white transition-all">
                            <i className="fa-brands fa-whatsapp"></i>
                          </button>
                          <button onClick={() => handleShare('facebook', selectedPost)} className="w-10 h-10 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-stone-400 hover:bg-blue-600 hover:text-white transition-all">
                            <i className="fa-brands fa-facebook-f"></i>
                          </button>
                          <button onClick={() => handleShare('x', selectedPost)} className="w-10 h-10 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-950 transition-all">
                            <i className="fa-brands fa-x-twitter"></i>
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedPost(null)}
                        className="px-8 py-3 bg-amber-500 text-stone-950 font-bold rounded-full hover:bg-amber-400 transition-all"
                      >
                        Back to Stories
                      </button>
                    </div>
                  </div>

                  {/* Related Posts */}
                  <div className="mt-24">
                    <h3 className="text-3xl font-serif text-amber-100 mb-12">Related Stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {MOCK_POSTS.filter(p => p.id !== selectedPost.id).slice(0, 2).map(post => (
                        <div 
                          key={post.id}
                          className="glass p-6 rounded-[2rem] border border-white/5 flex gap-6 cursor-pointer hover:bg-white/5 transition-all"
                          onClick={() => {
                            setSelectedPost(post);
                            window.scrollTo(0, 0);
                          }}
                        >
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-24 h-24 rounded-2xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-amber-500 text-[10px] uppercase font-bold tracking-widest">{post.category}</span>
                            <h4 className="text-lg font-serif text-amber-100 mt-1">{post.title}</h4>
                            <p className="text-stone-500 text-xs mt-2 line-clamp-1">{post.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Story Modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass w-full max-w-2xl rounded-[2.5rem] border border-white/10 overflow-hidden"
              >
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-serif text-amber-100">Share Your Story</h3>
                    <button onClick={() => setIsAdding(false)} className="text-stone-500 hover:text-white transition-colors">
                      <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddPost} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Title *</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Story Title"
                          value={newPost.title || ''}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          className="w-full bg-stone-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Category</label>
                        <select 
                          value={newPost.category}
                          onChange={(e) => setNewPost({...newPost, category: e.target.value as any})}
                          className="w-full bg-stone-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white text-sm"
                        >
                          {CATEGORIES.filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Author *</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Your Name"
                          value={newPost.author || ''}
                          onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                          className="w-full bg-stone-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Image URL (Optional)</label>
                        <input 
                          type="url" 
                          placeholder="https://..."
                          value={newPost.imageUrl || ''}
                          onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                          className="w-full bg-stone-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Short Description *</label>
                      <input 
                        required
                        type="text" 
                        placeholder="A brief preview of your story..."
                        value={newPost.description || ''}
                        onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                        className="w-full bg-stone-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-amber-500 uppercase tracking-widest">Full Story Content *</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Tell your story here..."
                        value={newPost.content || ''}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        className="w-full bg-stone-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white text-sm resize-none"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="px-8 py-3 text-stone-400 hover:text-white transition-colors font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-3 bg-amber-500 text-stone-950 font-bold rounded-full hover:bg-amber-400 transition-all shadow-xl"
                      >
                        Publish Story
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
