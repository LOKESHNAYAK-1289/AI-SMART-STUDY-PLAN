import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock, ExternalLink, ArrowLeft, Star, TrendingUp } from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  hours: number;
  completed: boolean;
  resourceLink?: string;
  resourceTitle?: string;
}

interface DayPlan {
  date: string;
  dayName: string;
  sessions: StudySession[];
}

interface WeekPlan {
  weekStart: Date;
  days: DayPlan[];
}

const StudyPlanCalendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, -1 = previous, 1 = next
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  // Subject color mapping
  const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-blue-100 text-blue-800 border-blue-300',
    'Physics': 'bg-green-100 text-green-800 border-green-300',
    'Chemistry': 'bg-red-100 text-red-800 border-red-300',
    'Computer Science': 'bg-purple-100 text-purple-800 border-purple-300',
    'Biology': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'English': 'bg-pink-100 text-pink-800 border-pink-300',
    'History': 'bg-orange-100 text-orange-800 border-orange-300',
    'Economics': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };

  // Motivational quotes
  const quotes = [
    "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "Learning never exhausts the mind. - Leonardo da Vinci",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    "Study hard what interests you the most in the most undisciplined, irreverent way. - Richard Feynman",
    "Intelligence plus character—that is the goal of true education. - Martin Luther King Jr.",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss"
  ];

  useEffect(() => {
    // Set random motivational quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationalQuote(randomQuote);

    // Generate week plan
    generateWeekPlan();
  }, [currentWeek]);

  const generateWeekPlan = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7)); // Start from Monday

    const days: DayPlan[] = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dayPlan: DayPlan = {
        date: date.toISOString().split('T')[0],
        dayName: dayNames[i],
        sessions: generateDaySessions(i)
      };
      
      days.push(dayPlan);
    }

    setWeekPlan({
      weekStart,
      days
    });
  };

  const generateDaySessions = (dayIndex: number): StudySession[] => {
    // Sample study plan data - in real app, this would come from AI/backend
    const weeklyPlan = [
      // Monday
      [
        { subject: 'Mathematics', hours: 2, resourceTitle: 'Calculus Fundamentals', resourceLink: 'https://youtube.com/watch?v=example1' },
        { subject: 'Physics', hours: 1.5, resourceTitle: 'Newton\'s Laws', resourceLink: 'https://youtube.com/watch?v=example2' }
      ],
      // Tuesday
      [
        { subject: 'Chemistry', hours: 2, resourceTitle: 'Organic Chemistry Basics', resourceLink: 'https://youtube.com/watch?v=example3' },
        { subject: 'Computer Science', hours: 1, resourceTitle: 'Data Structures', resourceLink: 'https://youtube.com/watch?v=example4' }
      ],
      // Wednesday
      [
        { subject: 'Biology', hours: 1.5, resourceTitle: 'Cell Biology', resourceLink: 'https://youtube.com/watch?v=example5' }
      ],
      // Thursday
      [
        { subject: 'Physics', hours: 2, resourceTitle: 'Thermodynamics', resourceLink: 'https://youtube.com/watch?v=example6' },
        { subject: 'Mathematics', hours: 1, resourceTitle: 'Linear Algebra', resourceLink: 'https://youtube.com/watch?v=example7' }
      ],
      // Friday
      [
        { subject: 'Mathematics', hours: 1.5, resourceTitle: 'Statistics', resourceLink: 'https://youtube.com/watch?v=example8' },
        { subject: 'English', hours: 1, resourceTitle: 'Essay Writing', resourceLink: 'https://youtube.com/watch?v=example9' }
      ],
      // Saturday
      [], // Break day
      // Sunday
      [
        { subject: 'Biology', hours: 1.5, resourceTitle: 'Genetics Review', resourceLink: 'https://youtube.com/watch?v=example10' },
        { subject: 'History', hours: 1, resourceTitle: 'World War II', resourceLink: 'https://youtube.com/watch?v=example11' }
      ]
    ];

    const daySessions = weeklyPlan[dayIndex] || [];
    return daySessions.map((session, index) => ({
      id: `${dayIndex}-${index}`,
      subject: session.subject,
      hours: session.hours,
      completed: Math.random() > 0.6, // Random completion for demo
      resourceTitle: session.resourceTitle,
      resourceLink: session.resourceLink
    }));
  };

  const toggleSessionCompletion = (dayIndex: number, sessionId: string) => {
    if (!weekPlan) return;

    const updatedWeekPlan = { ...weekPlan };
    const session = updatedWeekPlan.days[dayIndex].sessions.find(s => s.id === sessionId);
    if (session) {
      session.completed = !session.completed;
      setWeekPlan(updatedWeekPlan);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const getWeekDateRange = () => {
    if (!weekPlan) return '';
    
    const weekEnd = new Date(weekPlan.weekStart);
    weekEnd.setDate(weekPlan.weekStart.getDate() + 6);
    
    return `${weekPlan.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getProgressStats = () => {
    if (!weekPlan) return { completed: 0, total: 0, totalHours: 0, completedHours: 0 };

    let completed = 0;
    let total = 0;
    let totalHours = 0;
    let completedHours = 0;

    weekPlan.days.forEach(day => {
      day.sessions.forEach(session => {
        total++;
        totalHours += session.hours;
        if (session.completed) {
          completed++;
          completedHours += session.hours;
        }
      });
    });

    return { completed, total, totalHours, completedHours };
  };

  const stats = getProgressStats();

  if (!weekPlan) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your study plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Motivational Quote */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <Calendar className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">Your AI Smart Study Plan 📅</h1>
            <p className="text-indigo-100 text-lg">AI-powered weekly study schedule tailored for you</p>
          </div>
        </div>
        
        {/* Motivational Quote of the Day */}
        <div className="bg-white bg-opacity-20 rounded-lg p-6 border border-white border-opacity-30">
          <div className="flex items-start space-x-3">
            <Star className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2">💫 Quote of the Day</h3>
              <p className="text-indigo-100 italic leading-relaxed">{motivationalQuote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Week</span>
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{getWeekDateRange()}</h2>
              <p className="text-sm text-gray-600">
                {currentWeek === 0 ? 'Current Week' : 
                 currentWeek < 0 ? `${Math.abs(currentWeek)} week${Math.abs(currentWeek) > 1 ? 's' : ''} ago` :
                 `${currentWeek} week${currentWeek > 1 ? 's' : ''} ahead`}
              </p>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span>Next Week</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Sessions</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.completed}/{stats.total}</p>
            <p className="text-sm text-blue-600">Completed</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Study Hours</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.completedHours.toFixed(1)}/{stats.totalHours.toFixed(1)}</p>
            <p className="text-sm text-green-600">Hours Done</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Progress</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
            <p className="text-sm text-purple-600">Complete</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Active Days</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{weekPlan.days.filter(day => day.sessions.length > 0).length}/7</p>
            <p className="text-sm text-orange-600">Study Days</p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekPlan.days.map((day, dayIndex) => (
            <div key={day.date} className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              {/* Day Header */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-gray-900">{day.dayName}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Study Sessions */}
              <div className="space-y-3">
                {day.sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-sm text-gray-500 font-medium">Break Day</p>
                    <p className="text-xs text-gray-400">Rest & Recharge</p>
                  </div>
                ) : (
                  day.sessions.map((session) => (
                    <div key={session.id} className="space-y-2">
                      {/* Subject Tag */}
                      <div className={`px-3 py-2 rounded-lg border-2 ${subjectColors[session.subject] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{session.subject}</span>
                          <button
                            onClick={() => toggleSessionCompletion(dayIndex, session.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              session.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-400 hover:border-green-500'
                            }`}
                          >
                            {session.completed && <CheckCircle className="w-3 h-3" />}
                          </button>
                        </div>
                        
                        {/* Hours */}
                        <div className="flex items-center space-x-1 mb-2">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{session.hours}h</span>
                        </div>

                        {/* Resource Link */}
                        {session.resourceLink && (
                          <a
                            href={session.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-xs hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate">{session.resourceTitle}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Legend */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Subject Color Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(subjectColors).map(([subject, colorClass]) => (
            <div key={subject} className={`px-3 py-2 rounded-lg border-2 ${colorClass} text-center`}>
              <span className="font-medium text-sm">{subject}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default StudyPlanCalendar;