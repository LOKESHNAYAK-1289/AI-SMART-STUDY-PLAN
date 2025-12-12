import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, Brain, Target, Lightbulb, Wrench, PenTool, Save, BookOpen, Smile, Frown, Meh, Sun, Moon, Sunrise, ChevronLeft, ChevronRight, Search, Filter, Star, Trash2, Edit3, Eye } from 'lucide-react';

interface DiaryEntry {
  id: string;
  date: string;
  time: 'morning' | 'afternoon' | 'evening';
  mood: string;
  events: string;
  accomplishments: string;
  challenges: string;
  learnings: string;
  improvements: string;
  freeThoughts: string;
  moodRating: number;
  energyLevel: number;
  tags: string[];
  isPrivate: boolean;
  created_at: string;
  updated_at: string;
}

const DailyDiary: React.FC = () => {
  const [currentEntry, setCurrentEntry] = useState<Partial<DiaryEntry>>({
    date: new Date().toISOString().split('T')[0],
    time: getCurrentTimeOfDay(),
    mood: '',
    events: '',
    accomplishments: '',
    challenges: '',
    learnings: '',
    improvements: '',
    freeThoughts: '',
    moodRating: 5,
    energyLevel: 5,
    tags: [],
    isPrivate: true
  });

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [viewMode, setViewMode] = useState<'write' | 'history'>('write');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);

  // Load existing entries (mock data for demo)
  useEffect(() => {
    const mockEntries: DiaryEntry[] = [
      {
        id: '1',
        date: '2024-01-20',
        time: 'evening',
        mood: 'I feel accomplished but a bit tired after a long study session. There\'s a sense of satisfaction from completing my goals.',
        events: 'Studied Python for 4 hours, had lunch with friends, attended online lecture on machine learning, worked on my project.',
        accomplishments: 'Completed Chapter 8 of Python programming, Fixed 3 bugs in my web project, Helped my roommate with calculus homework',
        challenges: 'Got distracted by social media during afternoon study session. The ML lecture was quite complex and hard to follow.',
        learnings: 'I realized that the Pomodoro technique really works for me. Taking 5-minute breaks every 25 minutes keeps me fresh and focused.',
        improvements: 'Tomorrow I\'ll put my phone in airplane mode during study hours. Also need to review ML basics before advanced lectures.',
        freeThoughts: 'Thinking about how AI is changing education. Maybe I should start a blog about my learning journey? 🤔\n\nQuote of the day: "The expert in anything was once a beginner." - Helen Hayes',
        moodRating: 7,
        energyLevel: 6,
        tags: ['study', 'python', 'productivity', 'friends'],
        isPrivate: true,
        created_at: '2024-01-20T20:30:00Z',
        updated_at: '2024-01-20T20:30:00Z'
      },
      {
        id: '2',
        date: '2024-01-19',
        time: 'morning',
        mood: 'Feeling fresh and motivated to start the day. Had a good night\'s sleep and ready to tackle new challenges.',
        events: 'Morning workout, breakfast with family, started reading a new book on algorithms, planned my study schedule for the week.',
        accomplishments: 'Completed 30-minute workout, Read 20 pages of algorithms book, Created a detailed study plan for the week',
        challenges: 'Woke up a bit late, so had to rush through morning routine. Need to be more consistent with sleep schedule.',
        learnings: 'Morning workouts really boost my energy for the entire day. Physical activity before studying seems to improve focus.',
        improvements: 'Set a consistent bedtime of 10 PM to wake up at 6 AM naturally. Prepare workout clothes the night before.',
        freeThoughts: 'Beautiful sunrise today! 🌅 Makes me appreciate the simple things in life.\n\nIdea: Create a study group with classmates for algorithm practice.',
        moodRating: 8,
        energyLevel: 9,
        tags: ['morning', 'workout', 'algorithms', 'planning'],
        isPrivate: true,
        created_at: '2024-01-19T08:15:00Z',
        updated_at: '2024-01-19T08:15:00Z'
      }
    ];
    setEntries(mockEntries);
  }, []);

  function getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  const timeOfDayIcons = {
    morning: Sunrise,
    afternoon: Sun,
    evening: Moon
  };

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Sad' },
    { value: 2, emoji: '😔', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Happy' },
    { value: 6, emoji: '😄', label: 'Very Happy' },
    { value: 7, emoji: '🤩', label: 'Excited' },
    { value: 8, emoji: '🥳', label: 'Thrilled' },
    { value: 9, emoji: '😍', label: 'Amazing' },
    { value: 10, emoji: '🚀', label: 'On Top of the World' }
  ];

  const commonTags = [
    'study', 'work', 'friends', 'family', 'exercise', 'reading', 'coding',
    'exam', 'project', 'breakthrough', 'challenge', 'success', 'learning',
    'reflection', 'gratitude', 'goals', 'productivity', 'creativity', 'inspiration'
  ];

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      const newEntry: DiaryEntry = {
        ...currentEntry,
        id: editingEntry || Date.now().toString(),
        created_at: editingEntry ? entries.find(e => e.id === editingEntry)?.created_at || new Date().toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as DiaryEntry;

      if (editingEntry) {
        setEntries(prev => prev.map(entry => entry.id === editingEntry ? newEntry : entry));
        setEditingEntry(null);
      } else {
        setEntries(prev => [newEntry, ...prev]);
      }

      // Reset form
      setCurrentEntry({
        date: new Date().toISOString().split('T')[0],
        time: getCurrentTimeOfDay(),
        mood: '',
        events: '',
        accomplishments: '',
        challenges: '',
        learnings: '',
        improvements: '',
        freeThoughts: '',
        moodRating: 5,
        energyLevel: 5,
        tags: [],
        isPrivate: true
      });

      setSaving(false);
    }, 1000);
  };

  const handleEdit = (entry: DiaryEntry) => {
    setCurrentEntry(entry);
    setEditingEntry(entry.id);
    setViewMode('write');
  };

  const handleDelete = (entryId: string) => {
    if (confirm('Are you sure you want to delete this diary entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const addTag = (tag: string) => {
    if (!currentEntry.tags?.includes(tag)) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.events.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.accomplishments.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.learnings.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = filterTags.length === 0 || 
      filterTags.some(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const getStreakCount = () => {
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = entryDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const TimeIcon = timeOfDayIcons[currentEntry.time as keyof typeof timeOfDayIcons];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Daily Personal Diary 📖</h1>
            <p className="text-purple-100 text-lg">Your private space for reflection, growth, and self-discovery</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Total Entries</span>
            </div>
            <div className="text-2xl font-bold">{entries.length}</div>
            <div className="text-purple-100 text-sm">Journal entries</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Writing Streak</span>
            </div>
            <div className="text-2xl font-bold">{getStreakCount()}</div>
            <div className="text-purple-100 text-sm">Consecutive days</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Avg Mood</span>
            </div>
            <div className="text-2xl font-bold">
              {entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.moodRating, 0) / entries.length).toFixed(1) : '0'}/10
            </div>
            <div className="text-purple-100 text-sm">Happiness level</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <PenTool className="w-5 h-5" />
              <span className="font-semibold">This Month</span>
            </div>
            <div className="text-2xl font-bold">
              {entries.filter(entry => new Date(entry.date).getMonth() === new Date().getMonth()).length}
            </div>
            <div className="text-purple-100 text-sm">Entries written</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('write')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                viewMode === 'write' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span>Write Entry</span>
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                viewMode === 'history' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>View History</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Today: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {viewMode === 'write' ? (
        /* Write Entry Mode */
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              🌙 Daily Personal Diary Prompt
            </h2>

            <div className="space-y-8">
              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>📅 Date:</span>
                  </label>
                  <input
                    type="date"
                    value={currentEntry.date}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>🕰️ Time:</span>
                  </label>
                  <div className="flex space-x-3">
                    {(['morning', 'afternoon', 'evening'] as const).map((time) => {
                      const Icon = timeOfDayIcons[time];
                      return (
                        <button
                          key={time}
                          onClick={() => setCurrentEntry(prev => ({ ...prev, time }))}
                          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                            currentEntry.time === time
                              ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mood and Energy */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mood Rating: {currentEntry.moodRating}/10 {moodEmojis.find(m => m.value === currentEntry.moodRating)?.emoji}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEntry.moodRating}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, moodRating: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>😢 Very Sad</span>
                    <span>🚀 Amazing</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Energy Level: {currentEntry.energyLevel}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEntry.energyLevel}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>⚡ Exhausted</span>
                    <span>🔋 Energized</span>
                  </div>
                </div>
              </div>

              {/* Diary Questions */}
              <div className="space-y-6">
                {/* Question 1: How do I feel? */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Brain className="w-4 h-4" />
                    <span>🧠 1. How do I feel right now?</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Describe your mood, energy level, and emotions. Be honest.</p>
                  <textarea
                    value={currentEntry.mood}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: e.target.value }))}
                    placeholder="Example: I feel calm but a bit anxious about the upcoming test."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Question 2: What happened today? */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>📍 2. What happened today?</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Write the key moments of your day—events, conversations, or thoughts.</p>
                  <textarea
                    value={currentEntry.events}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, events: e.target.value }))}
                    placeholder="Example: I studied for 3 hours and had a great discussion with my friend about AI."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                {/* Question 3: What did I accomplish? */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Target className="w-4 h-4" />
                    <span>🎯 3. What did I accomplish today?</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">List your small and big wins. Productivity, creativity, relationships, etc.</p>
                  <textarea
                    value={currentEntry.accomplishments}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, accomplishments: e.target.value }))}
                    placeholder="Example: Finished Chapter 5 of Python programming. Helped my sister with her project."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Question 4: What challenged me? */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Frown className="w-4 h-4" />
                    <span>❓ 4. What challenged me today?</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Write about anything that frustrated you or didn't go as planned.</p>
                  <textarea
                    value={currentEntry.challenges}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, challenges: e.target.value }))}
                    placeholder="Example: I felt distracted in the afternoon. I couldn't focus during the lecture."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Question 5: What did I learn? */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Lightbulb className="w-4 h-4" />
                    <span>💡 5. What did I learn or realize?</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Write down lessons, inspirations, or even a quote you found meaningful.</p>
                  <textarea
                    value={currentEntry.learnings}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, learnings: e.target.value }))}
                    placeholder="Example: I learned that breaking tasks into 30-minute blocks keeps me more productive."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Question 6: What can I improve? */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Wrench className="w-4 h-4" />
                    <span>🛠️ 6. What can I improve tomorrow?</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Think of one small improvement you want to make.</p>
                  <textarea
                    value={currentEntry.improvements}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, improvements: e.target.value }))}
                    placeholder="Example: I'll try to keep my phone on silent during study hours."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Question 7: Free thoughts */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <PenTool className="w-4 h-4" />
                    <span>💭 7. Free Thoughts / Creative Space</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Sketch, doodle, write poems, story ideas, or just vent!</p>
                  <textarea
                    value={currentEntry.freeThoughts}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, freeThoughts: e.target.value }))}
                    placeholder="Let your creativity flow... Write anything that comes to mind! 🎨✨"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={5}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentEntry.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonTags.filter(tag => !currentEntry.tags?.includes(tag)).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={currentEntry.isPrivate}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                  🔒 Keep this entry private
                </label>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving your thoughts...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{editingEntry ? 'Update Entry' : 'Save Diary Entry'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* History Mode */
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your diary entries..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !filterTags.includes(e.target.value)) {
                      setFilterTags([...filterTags, e.target.value]);
                    }
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Add tag filter</option>
                  {commonTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {filterTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {filterTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => setFilterTags(filterTags.filter(t => t !== tag))}
                      className="text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Entries List */}
          <div className="space-y-6">
            {filteredEntries.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No diary entries found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || filterTags.length > 0 
                    ? 'Try adjusting your search or filters'
                    : 'Start writing your first diary entry to begin your journey of self-reflection'
                  }
                </p>
                <button
                  onClick={() => setViewMode('write')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Write First Entry
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const TimeIcon = timeOfDayIcons[entry.time];
                const moodEmoji = moodEmojis.find(m => m.value === entry.moodRating);
                
                return (
                  <div key={entry.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <TimeIcon className="w-5 h-5 text-gray-600" />
                          <span className="text-lg font-semibold text-gray-900">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <span className="text-2xl">{moodEmoji?.emoji}</span>
                        <span className="text-sm text-gray-600 capitalize">{entry.time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {entry.mood && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">🧠 How I felt:</h4>
                          <p className="text-gray-700 leading-relaxed">{entry.mood}</p>
                        </div>
                      )}

                      {entry.accomplishments && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">🎯 Accomplishments:</h4>
                          <p className="text-gray-700 leading-relaxed">{entry.accomplishments}</p>
                        </div>
                      )}

                      {entry.learnings && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">💡 Learnings:</h4>
                          <p className="text-gray-700 leading-relaxed">{entry.learnings}</p>
                        </div>
                      )}

                      {entry.freeThoughts && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">💭 Free thoughts:</h4>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{entry.freeThoughts}</p>
                        </div>
                      )}
                    </div>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Mood: {entry.moodRating}/10</span>
                        <span>Energy: {entry.energyLevel}/10</span>
                      </div>
                      <span>
                        {entry.isPrivate && '🔒 Private'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Diary Writing Tips</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">✨ Make it a Habit</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Write at the same time each day</li>
              <li>• Start with just 5 minutes</li>
              <li>• Don't worry about perfect grammar</li>
              <li>• Be honest with yourself</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Benefits of Journaling</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Reduces stress and anxiety</li>
              <li>• Improves self-awareness</li>
              <li>• Tracks personal growth</li>
              <li>• Enhances problem-solving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDiary;