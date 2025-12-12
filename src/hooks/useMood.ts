import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed';
  study_hours: number;
  notes?: string;
  energy_level: number;
  motivation_level: number;
  stress_factors: string[];
  created_at: string;
}

export const useMood = () => {
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayMood = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await db.getTodayMood(user.id);
    
    if (error) {
      setError(error.message);
    } else {
      setTodayMood(data);
    }
    setLoading(false);
  };

  const getMoodHistory = async (days: number = 30) => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await db.getMoodHistory(user.id, days);
    
    if (error) {
      setError(error.message);
    } else {
      setMoodHistory(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchTodayMood();
      getMoodHistory();
    }
  }, [user]);

  const createMoodEntry = async (moodData: Omit<MoodEntry, 'id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' };

    setLoading(true);
    const { data, error } = await db.createMoodEntry(moodData);
    
    if (!error && data) {
      setTodayMood(data);
      // Refresh history
      getMoodHistory();
    }
    
    setLoading(false);
    return { data, error };
  };

  const updateMoodEntry = async (moodId: string, updates: Partial<MoodEntry>) => {
    setLoading(true);
    const { data, error } = await db.updateMoodEntry(moodId, updates);
    
    if (!error && data) {
      setTodayMood(data);
      // Refresh history
      getMoodHistory();
    }
    
    setLoading(false);
    return { data, error };
  };

  const getMoodInsights = () => {
    if (!moodHistory || moodHistory.length === 0) return null;

    const moodValues = { great: 5, good: 4, okay: 3, stressed: 2, overwhelmed: 1 };
    const recent7Days = moodHistory.slice(-7);
    const recent30Days = moodHistory.slice(-30);

    const avg7Days = recent7Days.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / recent7Days.length;
    const avg30Days = recent30Days.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / recent30Days.length;

    const trend = avg7Days > avg30Days ? 'improving' : avg7Days < avg30Days ? 'declining' : 'stable';
    
    const mostCommonMood = recent7Days.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(mostCommonMood).reduce((a, b) => 
      mostCommonMood[a[0]] > mostCommonMood[b[0]] ? a : b
    )[0];

    return {
      trend,
      avg7Days: Math.round(avg7Days * 10) / 10,
      avg30Days: Math.round(avg30Days * 10) / 10,
      dominantMood,
      totalEntries: moodHistory.length,
    };
  };

  const getStudyRecommendations = () => {
    if (!todayMood) return [];

    const recommendations = [];
    
    if (todayMood.mood === 'great' && todayMood.energy_level >= 8) {
      recommendations.push('Perfect day for tackling challenging topics!');
      recommendations.push('Consider extending study time by 1-2 hours');
      recommendations.push('Great time to learn new concepts');
    } else if (todayMood.mood === 'good') {
      recommendations.push('Good day for balanced study sessions');
      recommendations.push('Mix of review and new material works well');
    } else if (todayMood.mood === 'okay') {
      recommendations.push('Focus on review and practice problems');
      recommendations.push('Take more frequent breaks');
      recommendations.push('Start with easier topics to build momentum');
    } else if (todayMood.mood === 'stressed') {
      recommendations.push('Reduce study intensity by 25-50%');
      recommendations.push('Focus on review rather than new material');
      recommendations.push('Include relaxation breaks every 30 minutes');
      recommendations.push('Consider meditation or light exercise');
    } else if (todayMood.mood === 'overwhelmed') {
      recommendations.push('Take a mental health day if possible');
      recommendations.push('Very light study - just review notes');
      recommendations.push('Focus on self-care activities');
      recommendations.push('Talk to someone about your stress');
    }

    if (todayMood.energy_level < 4) {
      recommendations.push('Take a 20-minute power nap');
      recommendations.push('Ensure proper nutrition and hydration');
      recommendations.push('Start with light reading or review');
    }

    if (todayMood.motivation_level < 4) {
      recommendations.push('Set very small, achievable goals');
      recommendations.push('Use the 2-minute rule - commit to just 2 minutes');
      recommendations.push('Study with a friend or group');
      recommendations.push('Reward yourself for small wins');
    }

    return recommendations;
  };

  return {
    todayMood,
    moodHistory,
    loading,
    error,
    createMoodEntry,
    updateMoodEntry,
    getMoodHistory,
    getMoodInsights,
    getStudyRecommendations,
    refetch: fetchTodayMood,
  };
};