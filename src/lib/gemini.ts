interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface StudyPlanRequest {
  subject: string;
  topics: string[];
  days: number;
  hoursPerDay: number;
  userLevel?: string;
  examDate?: string;
  moodContext?: {
    mood: string;
    energyLevel: number;
    motivationLevel: number;
    stressFactors: string[];
    notes?: string;
  };
}

interface GapAnalysisRequest {
  confusion: string;
  subject?: string;
  currentLevel?: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  async generateStudyPlan(request: StudyPlanRequest): Promise<any> {
    const moodAdjustment = request.moodContext ? this.getMoodAdjustmentText(request.moodContext) : '';
    
    const prompt = `
You are an expert educational AI assistant with expertise in mood-adaptive learning. Create a detailed, personalized study plan based on the following requirements:

Subject: ${request.subject}
Topics to cover: ${request.topics.join(', ')}
Study duration: ${request.days} days
Hours per day: ${request.hoursPerDay} hours
${request.userLevel ? `Student level: ${request.userLevel}` : ''}
${request.examDate ? `Exam date: ${request.examDate}` : ''}

${moodAdjustment}

Please create a comprehensive study plan that:
1. Distributes topics logically across the given timeframe
2. Considers topic difficulty and prerequisites
3. Includes specific learning objectives for each session
4. Suggests study methods (reading, practice, review, etc.)
5. Balances theory and practical application
6. Includes regular review sessions
${request.moodContext ? '7. Adapts to the student\'s current mood and energy levels' : ''}

Format the response as a JSON object with this structure:
{
  "plan": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "sessions": [
        {
          "timeSlot": "Morning/Afternoon/Evening",
          "topic": "Topic name",
          "duration": 2.5,
          "objectives": ["Learn X", "Practice Y"],
          "studyMethod": "Reading/Practice/Review",
          "resources": ["Suggested resource 1", "Suggested resource 2"],
          "moodAdaptation": "How this session is adapted for current mood"
        }
      ],
      "totalHours": 3.0,
      "dailyGoal": "What to achieve today",
      "wellnessBreaks": ["Suggested break activities"]
    }
  ],
  "summary": {
    "totalTopics": 5,
    "totalHours": 21,
    "difficulty": "Medium",
    "moodConsiderations": "How the plan adapts to mood",
    "recommendations": ["Tip 1", "Tip 2"]
  }
}

Make sure the plan is realistic, well-structured, educationally sound, and appropriately adapted for the student's current mental state.
`;

    try {
      const response = await this.makeRequest(prompt);
      // Extract JSON from the response (Gemini might include extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from Gemini response');
      }
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      // Return a fallback plan
      return this.generateFallbackPlan(request);
    }
  }

  private getMoodAdjustmentText(moodContext: any): string {
    return `
MOOD CONTEXT FOR ADAPTATION:
Current mood: ${moodContext.mood}
Energy level: ${moodContext.energyLevel}/10
Motivation level: ${moodContext.motivationLevel}/10
Stress factors: ${moodContext.stressFactors.join(', ') || 'None'}
${moodContext.notes ? `Additional notes: ${moodContext.notes}` : ''}

ADAPTATION REQUIREMENTS:
- If mood is "stressed" or "overwhelmed": Reduce intensity, focus on review, include more breaks
- If energy level < 5: Start with easier topics, shorter sessions, more frequent breaks
- If motivation level < 5: Include engaging activities, smaller goals, reward milestones
- Consider stress factors when planning session timing and intensity
- Include wellness breaks and self-care recommendations
`;
  }

  async analyzeGaps(request: GapAnalysisRequest): Promise<any> {
    const prompt = `
You are an expert educational AI that specializes in identifying learning gaps. Analyze the following student confusion and provide detailed gap analysis:

Student's confusion: "${request.confusion}"
${request.subject ? `Subject context: ${request.subject}` : ''}
${request.currentLevel ? `Student level: ${request.currentLevel}` : ''}

Please analyze this confusion and identify:
1. Root cause of the confusion
2. Missing prerequisites
3. Conceptual gaps
4. Recommended learning path
5. Specific resources and practice areas

Format the response as a JSON object:
{
  "analysis": {
    "rootCause": "Primary reason for confusion",
    "confusionType": "prerequisite/conceptual/practice",
    "severity": "high/medium/low"
  },
  "gaps": [
    {
      "topic": "Missing concept name",
      "description": "Detailed explanation of what's missing",
      "priority": "high/medium/low",
      "type": "prerequisite/conceptual/practice",
      "prerequisite": "What needs to be learned first (if applicable)"
    }
  ],
  "learningPath": [
    {
      "step": 1,
      "topic": "First thing to learn",
      "description": "Why this is important",
      "estimatedTime": "2 hours",
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "recommendations": {
    "immediate": ["What to do right now"],
    "shortTerm": ["What to do this week"],
    "longTerm": ["What to do over time"]
  }
}

Provide actionable, specific guidance that will help the student overcome their confusion.
`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from Gemini response');
      }
    } catch (error) {
      console.error('Failed to analyze gaps:', error);
      return this.generateFallbackGapAnalysis(request);
    }
  }

  async generateMotivationalMessage(context?: { streak: number; completedTopics: number; mood?: string }): Promise<string> {
    const prompt = `
Generate a personalized, encouraging motivational message for a student based on their progress:

${context ? `
Study streak: ${context.streak} days
Completed topics: ${context.completedTopics}
${context.mood ? `Current mood: ${context.mood}` : ''}
` : ''}

Create a motivational message that:
1. Acknowledges their progress
2. Encourages continued effort
3. Is positive and inspiring
4. Includes relevant emojis
5. Is 1-2 sentences long
${context?.mood ? '6. Considers their current mood state' : ''}

Make it personal and uplifting!
`;

    try {
      const response = await this.makeRequest(prompt);
      return response.trim();
    } catch (error) {
      console.error('Failed to generate motivational message:', error);
      const fallbackMessages = [
        "Every step forward is progress! Keep building your knowledge brick by brick. 🧱✨",
        "Your dedication is paying off! Each topic you master makes you stronger. 💪📚",
        "Learning is a journey, not a race. You're doing amazing! 🌟🚀",
        "Small consistent efforts lead to big achievements. Keep going! ⭐📈"
      ];
      return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    }
  }

  private generateFallbackPlan(request: StudyPlanRequest): any {
    const plan = [];
    const hoursPerTopic = (request.days * request.hoursPerDay) / request.topics.length;
    
    // Adjust for mood if provided
    let adjustedHours = request.hoursPerDay;
    let wellnessBreaks = ['5-minute breathing exercise'];
    
    if (request.moodContext) {
      const { mood, energyLevel, motivationLevel } = request.moodContext;
      
      if (mood === 'stressed' || mood === 'overwhelmed') {
        adjustedHours = Math.max(adjustedHours * 0.6, 1);
        wellnessBreaks = ['10-minute meditation', '15-minute walk', 'Deep breathing exercises'];
      } else if (energyLevel < 5) {
        adjustedHours = Math.max(adjustedHours * 0.8, 1.5);
        wellnessBreaks = ['Power nap (20 min)', 'Light stretching', 'Hydration break'];
      }
    }
    
    for (let day = 1; day <= request.days; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day - 1);
      
      const topicsForDay = request.topics.slice(
        Math.floor((day - 1) * request.topics.length / request.days),
        Math.floor(day * request.topics.length / request.days)
      );

      plan.push({
        day,
        date: date.toISOString().split('T')[0],
        sessions: topicsForDay.map((topic, index) => ({
          timeSlot: index === 0 ? 'Morning' : index === 1 ? 'Afternoon' : 'Evening',
          topic,
          duration: Math.min(hoursPerTopic, adjustedHours),
          objectives: [`Study ${topic} fundamentals`, `Practice ${topic} problems`],
          studyMethod: 'Reading and Practice',
          resources: ['Textbook', 'Online tutorials'],
          moodAdaptation: request.moodContext ? 'Adapted for current mood and energy levels' : 'Standard approach'
        })),
        totalHours: adjustedHours,
        dailyGoal: `Master ${topicsForDay.join(' and ')}`,
        wellnessBreaks
      });
    }

    return {
      plan,
      summary: {
        totalTopics: request.topics.length,
        totalHours: request.days * adjustedHours,
        difficulty: 'Medium',
        moodConsiderations: request.moodContext ? 'Plan adapted for current mood state' : 'Standard plan',
        recommendations: ['Take regular breaks', 'Review previous topics', 'Practice consistently']
      }
    };
  }

  private generateFallbackGapAnalysis(request: GapAnalysisRequest): any {
    return {
      analysis: {
        rootCause: "Need more detailed analysis to identify specific gaps",
        confusionType: "conceptual",
        severity: "medium"
      },
      gaps: [
        {
          topic: "Fundamental Concepts",
          description: "There may be gaps in understanding basic concepts related to this topic",
          priority: "medium",
          type: "conceptual",
          prerequisite: "Review foundational material"
        }
      ],
      learningPath: [
        {
          step: 1,
          topic: "Review Basics",
          description: "Start with fundamental concepts",
          estimatedTime: "2-3 hours",
          resources: ["Textbook chapters", "Online tutorials"]
        }
      ],
      recommendations: {
        immediate: ["Review basic concepts"],
        shortTerm: ["Practice with simple examples"],
        longTerm: ["Build up to more complex problems"]
      }
    };
  }
}

export const geminiService = new GeminiService();