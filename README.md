# AI Smart Study Plan 🎓

An intelligent study planning and learning assistance platform powered by AI.

## Features

- 📚 **Topic Tracker**: Track your learning progress across subjects
- 🤔 **AI Doubts Clarification**: Get AI-powered explanations for confusing concepts
- 📖 **Book Search**: Search millions of books from Open Library
- 📝 **Mock Tests**: Practice with curated interview questions
- 💼 **Interview Questions**: Browse programming interview questions by language and difficulty
- 📅 **Study Plan Calendar**: AI-generated personalized study schedules
- 📺 **YouTube Library**: Curated educational content with live API integration
- 📄 **Resume Builder**: Create professional resumes
- 📖 **Daily Diary**: Personal reflection and mood tracking
- 💝 **Mood Tracker**: Track your emotional state and get study recommendations
- 👤 **User Profile**: Comprehensive profile management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini API
- **External APIs**: YouTube Data API v3, Open Library API
- **Build Tool**: Vite
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd ai-smart-study-plan
npm install
```

### 2. Database Setup (Supabase)

#### Option A: Use Existing Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy your project URL and anon key

#### Option B: Local Development
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here (optional)
```

### 4. Database Migration
The database schema will be automatically applied when you connect to Supabase. The following tables will be created:

- `profiles` - User profiles and preferences
- `subjects` - Available study subjects
- `topics` - User's study topics
- `gaps` - Learning gaps and confusions
- `study_plans` - AI-generated study plans
- `study_tasks` - Individual study tasks
- `mood_entries` - Mood tracking data
- `resources` - Learning resources
- `user_progress` - Progress tracking
- `library_books` - Book catalog
- `book_bookings` - Book reservations

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Database Schema

### Core Tables
- **profiles**: User information and preferences
- **subjects**: Available study subjects (Physics, Math, CS, etc.)
- **topics**: User's learning topics with progress tracking
- **gaps**: AI-identified learning gaps
- **study_plans**: Daily study schedules
- **mood_entries**: Mood and energy level tracking

### Features Tables
- **resources**: Curated learning materials
- **library_books**: Book catalog with availability
- **user_progress**: Daily progress metrics

## API Integrations

### Required APIs
- **Supabase**: Database and authentication
- **Google Gemini**: AI-powered study plan generation and gap analysis

### Optional APIs
- **YouTube Data API v3**: Live video search and recommendations
- **Open Library API**: Book search and information

## Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional (enables enhanced features)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
├── data/               # Static data and mock data
└── styles/             # Global styles
```

## Features Overview

### 🎯 AI-Powered Study Planning
- Personalized study schedules based on topics and time availability
- Mood-adaptive planning that adjusts based on your emotional state
- Smart gap detection and learning path recommendations

### 📚 Comprehensive Learning Tools
- Topic tracking with progress visualization
- Mock tests with 100+ programming questions
- Interview preparation with company-specific questions
- Book search across millions of titles

### 💡 Smart Analytics
- Mood tracking with study recommendations
- Progress analytics and streak tracking
- Performance insights and improvement suggestions

### 🌐 Multi-Language Support
- Programming questions in 12+ languages
- Educational content in multiple regional languages
- Global subject coverage from different educational systems

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the FAQ section

---

Built with ❤️ using React, TypeScript, and Supabase
