import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';

export interface Subject {
  id: string;
  name: string;
  description?: string;
}

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      const { data, error } = await db.getSubjects();
      
      if (error) {
        setError(error.message);
      } else {
        setSubjects(data || []);
      }
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    error,
  };
};