import React from 'react';
import { Book, Menu, X, Zap } from 'lucide-react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
    { id: 'topics' as Page, label: 'Topics', icon: '📚' },
    { id: 'gaps' as Page, label: 'Ask Me', icon: '🤔' },
    { id: 'books' as Page, label: 'Books', icon: '📖' },
    { id: 'mocktest' as Page, label: 'Mock Test', icon: '📝' },
    { id: 'interview-questions' as Page, label: 'Interview Q&A', icon: '💼' },
    { id: 'planner' as Page, label: 'Study Plan', icon: '📅' },
    { id: 'question-papers' as Page, label: 'Question Papers', icon: '📄' },
    { id: 'youtube' as Page, label: 'YouTube', icon: '📺' },
    { id: 'webinar' as Page, label: 'Webinar', icon: '🎥' },
    { id: 'resume' as Page, label: 'Resume', icon: '📄' },
    { id: 'diary' as Page, label: 'Diary', icon: '📖' },
    { id: 'mood' as Page, label: 'Mood', icon: '💝' },
    { id: 'profile' as Page, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Book className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">AI Smart Study Plan</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer - Built with Bolt */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <span className="text-sm text-gray-600">© 2024 AI Smart Study Plan. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;