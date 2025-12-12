import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Topic {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  date_completed?: string;
  subjects?: {
    id: string;
    name: string;
  };
}

export const useTopics = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await db.getTopics(user.id);
    
    if (error) {
      setError(error.message);
    } else {
      setTopics(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics();
  }, [user]);

  const addTopic = async (name: string, subjectId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await db.createTopic({
      user_id: user.id,
      name,
      subject_id: subjectId,
      difficulty,
    });

    if (!error && data) {
      setTopics(prev => [data, ...prev]);
    }

    return { data, error };
  };

  const updateTopic = async (topicId: string, updates: Partial<Topic>) => {
    const { data, error } = await db.updateTopic(topicId, updates);

    if (!error && data) {
      setTopics(prev => prev.map(topic => 
        topic.id === topicId ? data : topic
      ));
    }

    return { data, error };
  };

  const deleteTopic = async (topicId: string) => {
    const { error } = await db.deleteTopic(topicId);

    if (!error) {
      setTopics(prev => prev.filter(topic => topic.id !== topicId));
    }

    return { error };
  };

  const toggleCompletion = async (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const updates = {
      completed: !topic.completed,
      date_completed: !topic.completed ? new Date().toISOString() : null,
    };

    return await updateTopic(topicId, updates);
  };

  return {
    topics,
    loading,
    error,
    addTopic,
    updateTopic,
    deleteTopic,
    toggleCompletion,
    refetch: fetchTopics,
  };
};