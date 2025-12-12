import React, { useState } from 'react';
import { Smile, Frown, Meh, Zap, CloudRain, Sun, Heart, Brain, Calendar, TrendingUp, AlertCircle, CheckCircle, Coffee, Bed, Activity, BookOpen, Clock, Target } from 'lucide-react';
import FaceDetection from './FaceDetection';

interface MoodEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed';
  study_hours: number;
  notes?: string;
  energy_level: number;
  motivation_level: number;
  stress_factors: string[];
}

interface StudyAdjustment {
  originalHours: number;
  adjustedHours: number;
  adjustmentReason: string;
  recommendations: string[];
  restActivities: string[];
  studyApproach: string;
  breakFrequency: string;
}

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed' | null>('good');
  const [studyHours, setStudyHours] = useState(3);
  const [notes, setNotes] = useState('');
  const [energyLevel, setEnergyLevel] = useState(7);
  const [motivationLevel, setMotivationLevel] = useState(8);
  const [stressFactors, setStressFactors] = useState<string[]>(['Upcoming exams']);
  const [loading, setSaving] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState(false);
  const [studyAdjustment, setStudyAdjustment] = useState<StudyAdjustment | null>(null);

  const handleMoodDetectedFromFace = (detectedMood: string) => {
    // Map detected mood to our mood system
    const moodMap: Record<string, 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed'> = {
      'great': 'great',
      'good': 'good',
      'okay': 'okay',
      'stressed': 'stressed',
      'overwhelmed': 'overwhelmed'
    };
    
    const mappedMood = moodMap[detectedMood] || 'okay';
    setSelectedMood(mappedMood);
  };

  // Mock mood history
  const moodHistory = [
    { id: '1', date: '2024-01-20', mood: 'good' as const, study_hours: 3, energy_level: 7, motivation_level: 8, stress_factors: [] },
    { id: '2', date: '2024-01-19', mood: 'great' as const, study_hours: 4, energy_level: 9, motivation_level: 9, stress_factors: [] },
    { id: '3', date: '2024-01-18', mood: 'okay' as const, study_hours: 2, energy_level: 5, motivation_level: 6, stress_factors: ['Heavy workload'] },
    { id: '4', date: '2024-01-17', mood: 'stressed' as const, study_hours: 1, energy_level: 4, motivation_level: 4, stress_factors: ['Upcoming exams', 'Time pressure'] },
  ];

  const moods = [
    { 
      value: 'great' as const, 
      label: 'Great', 
      icon: Sun, 
      color: 'text-yellow-500 bg-yellow-100 border-yellow-300',
      description: 'Feeling amazing and ready to tackle anything!'
    },
    { 
      value: 'good' as const, 
      label: 'Good', 
      icon: Smile, 
      color: 'text-green-500 bg-green-100 border-green-300',
      description: 'Positive and focused, ready to learn'
    },
    { 
      value: 'okay' as const, 
      label: 'Okay', 
      icon: Meh, 
      color: 'text-blue-500 bg-blue-100 border-blue-300',
      description: 'Neutral mood, can study with some effort'
    },
    { 
      value: 'stressed' as const, 
      label: 'Stressed', 
      icon: Zap, 
      color: 'text-orange-500 bg-orange-100 border-orange-300',
      description: 'Feeling pressure, need lighter study load'
    },
    { 
      value: 'overwhelmed' as const, 
      label: 'Overwhelmed', 
      icon: CloudRain, 
      color: 'text-red-500 bg-red-100 border-red-300',
      description: 'Too much to handle, need gentle approach'
    },
  ];

  const stressFactorOptions = [
    'Upcoming exams',
    'Heavy workload',
    'Personal issues',
    'Health concerns',
    'Financial stress',
    'Relationship problems',
    'Sleep deprivation',
    'Time pressure',
    'Perfectionism',
    'Comparison with others'
  ];

  const generateStudyAdjustment = (): StudyAdjustment => {
    const originalHours = studyHours;
    let adjustedHours = originalHours;
    let adjustmentReason = '';
    let recommendations: string[] = [];
    let restActivities: string[] = [];
    let studyApproach = '';
    let breakFrequency = '';

    // Adjust based on mood
    if (selectedMood === 'great' && energyLevel >= 8 && motivationLevel >= 8) {
      adjustedHours = Math.min(originalHours + 1, 6);
      adjustmentReason = 'You\'re feeling fantastic! Perfect time for intensive learning.';
      recommendations = [
        'Tackle your most challenging topics today',
        'Consider learning new concepts',
        'Take on practice problems that push your limits',
        'This is a great day for deep focus work'
      ];
      restActivities = [
        'Quick 5-minute energizing walks between sessions',
        'Light stretching to maintain energy',
        'Hydration breaks with your favorite beverage'
      ];
      studyApproach = 'Intensive Learning Mode';
      breakFrequency = 'Every 60-90 minutes';
    } else if (selectedMood === 'good' && energyLevel >= 6) {
      adjustedHours = originalHours;
      adjustmentReason = 'You\'re in a good state for balanced studying.';
      recommendations = [
        'Mix of review and new material works well',
        'Good day for practice problems',
        'Maintain steady progress on your goals',
        'Consider group study if available'
      ];
      restActivities = [
        '10-minute walks between study blocks',
        'Light snacks and hydration',
        'Brief meditation or breathing exercises'
      ];
      studyApproach = 'Balanced Learning';
      breakFrequency = 'Every 45-60 minutes';
    } else if (selectedMood === 'okay' || energyLevel < 6 || motivationLevel < 6) {
      adjustedHours = Math.max(originalHours * 0.75, 1.5);
      adjustmentReason = 'Moderate energy detected. Let\'s take a gentler approach today.';
      recommendations = [
        'Focus on review rather than new material',
        'Start with easier topics to build momentum',
        'Use active recall techniques',
        'Set smaller, achievable goals for today'
      ];
      restActivities = [
        '15-minute walks in fresh air',
        'Light exercise or yoga',
        'Listen to calming music',
        'Have a healthy snack'
      ];
      studyApproach = 'Gentle Review Mode';
      breakFrequency = 'Every 30-45 minutes';
    } else if (selectedMood === 'stressed') {
      adjustedHours = Math.max(originalHours * 0.5, 1);
      adjustmentReason = 'You\'re feeling stressed. Let\'s prioritize your mental well-being with light study.';
      recommendations = [
        'Focus only on review of familiar topics',
        'Use relaxation techniques before studying',
        'Study in a comfortable, quiet environment',
        'Don\'t pressure yourself - any progress is good progress'
      ];
      restActivities = [
        '20-minute meditation or deep breathing',
        'Take a warm shower or bath',
        'Call a friend or family member',
        'Do some light stretching or yoga',
        'Listen to your favorite music'
      ];
      studyApproach = 'Stress-Relief Mode';
      breakFrequency = 'Every 20-30 minutes';
    } else if (selectedMood === 'overwhelmed') {
      adjustedHours = Math.max(originalHours * 0.25, 0.5);
      adjustmentReason = 'You\'re feeling overwhelmed. Today should be about rest and self-care.';
      recommendations = [
        'Consider taking a complete study break today',
        'If you must study, limit to 15-30 minutes of light review',
        'Focus on self-care and mental health',
        'Talk to someone about how you\'re feeling',
        'Remember: rest is productive too'
      ];
      restActivities = [
        'Take a long walk in nature',
        'Practice mindfulness or meditation',
        'Take a nap if you\'re tired',
        'Do something you enjoy (hobby, movie, etc.)',
        'Spend time with supportive people',
        'Consider professional support if needed'
      ];
      studyApproach = 'Self-Care Priority Mode';
      breakFrequency = 'Study in 15-minute chunks only';
    }

    // Additional adjustments based on stress factors
    if (stressFactors.includes('Sleep deprivation')) {
      adjustedHours = Math.max(adjustedHours * 0.8, 0.5);
      recommendations.push('Consider a 20-minute power nap before studying');
      recommendations.push('Prioritize sleep tonight over extended study');
      restActivities.push('Take a short nap (20-30 minutes max)');
    }

    if (stressFactors.includes('Health concerns')) {
      adjustedHours = Math.max(adjustedHours * 0.7, 0.5);
      recommendations.push('Listen to your body and rest when needed');
      recommendations.push('Stay hydrated and eat nutritious meals');
      restActivities.push('Focus on gentle, healing activities');
    }

    return {
      originalHours,
      adjustedHours: Math.round(adjustedHours * 2) / 2, // Round to nearest 0.5
      adjustmentReason,
      recommendations,
      restActivities,
      studyApproach,
      breakFrequency
    };
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;

    setSaving(true);
    
    // Generate study adjustment
    const adjustment = generateStudyAdjustment();
    setStudyAdjustment(adjustment);
    setShowAdjustment(true);
    
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const toggleStressFactor = (factor: string) => {
    setStressFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const getMoodTrend = () => {
    const moodValues = { great: 5, good: 4, okay: 3, stressed: 2, overwhelmed: 1 };
    const avgRecent = moodHistory.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / moodHistory.length;
    
    if (avgRecent >= 4) return { trend: 'positive', message: 'Your mood has been consistently positive!' };
    if (avgRecent >= 3) return { trend: 'stable', message: 'Your mood has been stable.' };
    return { trend: 'concerning', message: 'Your mood has been low recently. Consider taking breaks.' };
  };

  const moodTrend = getMoodTrend();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Heart className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">Smart Mood Tracker 💝</h1>
            <p className="text-purple-100 text-lg">Track your mood and get AI-powered study plan adjustments</p>
          </div>
        </div>
        
        {moodTrend && (
          <div className={`mt-6 p-4 rounded-lg bg-white bg-opacity-20 border ${
            moodTrend.trend === 'positive' ? 'border-green-300' :
            moodTrend.trend === 'stable' ? 'border-yellow-300' : 'border-red-300'
          }`}>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">7-Day Mood Trend</span>
            </div>
            <p className="text-purple-100 mt-1">{moodTrend.message}</p>
          </div>
        )}
      </div>

      {/* Today's Mood Entry */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-purple-600" />
          <span>How are you feeling today?</span>
        </h2>

        {/* AI Face Detection for Mood */}
        <div className="mb-8">
          <FaceDetection 
            onMoodDetected={handleMoodDetectedFromFace}
            className="mb-6"
          />
        </div>

        {/* Mood Selection */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select your current mood
            </label>
            <div className="grid md:grid-cols-5 gap-4">
              {moods.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood === mood.value;
                
                return (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      isSelected 
                        ? mood.color + ' scale-105 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      isSelected ? mood.color.split(' ')[0] : 'text-gray-400'
                    }`} />
                    <div className="font-semibold text-gray-900">{mood.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{mood.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy and Motivation Levels */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level: {energyLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Exhausted</span>
                <span>Energized</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivation Level: {motivationLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={motivationLevel}
                onChange={(e) => setMotivationLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No motivation</span>
                <span>Highly motivated</span>
              </div>
            </div>
          </div>

          {/* Stress Factors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's affecting your mood? (Select all that apply)
            </label>
            <div className="grid md:grid-cols-3 gap-2">
              {stressFactorOptions.map((factor) => (
                <button
                  key={factor}
                  onClick={() => toggleStressFactor(factor)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    stressFactors.includes(factor)
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>

          {/* Study Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Originally Planned Study Hours Today
            </label>
            <input
              type="number"
              min="0"
              max="12"
              step="0.5"
              value={studyHours}
              onChange={(e) => setStudyHours(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 3.5"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Anything else affecting your mood or study plans today..."
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleMoodSubmit}
            disabled={!selectedMood || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing mood...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Get Smart Study Plan Adjustment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Smart Study Plan Adjustment */}
      {showAdjustment && studyAdjustment && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>Smart Study Plan Adjustment</span>
          </h2>

          {/* Adjustment Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Study Hours</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900 mb-1">
                  {studyAdjustment.originalHours}h → {studyAdjustment.adjustedHours}h
                </div>
                <div className="text-sm text-blue-600">
                  {studyAdjustment.adjustedHours < studyAdjustment.originalHours ? 'Reduced for well-being' : 
                   studyAdjustment.adjustedHours > studyAdjustment.originalHours ? 'Increased for optimal learning' : 
                   'Maintained as planned'}
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <Target className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-800">Study Approach</h3>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-900 mb-1">
                  {studyAdjustment.studyApproach}
                </div>
                <div className="text-sm text-green-600">
                  Tailored to your current state
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center space-x-3 mb-3">
                <Coffee className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Break Schedule</h3>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-900 mb-1">
                  {studyAdjustment.breakFrequency}
                </div>
                <div className="text-sm text-purple-600">
                  Optimized for your energy
                </div>
              </div>
            </div>
          </div>

          {/* Adjustment Reason */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Why This Adjustment?</h3>
                <p className="text-blue-700 text-sm">{studyAdjustment.adjustmentReason}</p>
              </div>
            </div>
          </div>

          {/* Study Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Study Recommendations</span>
              </h3>
              <ul className="space-y-2">
                {studyAdjustment.recommendations.map((rec, index) => (
                  <li key={index} className="text-green-700 text-sm flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Rest & Recovery Activities</span>
              </h3>
              <ul className="space-y-2">
                {studyAdjustment.restActivities.map((activity, index) => (
                  <li key={index} className="text-orange-700 text-sm flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Special Message for Bad Moods */}
          {(selectedMood === 'stressed' || selectedMood === 'overwhelmed') && (
            <div className="mt-6 p-6 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-3">
                <Bed className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">🌸 Gentle Reminder</h3>
                  <p className="text-red-700 mb-3">
                    You're going through a tough time right now, and that's completely okay. Your mental health is more important than any study schedule.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Consider these self-care priorities:</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Rest is not laziness - it's necessary for recovery</li>
                      <li>• Talk to someone you trust about how you're feeling</li>
                      <li>• Focus on basic needs: sleep, nutrition, hydration</li>
                      <li>• Remember: this feeling is temporary</li>
                      <li>• You're doing better than you think you are</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mood History */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Mood History</h2>
        
        <div className="space-y-3">
          {moodHistory.map((entry, index) => {
            const mood = moods.find(m => m.value === entry.mood);
            const Icon = mood?.icon || Meh;
            
            return (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Icon className={`w-6 h-6 ${mood?.color.split(' ')[0] || 'text-gray-400'}`} />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {mood?.label} • {entry.study_hours}h planned
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Energy: {entry.energy_level}/10
                  </div>
                  <div className="text-sm text-gray-600">
                    Motivation: {entry.motivation_level}/10
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;