import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Gap {
  id: string;
  topic: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  gap_type: 'prerequisite' | 'conceptual' | 'practice';
  prerequisite?: string;
  resolved: boolean;
}

export const useGaps = () => {
  const { user } = useAuth();
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGaps = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await db.getGaps(user.id);
    
    if (error) {
      setError(error.message);
    } else {
      setGaps(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGaps();
  }, [user]);

  const analyzeConfusion = async (confusion: string) => {
    if (!user) return { error: 'Not authenticated' };

    // Simulate AI analysis - in production, this would call an AI service
    const mockAnalysis = await simulateGapAnalysis(confusion);
    
    // Create gaps in database
    const createdGaps = [];
    for (const gap of mockAnalysis) {
      const { data, error } = await db.createGap({
        user_id: user.id,
        ...gap,
      });
      
      if (!error && data) {
        createdGaps.push(data);
      }
    }

    if (createdGaps.length > 0) {
      setGaps(prev => [...createdGaps, ...prev]);
    }

    return { data: createdGaps, error: null };
  };

  const resolveGap = async (gapId: string) => {
    const { data, error } = await db.resolveGap(gapId);

    if (!error && data) {
      setGaps(prev => prev.filter(gap => gap.id !== gapId));
    }

    return { data, error };
  };

  return {
    gaps,
    loading,
    error,
    analyzeConfusion,
    resolveGap,
    refetch: fetchGaps,
  };
};

// Simulate AI gap analysis
const simulateGapAnalysis = async (confusion: string): Promise<Omit<Gap, 'id' | 'user_id' | 'resolved'>[]> => {
  // Simple keyword-based analysis for demo
  const lowerConfusion = confusion.toLowerCase();
  
  if (lowerConfusion.includes('recursion')) {
    return [
      {
        topic: 'Base Cases in Recursion',
        description: 'You seem to struggle with identifying when a recursive function should stop. This is fundamental to understanding recursion.',
        priority: 'high',
        gap_type: 'prerequisite',
        prerequisite: 'Function Call Stack',
      },
      {
        topic: 'Call Stack Visualization',
        description: 'Understanding how function calls are stacked and popped is crucial for recursion mastery.',
        priority: 'high',
        gap_type: 'conceptual',
        prerequisite: 'Memory Management Basics',
      },
      {
        topic: 'Practice with Simple Examples',
        description: 'You need more hands-on practice with basic recursive problems like factorial and fibonacci.',
        priority: 'medium',
        gap_type: 'practice',
      },
    ];
  }
  
  if (lowerConfusion.includes('pointer')) {
    return [
      {
        topic: 'Memory Addresses',
        description: 'Understanding how memory addresses work is essential for pointer comprehension.',
        priority: 'high',
        gap_type: 'prerequisite',
        prerequisite: 'Computer Memory Basics',
      },
      {
        topic: 'Pointer Arithmetic',
        description: 'The mathematical operations on pointers need more practice.',
        priority: 'medium',
        gap_type: 'practice',
      },
    ];
  }

  if (lowerConfusion.includes('dynamic programming')) {
    return [
      {
        topic: 'Overlapping Subproblems',
        description: 'You need to understand how problems can be broken down into smaller, repeating subproblems.',
        priority: 'high',
        gap_type: 'conceptual',
        prerequisite: 'Recursion',
      },
      {
        topic: 'Memoization Technique',
        description: 'The concept of storing results to avoid recomputation needs clarification.',
        priority: 'high',
        gap_type: 'conceptual',
      },
    ];
  }

  // Default gaps for general confusion
  return [
    {
      topic: 'Fundamental Concepts',
      description: 'There seems to be a gap in understanding the basic concepts of this topic.',
      priority: 'medium',
      gap_type: 'conceptual',
    },
    {
      topic: 'Practice Problems',
      description: 'More hands-on practice is needed to solidify understanding.',
      priority: 'medium',
      gap_type: 'practice',
    },
  ];
};