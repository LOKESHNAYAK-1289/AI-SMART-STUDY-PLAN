import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TopicTracker from './components/TopicTracker';
import GapsDetector from './components/GapsDetector';
import UserProfile from './components/UserProfile';
import SearchBooks from './components/SearchBooks';
import MockTest from './components/MockTest';
import MoodTracker from './components/MoodTracker';
import StudyPlanCalendar from './components/StudyPlanCalendar';
import ResumeBuilder from './components/ResumeBuilder';
import YouTubeLibrary from './components/YouTubeLibrary';
import DailyDiary from './components/DailyDiary';
import InterviewQuestions from './components/InterviewQuestions';
import QuestionPapers from './components/QuestionPapers';
import WebinarRegistration from './components/WebinarRegistration';
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
      case 'interview-questions':
        return <InterviewQuestions />;
      case 'question-papers':
        return <QuestionPapers />;
      case 'webinar':
        return <WebinarRegistration />;
      case 'profile':
        return <UserProfile />;
      case 'mood':
        return <MoodTracker />;
      case 'planner':
        return <StudyPlanCalendar />;
      case 'youtube':
        return (
          <ErrorBoundary>
            <YouTubeLibrary />
          </ErrorBoundary>
        );
      case 'diary':
        return <DailyDiary />;
      case 'resume':
        return <ResumeBuilder />;
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