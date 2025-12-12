import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TopicTracker from './components/TopicTracker';
import GapsDetector from './components/GapsDetector';
import UserProfile from './components/UserProfile';
import SearchBooks from './components/SearchBooks';
import MockTest from './components/MockTest';
import MoodTracker from './components/MoodTracker';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleNavigate = (page: Page) => {
    console.log('Navigating to page:', page);
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
      case 'dashboard':
        return <Dashboard />;
      case 'topics':
        return <TopicTracker />;
      case 'gaps':
        return <GapsDetector />;
      case 'books':
        return <SearchBooks />;
      case 'mocktest':
        return <MockTest />;
      case 'profile':
        return <UserProfile />;
      case 'mood':
        return <MoodTracker />;
      case 'planner':
        return (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Study Plan Generator</h1>
            <p className="text-gray-600">Coming soon! Generate personalized 7-day study plans.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={handleNavigate} 
      isAuthenticated={true}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;