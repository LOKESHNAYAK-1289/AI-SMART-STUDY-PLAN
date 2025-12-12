export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          surname: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          completed_education: ('10th' | '12th' | 'diploma' | 'btech' | 'mtech' | 'bsc' | 'msc' | 'ba' | 'ma' | 'phd' | 'other')[]
          currently_pursuing: string | null
          skills: string[]
          interested_topics: string[]
          hobbies: string[]
          employment_status: 'employed' | 'unemployed' | 'student' | 'freelancer' | 'other' | null
          employment_domain: string | null
          profile_completed: boolean
          avatar_url: string | null
          study_streak: number
          total_study_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          surname?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          completed_education?: ('10th' | '12th' | 'diploma' | 'btech' | 'mtech' | 'bsc' | 'msc' | 'ba' | 'ma' | 'phd' | 'other')[]
          currently_pursuing?: string | null
          skills?: string[]
          interested_topics?: string[]
          hobbies?: string[]
          employment_status?: 'employed' | 'unemployed' | 'student' | 'freelancer' | 'other' | null
          employment_domain?: string | null
          profile_completed?: boolean
          avatar_url?: string | null
          study_streak?: number
          total_study_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          surname?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          completed_education?: ('10th' | '12th' | 'diploma' | 'btech' | 'mtech' | 'bsc' | 'msc' | 'ba' | 'ma' | 'phd' | 'other')[]
          currently_pursuing?: string | null
          skills?: string[]
          interested_topics?: string[]
          hobbies?: string[]
          employment_status?: 'employed' | 'unemployed' | 'student' | 'freelancer' | 'other' | null
          employment_domain?: string | null
          profile_completed?: boolean
          avatar_url?: string | null
          study_streak?: number
          total_study_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          name: string
          difficulty: 'easy' | 'medium' | 'hard'
          completed: boolean
          date_completed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          name: string
          difficulty?: 'easy' | 'medium' | 'hard'
          completed?: boolean
          date_completed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          name?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          completed?: boolean
          date_completed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gaps: {
        Row: {
          id: string
          user_id: string
          topic: string
          description: string
          priority: 'high' | 'medium' | 'low'
          gap_type: 'prerequisite' | 'conceptual' | 'practice'
          prerequisite: string | null
          resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic: string
          description: string
          priority?: 'high' | 'medium' | 'low'
          gap_type?: 'prerequisite' | 'conceptual' | 'practice'
          prerequisite?: string | null
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic?: string
          description?: string
          priority?: 'high' | 'medium' | 'low'
          gap_type?: 'prerequisite' | 'conceptual' | 'practice'
          prerequisite?: string | null
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      study_plans: {
        Row: {
          id: string
          user_id: string
          date: string
          completed: boolean
          total_estimated_time: number
          actual_time_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          completed?: boolean
          total_estimated_time?: number
          actual_time_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          completed?: boolean
          total_estimated_time?: number
          actual_time_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      study_tasks: {
        Row: {
          id: string
          study_plan_id: string
          topic: string
          description: string
          estimated_time: number
          task_type: 'review' | 'practice' | 'new'
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          study_plan_id: string
          topic: string
          description: string
          estimated_time?: number
          task_type?: 'review' | 'practice' | 'new'
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          study_plan_id?: string
          topic?: string
          description?: string
          estimated_time?: number
          task_type?: 'review' | 'practice' | 'new'
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed'
          study_hours: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood: 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed'
          study_hours?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed'
          study_hours?: number
          notes?: string | null
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          topic: string
          title: string
          resource_type: 'video' | 'article' | 'summary' | 'practice'
          url: string
          duration: number | null
          rating: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          topic: string
          title: string
          resource_type?: 'video' | 'article' | 'summary' | 'practice'
          url: string
          duration?: number | null
          rating?: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          topic?: string
          title?: string
          resource_type?: 'video' | 'article' | 'summary' | 'practice'
          url?: string
          duration?: number | null
          rating?: number
          description?: string | null
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          date: string
          topics_completed: number
          gaps_resolved: number
          study_time: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          topics_completed?: number
          gaps_resolved?: number
          study_time?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          topics_completed?: number
          gaps_resolved?: number
          study_time?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: 'easy' | 'medium' | 'hard'
      gap_type: 'prerequisite' | 'conceptual' | 'practice'
      mood_type: 'great' | 'good' | 'okay' | 'stressed' | 'overwhelmed'
      priority_level: 'high' | 'medium' | 'low'
      resource_type: 'video' | 'article' | 'summary' | 'practice'
      task_type: 'review' | 'practice' | 'new'
      gender_type: 'male' | 'female' | 'other' | 'prefer_not_to_say'
      education_level: '10th' | '12th' | 'diploma' | 'btech' | 'mtech' | 'bsc' | 'msc' | 'ba' | 'ma' | 'phd' | 'other'
      employment_status: 'employed' | 'unemployed' | 'student' | 'freelancer' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}