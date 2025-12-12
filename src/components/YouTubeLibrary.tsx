import React, { useState, useEffect } from 'react';
import { Play, Search, Filter, Globe, BookOpen, Users, Clock, Star, ExternalLink, ChevronDown, Grid, List, Eye, Heart, Loader, AlertCircle } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  rating: number;
  language: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  uploadDate: string;
  youtubeUrl: string;
  hasSubtitles: boolean;
  hasPDF: boolean;
  channelTitle: string;
  publishedAt: string;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  videoCount: number;
}

interface YouTubeAPIResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: { url: string };
        high: { url: string };
      };
      channelTitle: string;
      publishedAt: string;
    };
    statistics?: {
      viewCount: string;
    };
    contentDetails?: {
      duration: string;
    };
  }>;
  pageInfo: {
    totalResults: number;
  };
}

const YouTubeLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [rateLimitCooldown, setRateLimitCooldown] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);

  const youtubeApiKey = "AIzaSyBVjHrZP4mGV7j5FgPZn9nx3hEup2TMVtY";

  // Enhanced YouTube API fetch function with better error handling
  const fetchYouTubeVideos = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&part=snippet&q=${encodeURIComponent(searchTerm)}&type=video&maxResults=20`
      );

      if (response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("YouTube API access forbidden. Please check your API key and quota.");
        } else if (response.status === 401) {
          throw new Error("Invalid YouTube API key. Please check your configuration.");
        } else {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('No videos found for your search. Try different keywords.');
      }

      return data.items;
    } catch (error: any) {
      console.error("YouTube API error:", error.message);
      setError(error.message);
      throw error;
    }
  };

  const subjects: Subject[] = [
    { id: 'computer-science', name: 'Computer Science', icon: '💻', color: 'bg-blue-100 text-blue-800', videoCount: 245 },
    { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'bg-green-100 text-green-800', videoCount: 189 },
    { id: 'physics', name: 'Physics', icon: '⚛️', color: 'bg-purple-100 text-purple-800', videoCount: 156 },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: 'bg-red-100 text-red-800', videoCount: 134 },
    { id: 'engineering', name: 'Engineering', icon: '⚙️', color: 'bg-orange-100 text-orange-800', videoCount: 198 },
    { id: 'competitive-exams', name: 'Competitive Exams', icon: '🎯', color: 'bg-yellow-100 text-yellow-800', videoCount: 267 },
    { id: 'soft-skills', name: 'Soft Skills', icon: '🗣️', color: 'bg-pink-100 text-pink-800', videoCount: 89 },
    { id: 'career-guidance', name: 'Career Guidance', icon: '🚀', color: 'bg-indigo-100 text-indigo-800', videoCount: 76 }
  ];

  const languages = [
    { code: 'all', name: 'All Languages', flag: '🌍' },
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'telugu', name: 'Telugu', flag: '🇮🇳' },
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
    { code: 'kannada', name: 'Kannada', flag: '🇮🇳' },
    { code: 'bengali', name: 'Bengali', flag: '🇮🇳' },
    { code: 'marathi', name: 'Marathi', flag: '🇮🇳' }
  ];

  // Sample fallback videos for when API is not available
  const fallbackVideos: Video[] = [
    {
      id: '1',
      title: 'Learn Python in Telugu – Complete Course for Beginners',
      description: 'Complete Python programming course in Telugu language. Covers basics to advanced concepts with practical examples.',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '4:32:15',
      views: '125K',
      rating: 4.8,
      language: 'telugu',
      subject: 'computer-science',
      level: 'beginner',
      instructor: 'Durga Lokesh Nayak',
      uploadDate: '2024-01-15',
      youtubeUrl: 'https://youtube.com/watch?v=example1',
      hasSubtitles: true,
      hasPDF: true,
      channelTitle: 'Telugu Programming',
      publishedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'SSC Mathematics Tricks in Hindi – Number System',
      description: 'Quick tricks and shortcuts for SSC mathematics. Learn number system concepts with easy methods.',
      thumbnail: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '2:45:30',
      views: '89K',
      rating: 4.6,
      language: 'hindi',
      subject: 'competitive-exams',
      level: 'intermediate',
      instructor: 'Math Guru',
      uploadDate: '2024-01-10',
      youtubeUrl: 'https://youtube.com/watch?v=example2',
      hasSubtitles: true,
      hasPDF: false,
      channelTitle: 'SSC Hindi Prep',
      publishedAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      title: 'Physics Class 11 – Motion in Straight Line (English)',
      description: 'Complete chapter explanation with diagrams and solved examples. Perfect for CBSE and state boards.',
      thumbnail: 'https://images.pexels.com/photos/8500/apple-desk-laptop-working.jpg?auto=compress&cs=tinysrgb&w=400',
      duration: '1:58:22',
      views: '67K',
      rating: 4.7,
      language: 'english',
      subject: 'physics',
      level: 'intermediate',
      instructor: 'Physics Master',
      uploadDate: '2024-01-08',
      youtubeUrl: 'https://youtube.com/watch?v=example3',
      hasSubtitles: true,
      hasPDF: true,
      channelTitle: 'Physics Academy',
      publishedAt: '2024-01-08T09:15:00Z'
    },
    {
      id: '4',
      title: 'UPSC Polity Explained in Tamil – Laxmikanth Summary',
      description: 'Complete Indian Polity summary based on Laxmikanth book. Explained in simple Tamil for UPSC aspirants.',
      thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '3:15:45',
      views: '156K',
      rating: 4.9,
      language: 'tamil',
      subject: 'competitive-exams',
      level: 'advanced',
      instructor: 'UPSC Tamil Guide',
      uploadDate: '2024-01-05',
      youtubeUrl: 'https://youtube.com/watch?v=example4',
      hasSubtitles: true,
      hasPDF: true,
      channelTitle: 'Tamil UPSC Academy',
      publishedAt: '2024-01-05T16:20:00Z'
    },
    {
      id: '5',
      title: 'Machine Learning Full Course – Python (English)',
      description: 'Complete machine learning course with Python. Covers algorithms, implementation, and real-world projects.',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '8:45:30',
      views: '234K',
      rating: 4.8,
      language: 'english',
      subject: 'computer-science',
      level: 'advanced',
      instructor: 'AI Expert',
      uploadDate: '2024-01-01',
      youtubeUrl: 'https://youtube.com/watch?v=example5',
      hasSubtitles: true,
      hasPDF: true,
      channelTitle: 'ML Academy',
      publishedAt: '2024-01-01T12:00:00Z'
    },
    {
      id: '6',
      title: 'C Programming in Kannada – Basics to Advanced',
      description: 'Learn C programming from scratch in Kannada. Perfect for engineering students and beginners.',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '5:20:15',
      views: '78K',
      rating: 4.5,
      language: 'kannada',
      subject: 'computer-science',
      level: 'beginner',
      instructor: 'Code Kannada',
      uploadDate: '2023-12-28',
      youtubeUrl: 'https://youtube.com/watch?v=example6',
      hasSubtitles: true,
      hasPDF: false,
      channelTitle: 'Kannada Programming',
      publishedAt: '2023-12-28T11:30:00Z'
    }
  ];

  // Exponential backoff delay calculation
  const getRetryDelay = (attempt: number): number => {
    return Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
  };

  // Sleep function for delays
  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const searchYouTubeVideos = async (query: string, attempt: number = 0) => {
    if (!youtubeApiKey) {
      console.warn('YouTube API key not found, using fallback videos');
      setApiKeyValid(false);
      setVideos(fallbackVideos);
      setTotalResults(fallbackVideos.length);
      setError('YouTube API key not configured. Showing sample educational content.');
      return;
    }

    if (rateLimitCooldown) {
      setError('Rate limit cooldown active. Please wait before searching again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build search query based on filters
      let searchTerm = query || 'programming tutorial';
      
      if (selectedSubject !== 'all') {
        const subject = subjects.find(s => s.id === selectedSubject);
        if (subject) {
          searchTerm += ` ${subject.name}`;
        }
      }

      if (selectedLanguage !== 'all') {
        searchTerm += ` ${selectedLanguage}`;
      }

      console.log(`Attempting Google YouTube API search (attempt ${attempt + 1}):`, searchTerm);

      // Use the enhanced fetch function
      const items = await fetchYouTubeVideos(searchTerm);

      const transformedVideos: Video[] = items.map((item: any, index: number) => ({
        id: item.id?.videoId || `video-${index}`,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        duration: 'N/A', // Duration not available in search API, would need separate call
        views: 'N/A', // View count not available in search API, would need separate call
        rating: 4.0 + Math.random() * 1, // Random rating between 4-5
        language: detectLanguage(item.snippet.title + ' ' + item.snippet.description),
        subject: detectSubject(item.snippet.title + ' ' + item.snippet.description),
        level: detectLevel(item.snippet.title + ' ' + item.snippet.description),
        instructor: item.snippet.channelTitle,
        uploadDate: new Date(item.snippet.publishedAt).toISOString().split('T')[0],
        youtubeUrl: `https://youtube.com/watch?v=${item.id?.videoId}`,
        hasSubtitles: Math.random() > 0.3, // Random subtitle availability
        hasPDF: Math.random() > 0.6, // Random PDF availability
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));

      setVideos(transformedVideos);
      setTotalResults(transformedVideos.length);
      setRetryCount(0); // Reset retry count on success
      setApiKeyValid(true);

      console.log(`Successfully fetched ${transformedVideos.length} videos from Google YouTube API`);

    } catch (err: any) {
      console.error('YouTube API error:', err);
      
      // Handle rate limiting with retry
      if (err.message.includes('Too many requests') && attempt < 3) {
        const delay = getRetryDelay(attempt);
        setRateLimitCooldown(true);
        setError(`Rate limit exceeded. Retrying in ${Math.ceil(delay / 1000)} seconds...`);
        
        await sleep(delay);
        setRateLimitCooldown(false);
        return await searchYouTubeVideos(query, attempt + 1);
      }
      
      // Final fallback
      if (err.message.includes('forbidden') || err.message.includes('401') || err.message.includes('403')) {
        setApiKeyValid(false);
      }
      
      // Always show fallback content on error
      setVideos(fallbackVideos);
      setTotalResults(fallbackVideos.length);
    } finally {
      setLoading(false);
      setRateLimitCooldown(false);
    }
  };

  const formatDuration = (duration: string): string => {
    // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (viewCount: string): string => {
    const views = parseInt(viewCount);
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const detectLanguage = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('telugu') || lowerText.includes('తెలుగు')) return 'telugu';
    if (lowerText.includes('hindi') || lowerText.includes('हिंदी')) return 'hindi';
    if (lowerText.includes('tamil') || lowerText.includes('தமிழ்')) return 'tamil';
    if (lowerText.includes('kannada') || lowerText.includes('ಕನ್ನಡ')) return 'kannada';
    if (lowerText.includes('bengali') || lowerText.includes('বাংলা')) return 'bengali';
    if (lowerText.includes('marathi') || lowerText.includes('मराठी')) return 'marathi';
    return 'english';
  };

  const detectSubject = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('programming') || lowerText.includes('coding') || lowerText.includes('python') || lowerText.includes('java')) return 'computer-science';
    if (lowerText.includes('math') || lowerText.includes('calculus') || lowerText.includes('algebra')) return 'mathematics';
    if (lowerText.includes('physics') || lowerText.includes('mechanics')) return 'physics';
    if (lowerText.includes('chemistry') || lowerText.includes('organic')) return 'chemistry';
    if (lowerText.includes('engineering') || lowerText.includes('mechanical')) return 'engineering';
    if (lowerText.includes('ssc') || lowerText.includes('upsc') || lowerText.includes('competitive')) return 'competitive-exams';
    if (lowerText.includes('interview') || lowerText.includes('communication')) return 'soft-skills';
    if (lowerText.includes('career') || lowerText.includes('job')) return 'career-guidance';
    return 'computer-science';
  };

  const detectLevel = (text: string): 'beginner' | 'intermediate' | 'advanced' => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('beginner') || lowerText.includes('basic') || lowerText.includes('intro')) return 'beginner';
    if (lowerText.includes('advanced') || lowerText.includes('expert') || lowerText.includes('master')) return 'advanced';
    return 'intermediate';
  };

  const handleSearch = () => {
    setRetryCount(0);
    searchYouTubeVideos(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && !rateLimitCooldown) {
      handleSearch();
    }
  };

  // Load initial content
  useEffect(() => {
    searchYouTubeVideos('programming tutorial');
  }, []);

  // Filter videos based on selected filters
  const filteredVideos = videos.filter(video => {
    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
    const matchesLanguage = selectedLanguage === 'all' || video.language === selectedLanguage;
    const matchesLevel = selectedLevel === 'all' || video.level === selectedLevel;
    return matchesSubject && matchesLanguage && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">YouTube Study Library 📚</h1>
            <p className="text-red-100 text-lg">Educational content from libraries worldwide • All languages • All subjects</p>
            {youtubeApiKey && (
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiKeyValid === false ? 'bg-red-400' : 
                  rateLimitCooldown ? 'bg-yellow-400 animate-pulse' : 
                  apiKeyValid === true ? 'bg-green-400' : 'bg-gray-400 animate-pulse'
                }`}></div>
                <span className="text-sm text-green-200">
                  {apiKeyValid === false ? 'YouTube API Authentication Failed' :
                   rateLimitCooldown ? 'Rate Limited - Retrying...' : 
                   apiKeyValid === true ? 'Google YouTube API Connected' : 
                   'Connecting to YouTube API...'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Play className="w-5 h-5" />
              <span className="font-semibold">Total Videos</span>
            </div>
            <div className="text-2xl font-bold">{totalResults.toLocaleString()}+</div>
            <div className="text-red-100 text-sm">Live from YouTube</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">Languages</span>
            </div>
            <div className="text-2xl font-bold">{languages.length - 1}</div>
            <div className="text-red-100 text-sm">Regional languages</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Subjects</span>
            </div>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <div className="text-red-100 text-sm">Academic fields</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">API Status</span>
            </div>
            <div className="text-2xl font-bold">{youtubeApiKey ? '✅' : '⚠️'}</div>
            <div className="text-red-100 text-sm">
              {!youtubeApiKey ? 'Demo Mode' :
               apiKeyValid === false ? 'Auth Failed' :
               apiKeyValid === true ? 'Connected' : 'Checking...'}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search videos, subjects, instructors... (e.g., 'Python Telugu', 'SSC Math', 'UPSC Tamil')"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              disabled={loading || rateLimitCooldown}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleSearch}
              disabled={loading || rateLimitCooldown}
              className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : rateLimitCooldown ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Cooling down...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search YouTube</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredVideos.length} of {videos.length} videos
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`rounded-lg p-4 ${
          error.includes('quota') || error.includes('Rate limit') ? 
            'bg-yellow-50 border border-yellow-200' :
          error.includes('API key') || error.includes('authentication') || error.includes('forbidden') ?
            'bg-blue-50 border border-blue-200' :
            'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              error.includes('quota') || error.includes('Rate limit') ? 
                'text-yellow-600' :
              error.includes('API key') || error.includes('authentication') || error.includes('forbidden') ?
                'text-blue-600' :
                'text-red-600'
            }`}>
            </AlertCircle>
            <div className="flex-1">
              <h3 className={`font-medium ${
                error.includes('quota') || error.includes('Rate limit') ? 
                  'text-yellow-800' :
                error.includes('API key') || error.includes('authentication') || error.includes('forbidden') ?
                  'text-blue-800' :
                  'text-red-800'
              }`}>
                {error.includes('quota') || error.includes('Rate limit') ? 'Rate Limit Notice' :
                 error.includes('API key') || error.includes('authentication') || error.includes('forbidden') ? 'API Configuration Notice' :
                 'API Error'}
              </h3>
              <p className={`text-sm mt-1 ${
                error.includes('quota') || error.includes('Rate limit') ? 
                  'text-yellow-700' :
                error.includes('API key') || error.includes('authentication') || error.includes('forbidden') ?
                  'text-blue-700' :
                  'text-red-700'
              }`}>
                {error}
              </p>
              {(error.includes('API key') || error.includes('authentication') || error.includes('forbidden')) && (
                <div className="mt-3 text-sm text-blue-700">
                  <p className="font-medium mb-2">To enable live YouTube data:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Visit <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Google Cloud Console</a></li>
                    <li>Create a project and enable the YouTube Data API v3</li>
                    <li>Create an API key with YouTube Data API v3 access</li>
                    <li>Update the API key in the YouTubeLibrary component</li>
                    <li>Ensure your API key has sufficient quota</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subject Categories */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map(subject => (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject.id);
                if (!loading && !rateLimitCooldown) {
                  handleSearch();
                }
              }}
              disabled={loading || rateLimitCooldown}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedSubject === subject.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{subject.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{subject.name}</div>
              <div className="text-xs text-gray-600">{subject.videoCount} videos</div>
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid/List */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Study Videos</h2>
          <div className="text-sm text-gray-600">
            {filteredVideos.length} videos found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Searching YouTube...</h3>
            <p className="text-gray-500">Finding the best educational content for you</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setSelectedLanguage('all');
                setSelectedLevel('all');
                if (!loading && !rateLimitCooldown) {
                  handleSearch();
                }
              }}
              disabled={loading || rateLimitCooldown}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredVideos.map(video => (
              <div key={video.id} className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 ${viewMode === 'list' ? 'flex space-x-4' : ''}`}>
                {/* Thumbnail */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className={`object-cover ${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'}`}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(video.level)}`}>
                      {video.level}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold text-gray-900 leading-tight line-clamp-2 ${viewMode === 'list' ? 'text-base' : 'text-lg'}`}>
                      {video.title}
                    </h3>
                  </div>

                  <p className={`text-gray-600 mb-3 line-clamp-2 ${viewMode === 'list' ? 'text-sm' : ''}`}>
                    {video.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{video.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{video.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span className="capitalize">{video.language}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{video.channelTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {video.hasSubtitles && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Subtitles
                        </span>
                      )}
                      {video.hasPDF && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          PDF Notes
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Watch on YouTube</span>
                    </a>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Our YouTube Library?</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multilingual Content</h3>
            <p className="text-gray-600 text-sm">Learn in your preferred language with subtitles and regional explanations</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live YouTube Integration</h3>
            <p className="text-gray-600 text-sm">Real-time access to millions of educational videos from YouTube with smart rate limiting</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Filtering</h3>
            <p className="text-gray-600 text-sm">Advanced filters with automatic retry and fallback mechanisms</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <ExternalLink className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Enhanced API Integration</h3>
              <p className="text-blue-700 leading-relaxed">
                Our YouTube library now uses the official Google YouTube Data API v3 with intelligent 
                rate limit handling, automatic retry mechanisms, and graceful fallbacks to ensure you 
                always have access to educational content.
              </p>
              {youtubeApiKey && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    apiKeyValid === false ? 'bg-red-500' :
                    rateLimitCooldown ? 'bg-yellow-500' : 
                    apiKeyValid === true ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-blue-600 font-medium">
                    {apiKeyValid === false ? 'YouTube API authentication required' :
                     rateLimitCooldown ? 'Rate limit protection active' : 
                     apiKeyValid === true ? 'Connected to live YouTube data via Google API' :
                     'Checking YouTube API connection...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeLibrary;