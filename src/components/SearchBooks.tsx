import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, Download, Eye, Star, User, Calendar, AlertCircle, Loader, Filter, Grid, List } from 'lucide-react';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
  language?: string[];
  edition_count?: number;
  publish_year?: number[];
  ia?: string[];
  has_fulltext?: boolean;
  public_scan_b?: boolean;
}

interface SearchFilters {
  subject: string;
  language: string;
  publishYear: string;
  hasFulltext: boolean;
}

const SearchBooks: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    subject: '',
    language: '',
    publishYear: '',
    hasFulltext: false
  });

  const booksPerPage = 20;

  const searchBooks = async (page = 1, resetResults = true) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    if (resetResults) {
      setHasSearched(true);
      setCurrentPage(1);
    }

    try {
      // Build search query with filters
      let searchQuery = encodeURIComponent(query.trim());
      
      // Add filters to query
      const queryParams = [];
      if (filters.subject) queryParams.push(`subject:"${filters.subject}"`);
      if (filters.language) queryParams.push(`language:${filters.language}`);
      if (filters.publishYear) queryParams.push(`publish_year:${filters.publishYear}`);
      if (filters.hasFulltext) queryParams.push('has_fulltext:true');
      
      if (queryParams.length > 0) {
        searchQuery += ' AND ' + queryParams.join(' AND ');
      }

      const offset = (page - 1) * booksPerPage;
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${searchQuery}&limit=${booksPerPage}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,isbn,subject,ratings_average,ratings_count,language,edition_count,publish_year,ia,has_fulltext,public_scan_b`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (resetResults) {
        setBooks(data.docs || []);
        setTotalFound(data.numFound || 0);
      } else {
        setBooks(prev => [...prev, ...(data.docs || [])]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search books. Please try again.');
      if (resetResults) {
        setBooks([]);
        setTotalFound(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBooks = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchBooks(nextPage, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchBooks();
    }
  };

  const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M') => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  };

  const getReadOnlineUrl = (key: string) => {
    return `https://openlibrary.org${key}`;
  };

  const getArchiveUrl = (ia: string[]) => {
    if (ia && ia.length > 0) {
      return `https://archive.org/details/${ia[0]}`;
    }
    return null;
  };

  const formatAuthors = (authors: string[]) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(' & ');
    return `${authors[0]} & ${authors.length - 1} others`;
  };

  const formatPublishYears = (years: number[]) => {
    if (!years || years.length === 0) return '';
    const sortedYears = [...years].sort((a, b) => a - b);
    if (sortedYears.length === 1) return sortedYears[0].toString();
    return `${sortedYears[0]} - ${sortedYears[sortedYears.length - 1]}`;
  };

  const popularSearches = [
    'machine learning',
    'python programming',
    'data science',
    'javascript',
    'artificial intelligence',
    'computer science',
    'mathematics',
    'physics',
    'chemistry',
    'biology',
    'history',
    'literature',
    'philosophy',
    'economics',
    'psychology'
  ];

  const commonSubjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Literature',
    'Philosophy',
    'Economics',
    'Psychology',
    'Engineering',
    'Medicine',
    'Law',
    'Business',
    'Art'
  ];

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fre', name: 'French' },
    { code: 'ger', name: 'German' },
    { code: 'ita', name: 'Italian' },
    { code: 'por', name: 'Portuguese' },
    { code: 'rus', name: 'Russian' },
    { code: 'chi', name: 'Chinese' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'ara', name: 'Arabic' }
  ];

  const hasMoreBooks = books.length < totalFound;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <BookOpen className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">Open Library Search 📚</h1>
            <p className="text-green-100 text-lg">Access millions of books from the world's largest digital library</p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-6 text-sm">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="font-semibold">📖 20M+ Books</div>
            <div className="text-green-100">Complete collection</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="font-semibold">🆓 Free Access</div>
            <div className="text-green-100">Public domain works</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="font-semibold">🌍 Global Library</div>
            <div className="text-green-100">Multiple languages</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="font-semibold">📱 Any Device</div>
            <div className="text-green-100">Read anywhere</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Search the World's Largest Digital Library
          </h2>
          
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for books, authors, subjects... (e.g., 'machine learning', 'Jane Austen', 'calculus')"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Search Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => searchBooks()}
                disabled={!query.trim() || loading}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search Books</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {hasSearched && (
                <div className="flex items-center space-x-2">
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
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Advanced Filters</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={filters.subject}
                      onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Subjects</option>
                      {commonSubjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={filters.language}
                      onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Languages</option>
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publish Year</label>
                    <input
                      type="number"
                      value={filters.publishYear}
                      onChange={(e) => setFilters(prev => ({ ...prev, publishYear: e.target.value }))}
                      placeholder="e.g., 2020"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasFulltext"
                      checked={filters.hasFulltext}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasFulltext: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="hasFulltext" className="text-sm font-medium text-gray-700">
                      Full text available
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => searchBooks()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setFilters({ subject: '', language: '', publishYear: '', hasFulltext: false });
                      if (query.trim()) searchBooks();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Search Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !loading && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Search Results
            </h2>
            <div className="text-sm text-gray-600">
              {totalFound > 0 ? (
                <>
                  Showing {books.length} of {totalFound.toLocaleString()} books
                  {query && ` for "${query}"`}
                </>
              ) : (
                'No results found'
              )}
            </div>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Found</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find any books matching your search criteria.
              </p>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Search tips:</p>
                <ul className="text-left inline-block space-y-1">
                  <li>• Try broader terms (e.g., "programming" instead of "advanced python programming")</li>
                  <li>• Check spelling and try alternative spellings</li>
                  <li>• Use author's last name only</li>
                  <li>• Try searching by subject area</li>
                  <li>• Remove filters to see more results</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {books.map((book, index) => (
                  <div key={`${book.key}-${index}`} className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 ${viewMode === 'list' ? 'flex space-x-4' : ''}`}>
                    {/* Book Cover */}
                    <div className={`flex justify-center ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                      {book.cover_i ? (
                        <img
                          src={getCoverUrl(book.cover_i, viewMode === 'list' ? 'S' : 'M')}
                          alt={`Cover of ${book.title}`}
                          className={`object-cover rounded-lg shadow-md ${viewMode === 'list' ? 'w-16 h-20' : 'w-24 h-32'}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-md flex items-center justify-center ${viewMode === 'list' ? 'w-16 h-20' : 'w-24 h-32'} ${book.cover_i ? 'hidden' : ''}`}>
                        <BookOpen className={`text-gray-500 ${viewMode === 'list' ? 'w-6 h-6' : 'w-8 h-8'}`} />
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div>
                        <h3 className={`font-bold text-gray-900 leading-tight line-clamp-2 mb-2 ${viewMode === 'list' ? 'text-base' : 'text-lg'}`}>
                          📘 {book.title}
                        </h3>
                        
                        <div className={`flex items-center space-x-2 text-gray-600 mb-2 ${viewMode === 'list' ? 'text-xs' : 'text-sm'}`}>
                          <User className="w-4 h-4" />
                          <span className="line-clamp-1">
                            ✍️ {formatAuthors(book.author_name || [])}
                          </span>
                        </div>

                        <div className={`flex flex-wrap gap-2 ${viewMode === 'list' ? 'text-xs' : 'text-sm'} text-gray-600`}>
                          {book.first_publish_year && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{book.first_publish_year}</span>
                            </div>
                          )}

                          {book.edition_count && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              {book.edition_count} editions
                            </span>
                          )}

                          {book.has_fulltext && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              📖 Full text
                            </span>
                          )}

                          {book.ratings_average && book.ratings_count && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{book.ratings_average.toFixed(1)} ({book.ratings_count})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subjects */}
                      {book.subject && book.subject.length > 0 && viewMode === 'grid' && (
                        <div>
                          <div className="flex flex-wrap gap-1">
                            {book.subject.slice(0, 3).map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {subject}
                              </span>
                            ))}
                            {book.subject.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{book.subject.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className={`space-y-2 pt-3 border-t border-gray-100 ${viewMode === 'list' ? 'flex space-y-0 space-x-2' : ''}`}>
                        <a
                          href={getReadOnlineUrl(book.key)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 ${viewMode === 'list' ? 'text-xs' : ''}`}
                        >
                          <Eye className="w-4 h-4" />
                          <span>📖 View Details</span>
                        </a>
                        
                        {book.ia && book.ia.length > 0 && (
                          <a
                            href={getArchiveUrl(book.ia)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 ${viewMode === 'list' ? 'text-xs' : ''}`}
                          >
                            <Download className="w-4 h-4" />
                            <span>📥 Read/Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreBooks && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreBooks}
                    disabled={loading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-5 h-5" />
                        <span>Load More Books ({totalFound - books.length} remaining)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How Open Library Search Works</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Search</h3>
            <p className="text-gray-600 text-sm">Search 20+ million books by title, author, subject, or ISBN</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Filter</h3>
            <p className="text-gray-600 text-sm">Use advanced filters for language, subject, year, and availability</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Preview</h3>
            <p className="text-gray-600 text-sm">View book details, ratings, and check availability</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibent text-gray-900 mb-2">4. Read</h3>
            <p className="text-gray-600 text-sm">Access full text online or download from Internet Archive</p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">About Open Library</h4>
                <p className="text-blue-700 text-sm">
                  Open Library is a project of the Internet Archive, providing access to millions of books. 
                  Many books are freely available to read online, while others may require borrowing.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <Download className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Free & Legal Access</h4>
                <p className="text-green-700 text-sm">
                  All books are legally available through Open Library and Internet Archive. 
                  Public domain works are freely downloadable, while copyrighted works can be borrowed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBooks;