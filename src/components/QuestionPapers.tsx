import React, { useState } from 'react';
import { Search, Filter, Download, Play, FileText, Calendar, Globe, BookOpen, GraduationCap, Award, Clock, Star, Eye, ExternalLink, ChevronDown, Grid, List, Users, Target } from 'lucide-react';

interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  exam: string;
  year: string;
  class?: string;
  language: string;
  type: 'solved' | 'unsolved';
  difficulty: 'easy' | 'medium' | 'tough';
  pdfUrl?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration?: string;
  views?: string;
  rating: number;
  description: string;
  tags: string[];
  uploadDate: string;
  hasVoiceExplanation: boolean;
  board?: string;
  category: 'school' | 'college' | 'competitive';
}

const QuestionPapers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Comprehensive subject categories
  const subjectCategories = {
    'Science & Math': {
      icon: '🧮',
      subjects: ['Mathematics (Basic)', 'Mathematics (Advanced)', 'Physics', 'Chemistry', 'Biology', 'Environmental Science']
    },
    'Arts & Humanities': {
      icon: '🖊️',
      subjects: ['History', 'Political Science', 'Geography', 'Economics', 'Sociology', 'Psychology', 'Civics']
    },
    'Technical / Computer': {
      icon: '💻',
      subjects: ['Computer Science', 'Information Technology', 'C Programming', 'Python', 'Java', 'AI & ML', 'DBMS', 'Operating Systems', 'Computer Networks', 'Data Structures', 'Algorithms', 'Software Engineering']
    },
    'Engineering': {
      icon: '⚙️',
      subjects: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Aerospace', 'Biotechnology']
    },
    'Commerce': {
      icon: '📘',
      subjects: ['Business Studies', 'Accountancy', 'Economics', 'Entrepreneurship', 'Banking & Finance', 'Statistics']
    },
    'Languages': {
      icon: '📖',
      subjects: ['English', 'Hindi', 'Telugu', 'Kannada', 'Tamil', 'Bengali', 'Marathi', 'Urdu', 'Sanskrit']
    }
  };

  const examCategories = {
    'School Level': {
      icon: '🎓',
      exams: ['CBSE Class 10', 'CBSE Class 12', 'ICSE', 'ISC', 'AP Board', 'TS Board', 'TN Board', 'Karnataka Board', 'West Bengal Board', 'Maharashtra Board', 'UP Board', 'Bihar Board']
    },
    'College Level': {
      icon: '🏫',
      exams: ['B.Tech 1st Year', 'B.Tech 2nd Year', 'B.Tech 3rd Year', 'B.Tech 4th Year', 'B.Sc', 'B.Com', 'BA', 'Diploma', 'Polytechnic', 'M.Tech', 'M.Sc', 'MBA']
    },
    'Competitive Exams': {
      icon: '🧠',
      exams: ['UPSC Prelims', 'UPSC Mains', 'SSC CGL', 'SSC CHSL', 'SSC MTS', 'RRB Group D', 'RRB NTPC', 'JEE Main', 'JEE Advanced', 'NEET UG', 'GATE', 'CAT', 'MAT', 'NET/JRF', 'CTET', 'AP TET', 'TS TET', 'Group 1', 'Group 2', 'Group 3']
    }
  };

  const languages = [
    { code: 'all', name: 'All Languages', flag: '🌍' },
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'telugu', name: 'Telugu', flag: '🇮🇳' },
    { code: 'kannada', name: 'Kannada', flag: '🇮🇳' },
    { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
    { code: 'bengali', name: 'Bengali', flag: '🇮🇳' },
    { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
    { code: 'urdu', name: 'Urdu', flag: '🇮🇳' },
    { code: 'sanskrit', name: 'Sanskrit', flag: '🇮🇳' }
  ];

  const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

  // Sample question papers data
  const questionPapers: QuestionPaper[] = [
    {
      id: '1',
      title: '10th Class Mathematics 2023 AP Board Paper – Full Solution in Telugu',
      subject: 'Mathematics (Basic)',
      exam: 'AP Board',
      year: '2023',
      class: '10th',
      language: 'telugu',
      type: 'solved',
      difficulty: 'medium',
      pdfUrl: 'https://example.com/ap-math-2023.pdf',
      videoUrl: 'https://youtube.com/watch?v=example1',
      thumbnailUrl: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '2:45:30',
      views: '125K',
      rating: 4.8,
      description: 'Complete solution of AP Board 10th class mathematics paper 2023 with step-by-step explanations in Telugu.',
      tags: ['AP Board', '10th Class', 'Mathematics', 'Telugu', 'Solved'],
      uploadDate: '2023-04-15',
      hasVoiceExplanation: true,
      board: 'AP Board',
      category: 'school'
    },
    {
      id: '2',
      title: 'UPSC GS Mains 2023 Paper 2 – Explained in Hindi',
      subject: 'General Studies',
      exam: 'UPSC Mains',
      year: '2023',
      language: 'hindi',
      type: 'solved',
      difficulty: 'tough',
      pdfUrl: 'https://example.com/upsc-gs2-2023.pdf',
      videoUrl: 'https://youtube.com/watch?v=example2',
      thumbnailUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '4:32:15',
      views: '89K',
      rating: 4.9,
      description: 'Detailed analysis and solutions for UPSC Civil Services Mains 2023 General Studies Paper 2 in Hindi.',
      tags: ['UPSC', 'Mains', 'General Studies', 'Hindi', 'Civil Services'],
      uploadDate: '2023-10-20',
      hasVoiceExplanation: true,
      category: 'competitive'
    },
    {
      id: '3',
      title: 'B.Tech CSE DBMS Mid Exam 2022 – Solved Paper in English',
      subject: 'DBMS',
      exam: 'B.Tech 3rd Year',
      year: '2022',
      language: 'english',
      type: 'solved',
      difficulty: 'medium',
      pdfUrl: 'https://example.com/btech-dbms-2022.pdf',
      videoUrl: 'https://youtube.com/watch?v=example3',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '1:58:22',
      views: '67K',
      rating: 4.6,
      description: 'Complete solution of B.Tech CSE Database Management Systems mid-semester examination with explanations.',
      tags: ['B.Tech', 'CSE', 'DBMS', 'English', 'Mid Exam'],
      uploadDate: '2022-11-10',
      hasVoiceExplanation: true,
      category: 'college'
    },
    {
      id: '4',
      title: 'NEET 2023 Biology Paper with Explanations – English + Tamil',
      subject: 'Biology',
      exam: 'NEET UG',
      year: '2023',
      language: 'english',
      type: 'solved',
      difficulty: 'tough',
      pdfUrl: 'https://example.com/neet-bio-2023.pdf',
      videoUrl: 'https://youtube.com/watch?v=example4',
      thumbnailUrl: 'https://images.pexels.com/photos/8500/apple-desk-laptop-working.jpg?auto=compress&cs=tinysrgb&w=400',
      duration: '3:15:45',
      views: '156K',
      rating: 4.7,
      description: 'NEET 2023 Biology section solved with detailed explanations in both English and Tamil.',
      tags: ['NEET', 'Biology', 'English', 'Tamil', 'Medical Entrance'],
      uploadDate: '2023-05-08',
      hasVoiceExplanation: true,
      category: 'competitive'
    },
    {
      id: '5',
      title: 'JEE Advanced 2023 Physics Paper 1 – Complete Solution in Hindi',
      subject: 'Physics',
      exam: 'JEE Advanced',
      year: '2023',
      language: 'hindi',
      type: 'solved',
      difficulty: 'tough',
      pdfUrl: 'https://example.com/jee-adv-phy-2023.pdf',
      videoUrl: 'https://youtube.com/watch?v=example5',
      thumbnailUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '5:20:15',
      views: '234K',
      rating: 4.8,
      description: 'JEE Advanced 2023 Physics Paper 1 complete solution with concept explanations in Hindi.',
      tags: ['JEE Advanced', 'Physics', 'Hindi', 'Engineering Entrance'],
      uploadDate: '2023-06-12',
      hasVoiceExplanation: true,
      category: 'competitive'
    },
    {
      id: '6',
      title: '12th Chemistry CBSE 2023 Board Paper – Solved in English',
      subject: 'Chemistry',
      exam: 'CBSE Class 12',
      year: '2023',
      class: '12th',
      language: 'english',
      type: 'solved',
      difficulty: 'medium',
      pdfUrl: 'https://example.com/cbse-chem-2023.pdf',
      videoUrl: 'https://youtube.com/watch?v=example6',
      thumbnailUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '2:30:45',
      views: '98K',
      rating: 4.5,
      description: 'CBSE Class 12 Chemistry board examination 2023 complete solution with organic and inorganic concepts.',
      tags: ['CBSE', '12th Class', 'Chemistry', 'English', 'Board Exam'],
      uploadDate: '2023-03-25',
      hasVoiceExplanation: true,
      board: 'CBSE',
      category: 'school'
    }
  ];

  // Filter papers based on selected criteria
  const filteredPapers = questionPapers.filter(paper => {
    const matchesSearch = searchQuery === '' || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    const matchesExam = selectedExam === 'all' || paper.exam === selectedExam;
    const matchesYear = selectedYear === 'all' || paper.year === selectedYear;
    const matchesLanguage = selectedLanguage === 'all' || paper.language === selectedLanguage;
    const matchesType = selectedType === 'all' || paper.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || paper.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    
    return matchesSearch && matchesSubject && matchesExam && matchesYear && 
           matchesLanguage && matchesType && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'tough': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'school': return 'bg-blue-100 text-blue-700';
      case 'college': return 'bg-purple-100 text-purple-700';
      case 'competitive': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'solved' ? <Eye className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Previous Year Question Papers 📄</h1>
            <p className="text-emerald-100 text-lg">Solved & unsolved papers for school, college & competitive exams in multiple languages</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Total Papers</span>
            </div>
            <div className="text-2xl font-bold">500+</div>
            <div className="text-emerald-100 text-sm">Question papers</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Subjects</span>
            </div>
            <div className="text-2xl font-bold">50+</div>
            <div className="text-emerald-100 text-sm">All subjects covered</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">Languages</span>
            </div>
            <div className="text-2xl font-bold">{languages.length - 1}</div>
            <div className="text-emerald-100 text-sm">Indian languages</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Exams</span>
            </div>
            <div className="text-2xl font-bold">30+</div>
            <div className="text-emerald-100 text-sm">Major exams</div>
          </div>
        </div>
      </div>

      {/* Subject Categories */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Subject Category</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(subjectCategories).map(([category, data]) => (
            <div key={category} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{data.icon}</span>
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </div>
              <div className="space-y-1">
                {data.subjects.slice(0, 4).map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubject(subject)}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    • {subject}
                  </button>
                ))}
                {data.subjects.length > 4 && (
                  <p className="text-xs text-gray-500">+{data.subjects.length - 4} more subjects</p>
                )}
              </div>
            </div>
          ))}
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
              placeholder="Search question papers by subject, exam, year, or keywords..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredPapers.length} papers
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="school">School Level</option>
                  <option value="college">College Level</option>
                  <option value="competitive">Competitive Exams</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {Object.values(subjectCategories).flatMap(cat => cat.subjects).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="solved">Solved Papers</option>
                  <option value="unsolved">Unsolved Papers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="tough">Tough</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Exams</option>
                  {Object.values(examCategories).flatMap(cat => cat.exams).map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question Papers Grid/List */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Question Papers</h2>
          <div className="text-sm text-gray-600">
            {filteredPapers.length} papers found
          </div>
        </div>

        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No question papers found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredPapers.map(paper => (
              <div key={paper.id} className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 ${viewMode === 'list' ? 'flex space-x-4' : ''}`}>
                {/* Thumbnail */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img
                    src={paper.thumbnailUrl}
                    alt={paper.title}
                    className={`object-cover ${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'}`}
                  />
                  {paper.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {paper.duration}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getDifficultyColor(paper.difficulty)}`}>
                      {paper.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(paper.category)}`}>
                      {paper.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold text-gray-900 leading-tight line-clamp-2 ${viewMode === 'list' ? 'text-base' : 'text-lg'}`}>
                      {paper.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      paper.type === 'solved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {getTypeIcon(paper.type)}
                      <span className="ml-1">{paper.type}</span>
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {paper.year}
                    </span>
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                      {languages.find(l => l.code === paper.language)?.flag} {languages.find(l => l.code === paper.language)?.name}
                    </span>
                  </div>

                  <p className={`text-gray-600 mb-3 line-clamp-2 ${viewMode === 'list' ? 'text-sm' : ''}`}>
                    {paper.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    {paper.views && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{paper.views} views</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{paper.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{paper.exam}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{paper.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {paper.hasVoiceExplanation && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          🎧 Voice
                        </span>
                      )}
                      {paper.pdfUrl && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          📄 PDF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {paper.videoUrl && (
                      <a
                        href={paper.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Watch Video</span>
                      </a>
                    )}
                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Categories */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Exam Category</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(examCategories).map(([category, data]) => (
            <div key={category} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{data.icon}</span>
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {data.exams.map((exam, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedExam(exam)}
                    className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    • {exam}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Our Question Papers?</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Coverage</h3>
            <p className="text-gray-600 text-sm">All major exams, subjects, and years covered with detailed solutions</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Languages</h3>
            <p className="text-gray-600 text-sm">Content available in 9+ Indian languages with voice explanations</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Video Solutions</h3>
            <p className="text-gray-600 text-sm">Step-by-step video explanations with timestamps and PDF downloads</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Exam-Specific</h3>
            <p className="text-gray-600 text-sm">Tailored content for CBSE, state boards, JEE, NEET, UPSC, and more</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPapers;