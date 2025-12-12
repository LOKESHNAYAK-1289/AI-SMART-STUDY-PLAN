import { useState } from 'react';
import { geminiService } from '../lib/gemini';

interface StudyPlanRequest {
  subject: string;
  topics: string[];
  days: number;
  hoursPerDay: number;
  userLevel?: string;
  examDate?: string;
}

interface GapAnalysisRequest {
  confusion: string;
  subject?: string;
  currentLevel?: string;
}

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStudyPlan = async (request: StudyPlanRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const plan = await geminiService.generateStudyPlan(request);
      return { data: plan, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate study plan';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const analyzeGaps = async (request: GapAnalysisRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await geminiService.analyzeGaps(request);
      return { data: analysis, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze gaps';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const generateMotivation = async (context?: { streak: number; completedTopics: number; mood?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const message = await geminiService.generateMotivationalMessage(context);
      return { data: message, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate motivation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateStudyPlan,
    analyzeGaps,
    generateMotivation,
  };
};