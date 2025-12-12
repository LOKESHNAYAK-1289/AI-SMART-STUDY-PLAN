import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isValidConfig = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('supabase.co');

if (!isValidConfig) {
  console.warn('⚠️  Supabase not configured - running in demo mode');
  console.warn('📝 To connect database:');
  console.warn('   1. Create a Supabase project at https://supabase.com');
  console.warn('   2. Copy .env.example to .env');
  console.warn('   3. Add your Supabase URL and anon key to .env');
  console.warn('   4. Restart the development server');
}

// Create a mock client if environment variables are missing
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: new Error('Demo mode - Supabase not configured') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Demo mode - Supabase not configured') }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: async () => ({ error: null }) }),
    upsert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
  }),
});

export const supabase = isValidConfig
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, fullName: string) => {
    if (!isValidConfig) {
      return { data: null, error: new Error('Supabase not configured - running in demo mode') };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    if (!isValidConfig) {
      return { data: null, error: new Error('Supabase not configured - running in demo mode') };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    if (!isValidConfig) {
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    if (!isValidConfig) {
      return Promise.resolve({ data: { user: null }, error: null });
    }
    
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!isValidConfig) {
      // Return a mock subscription
      setTimeout(() => callback('INITIAL_SESSION', null), 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers with fallbacks
export const db = {
  // Profile operations
  getProfile: async (userId: string) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  createProfile: async (profile: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    return { data, error };
  },

  // Subject operations
  getSubjects: async () => {
    if (!isValidConfig) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    return { data, error };
  },

  // Topic operations
  getTopics: async (userId: string) => {
    if (!isValidConfig) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('topics')
      .select(`
        *,
        subjects (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createTopic: async (topic: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('topics')
      .insert(topic)
      .select(`
        *,
        subjects (
          id,
          name
        )
      `)
      .single();
    return { data, error };
  },

  updateTopic: async (topicId: string, updates: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('topics')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', topicId)
      .select(`
        *,
        subjects (
          id,
          name
        )
      `)
      .single();
    return { data, error };
  },

  deleteTopic: async (topicId: string) => {
    if (!isValidConfig) {
      return { error: null };
    }
    
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', topicId);
    return { error };
  },

  // Gap operations
  getGaps: async (userId: string) => {
    if (!isValidConfig) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('gaps')
      .select('*')
      .eq('user_id', userId)
      .eq('resolved', false)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createGap: async (gap: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('gaps')
      .insert(gap)
      .select()
      .single();
    return { data, error };
  },

  updateGap: async (gapId: string, updates: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('gaps')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', gapId)
      .select()
      .single();
    return { data, error };
  },

  resolveGap: async (gapId: string) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('gaps')
      .update({ resolved: true, updated_at: new Date().toISOString() })
      .eq('id', gapId)
      .select()
      .single();
    return { data, error };
  },

  // Study plan operations
  getTodayStudyPlan: async (userId: string) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('study_plans')
      .select(`
        *,
        study_tasks (*)
      `)
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    return { data, error };
  },

  createStudyPlan: async (studyPlan: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('study_plans')
      .insert(studyPlan)
      .select()
      .single();
    return { data, error };
  },

  updateStudyPlan: async (planId: string, updates: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('study_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', planId)
      .select()
      .single();
    return { data, error };
  },

  // Study task operations
  createStudyTasks: async (tasks: any[]) => {
    if (!isValidConfig) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('study_tasks')
      .insert(tasks)
      .select();
    return { data, error };
  },

  updateStudyTask: async (taskId: string, updates: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('study_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    return { data, error };
  },

  // Mood operations
  getTodayMood: async (userId: string) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    return { data, error };
  },

  getMoodHistory: async (userId: string, days: number = 30) => {
    if (!isValidConfig) {
      return { data: [], error: null };
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });
    return { data, error };
  },

  createMoodEntry: async (moodEntry: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('mood_entries')
      .upsert(moodEntry, { onConflict: 'user_id,date' })
      .select()
      .single();
    return { data, error };
  },

  updateMoodEntry: async (moodId: string, updates: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('mood_entries')
      .update(updates)
      .eq('id', moodId)
      .select()
      .single();
    return { data, error };
  },

  // Resource operations
  getResourcesByTopic: async (topic: string) => {
    if (!isValidConfig) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .ilike('topic', `%${topic}%`)
      .order('rating', { ascending: false });
    return { data, error };
  },

  // Progress operations
  getUserProgress: async (userId: string, days: number = 7) => {
    if (!isValidConfig) {
      return { data: [], error: null };
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });
    return { data, error };
  },

  updateUserProgress: async (userId: string, date: string, progress: any) => {
    if (!isValidConfig) {
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        date,
        ...progress,
      }, { onConflict: 'user_id,date' })
      .select()
      .single();
    return { data, error };
  },

  // Analytics
  getUserStats: async (userId: string) => {
    if (!isValidConfig) {
      return {
        totalTopics: 0,
        completedTopics: 0,
        totalGaps: 0,
        resolvedGaps: 0,
        recentStudyTime: 0,
        completionRate: 0,
      };
    }
    
    const [topicsResult, gapsResult, progressResult] = await Promise.all([
      supabase
        .from('topics')
        .select('completed')
        .eq('user_id', userId),
      supabase
        .from('gaps')
        .select('resolved')
        .eq('user_id', userId),
      supabase
        .from('user_progress')
        .select('study_time')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(7),
    ]);

    const totalTopics = topicsResult.data?.length || 0;
    const completedTopics = topicsResult.data?.filter(t => t.completed).length || 0;
    const totalGaps = gapsResult.data?.length || 0;
    const resolvedGaps = gapsResult.data?.filter(g => g.resolved).length || 0;
    const recentStudyTime = progressResult.data?.reduce((sum, p) => sum + (p.study_time || 0), 0) || 0;

    return {
      totalTopics,
      completedTopics,
      totalGaps,
      resolvedGaps,
      recentStudyTime,
      completionRate: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
    };
  },
};