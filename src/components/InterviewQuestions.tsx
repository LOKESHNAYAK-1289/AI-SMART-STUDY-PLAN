import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Code, Brain, Star, Clock, ChevronDown, ChevronUp, Eye, EyeOff, Copy, Check, Lightbulb, Target, Zap, FileText, Users, Award } from 'lucide-react';
import { interviewQuestions, InterviewQuestion } from '../data/interviewQuestions';

const InterviewQuestions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [showAnswers, setShowAnswers] = useState<Set<string>>(new Set());
  const [copiedQuestions, setCopiedQuestions] = useState<Set<string>>(new Set());
  const [favoriteQuestions, setFavoriteQuestions] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);

  const languages = ['all', 'Python', 'Java', 'C++', 'JavaScript', 'C#', 'Go', 'Rust', 'PHP', 'TypeScript', 'Kotlin', 'SQL', 'HTML/CSS'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];
  const types = ['all', 'MCQ', 'Coding', 'Theory'];
  const categories = ['all', 'Data Structures', 'Algorithms', 'OOP', 'System Design', 'Database', 'Web Development', 'Debugging', 'Best Practices'];

  const filteredQuestions = interviewQuestions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLanguage = selectedLanguage === 'all' || question.language === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || question.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    
    return matchesSearch && matchesLanguage && matchesDifficulty && matchesType && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + questionsPerPage);

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleAnswer = (questionId: string) => {
    const newShowAnswers = new Set(showAnswers);
    if (newShowAnswers.has(questionId)) {
      newShowAnswers.delete(questionId);
    } else {
      newShowAnswers.add(questionId);
    }
    setShowAnswers(newShowAnswers);
  };

  const copyQuestion = async (question: InterviewQuestion) => {
    const text = `Question: ${question.question}\n\nAnswer: ${question.answer}\n\nExplanation: ${question.explanation}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedQuestions(new Set([...copiedQuestions, question.id]));
      setTimeout(() => {
        setCopiedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(question.id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleFavorite = (questionId: string) => {
    const newFavorites = new Set(favoriteQuestions);
    if (newFavorites.has(questionId)) {
      newFavorites.delete(questionId);
    } else {
      newFavorites.add(questionId);
    }
    setFavoriteQuestions(newFavorites);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return <Target className="w-4 h-4" />;
      case 'Coding': return <Code className="w-4 h-4" />;
      case 'Theory': return <Brain className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFrequencyColor = (frequency?: string) => {
    switch (frequency) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Interview Questions Bank 💼</h1>
            <p className="text-indigo-100 text-lg">Comprehensive collection of programming interview questions from top companies</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Total Questions</span>
            </div>
            <div className="text-2xl font-bold">{interviewQuestions.length}</div>
            <div className="text-indigo-100 text-sm">Curated questions</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Companies</span>
            </div>
            <div className="text-2xl font-bold">10+</div>
            <div className="text-indigo-100 text-sm">Top tech companies</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-5 h-5" />
              <span className="font-semibold">Languages</span>
            </div>
            <div className="text-2xl font-bold">{languages.length - 1}</div>
            <div className="text-indigo-100 text-sm">Programming languages</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Favorites</span>
            </div>
            <div className="text-2xl font-bold">{favoriteQuestions.size}</div>
            <div className="text-indigo-100 text-sm">Saved questions</div>
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search questions, answers, explanations, or tags..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div className="text-sm text-gray-600">
              Showing {filteredQuestions.length} of {interviewQuestions.length} questions
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang === 'all' ? 'All Languages' : lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>
                      {diff === 'all' ? 'All Difficulties' : diff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {paginatedQuestions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          paginatedQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              {/* Question Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(question.type)}
                      <span className="font-semibold text-gray-900">{question.language}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {question.type}
                    </span>
                    {question.category && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {question.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {question.frequency && (
                      <div className="flex items-center space-x-1">
                        <Zap className={`w-4 h-4 ${getFrequencyColor(question.frequency)}`} />
                        <span className={`text-sm font-medium ${getFrequencyColor(question.frequency)}`}>
                          {question.frequency}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(question.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favoriteQuestions.has(question.id)
                          ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${favoriteQuestions.has(question.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => copyQuestion(question)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {copiedQuestions.has(question.id) ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
                  {question.question}
                </h3>

                {/* Company and Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {question.company && (
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">{question.company}</span>
                      </div>
                    )}
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {question.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                        {question.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{question.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpanded(question.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {expandedQuestions.has(question.id) ? 'Show Less' : 'Show More'}
                    </span>
                    {expandedQuestions.has(question.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedQuestions.has(question.id) && (
                <div className="p-6 space-y-6">
                  {/* MCQ Options */}
                  {question.type === 'MCQ' && question.options && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Options:</h4>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              showAnswers.has(question.id) && option === question.answer
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                            {showAnswers.has(question.id) && option === question.answer && (
                              <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Answer Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Answer:</h4>
                      <button
                        onClick={() => toggleAnswer(question.id)}
                        className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {showAnswers.has(question.id) ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Hide Answer</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Show Answer</span>
                          </>
                        )}
                      </button>
                    </div>

                    {showAnswers.has(question.id) && (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-green-800 font-mono text-sm">
                            {question.answer}
                          </pre>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="font-medium text-blue-800 mb-1">Explanation:</h5>
                              <p className="text-blue-700 text-sm leading-relaxed">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + questionsPerPage, filteredQuestions.length)} of {filteredQuestions.length} questions
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-3 py-2">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Interview Preparation Tips</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">📚 Study Strategy</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Start with easy questions to build confidence</li>
              <li>• Focus on understanding concepts, not memorizing</li>
              <li>• Practice coding questions on a whiteboard</li>
              <li>• Review your favorite questions regularly</li>
              <li>• Time yourself when solving problems</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">🎯 Interview Day</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Think out loud while solving problems</li>
              <li>• Ask clarifying questions before coding</li>
              <li>• Start with a brute force solution, then optimize</li>
              <li>• Test your code with examples</li>
              <li>• Discuss time and space complexity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestions;