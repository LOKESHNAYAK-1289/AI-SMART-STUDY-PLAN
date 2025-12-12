export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Topic {
  id: string;
  name: string;
  subject: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  dateCompleted?: Date;
}

export interface Gap {
  id: string;
  topic: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  prerequisite?: string;
  type: 'prerequisite' | 'conceptual' | 'practice';
}

export interface StudyPlan {
  id: string;
  date: Date;
  tasks: StudyTask[];
  completed: boolean;
}

export interface StudyTask {
  id: string;
  topic: string;
  description: string;
  estimatedTime: number;
  completed: boolean;
  type: 'review' | 'practice' | 'new';
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'summary';
  url: string;
  duration?: number;
  rating: number;
}

export interface MoodEntry {
  date: Date;
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed';
  studyHours: number;
}

export type Page = 'home' | 'dashboard' | 'topics' | 'gaps' | 'books' | 'mocktest' | 'planner' | 'youtube' | 'resume' | 'diary' | 'mood' | 'profile';
export type Page = 'home' | 'dashboard' | 'topics' | 'gaps' | 'books' | 'mocktest' | 'planner' | 'youtube' | 'resume' | 'diary' | 'mood' | 'profile' | 'interview-questions' | 'question-papers';
export type Page = 'home' | 'dashboard' | 'topics' | 'gaps' | 'books' | 'mocktest' | 'planner' | 'youtube' | 'resume' | 'diary' | 'mood' | 'profile' | 'interview-questions' | 'question-papers' | 'webinar';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  surname: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  completed_education: string[];
  currently_pursuing: string | null;
  skills: string[];
  interested_topics: string[];
  hobbies: string[];
  employment_status: 'employed' | 'unemployed' | 'student' | 'freelancer' | 'other' | null;
  employment_domain: string | null;
  profile_completed: boolean;
  avatar_url: string | null;
  study_streak: number;
  total_study_hours: number;
  created_at: string;
  updated_at: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  total_questions: number;
  time_taken: number;
  completed_at: string;
  incorrect_questions?: any[];
}