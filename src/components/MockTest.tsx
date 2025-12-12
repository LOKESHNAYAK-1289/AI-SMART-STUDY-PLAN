import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, XCircle, RotateCcw, Trophy, Brain, Code, BookOpen, Filter, Search, Star, Target, Zap, FileText } from 'lucide-react';
import { interviewQuestions, InterviewQuestion } from '../data/interviewQuestions';

interface TestResult {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

const MockTest: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [currentTest, setCurrentTest] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number>(0);

  const languages = ['all', 'Python', 'Java', 'C++', 'JavaScript', 'C#', 'Go', 'Rust', 'PHP', 'TypeScript', 'Kotlin', 'SQL', 'HTML/CSS'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const getFilteredQuestions = () => {
    return interviewQuestions.filter(q => {
      const languageMatch = selectedLanguage === 'all' || q.language === selectedLanguage;
      const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return languageMatch && difficultyMatch;
    });
  };

  const startTest = () => {
    let filteredQuestions = interviewQuestions;
    
    if (selectedLanguage !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.language === selectedLanguage);
    }
    
    if (selectedDifficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
    }
    
    // Shuffle and select questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, questionCount);
    
    setCurrentTest(selectedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestStarted(true);
    setTestCompleted(false);
    setTestStartTime(Date.now());
  };

  const handleAnswer = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeTest = () => {
    setTestCompleted(true);
  };

  const getResults = () => {
    let correctAnswers = 0;
    currentTest.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });
    
    const timeSpent = Math.floor((Date.now() - testStartTime) / 1000);
    return { correctAnswers, timeSpent };
  };

  if (testCompleted) {
    const { correctAnswers, timeSpent } = getResults();
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Trophy className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Test Complete! 🎉</h1>
              <p className="text-green-100 text-lg">Here are your results</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Score</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {Math.round((correctAnswers / currentTest.length) * 100)}%
              </div>
              <div className="text-green-600">Score: {correctAnswers}/{currentTest.length} ({questionCount} questions)</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-blue-600">Average: {Math.round(timeSpent / currentTest.length)}s per question</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Difficulty</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {currentTest.filter(q => q.difficulty === 'Hard').length}
              </div>
              <div className="text-purple-600">Hard questions in this test</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
          
          <div className="space-y-6">
            {currentTest.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.answer;
              
              return (
                <div key={question.id} className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <span className="font-semibold text-gray-900">Q{index + 1}: {question.language}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3 font-medium">{question.question}</p>

                  {question.type === 'MCQ' && question.options && (
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`p-2 rounded border ${
                          option === question.answer ? 'border-green-500 bg-green-100' :
                          option === userAnswer && option !== question.answer ? 'border-red-500 bg-red-100' :
                          'border-gray-200'
                        }`}>
                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                          {option === question.answer && <span className="ml-2 text-green-600 font-medium">✓ Correct</span>}
                          {option === userAnswer && option !== question.answer && <span className="ml-2 text-red-600 font-medium">✗ Your Answer</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {(question.type === 'Coding' || question.type === 'Theory') && (
                    <div className="mb-3">
                      <div className="bg-gray-50 p-3 rounded border">
                        <h5 className="font-medium text-gray-800 mb-1">Your Answer:</h5>
                        <p className="text-gray-700 text-sm">{userAnswer || 'No answer provided'}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded border border-green-200 mt-2">
                        <h5 className="font-medium text-green-800 mb-1">Expected Answer:</h5>
                        <p className="text-green-700 text-sm">{question.answer}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-1">Explanation:</h5>
                    <p className="text-blue-700 text-sm">{question.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setTestStarted(false);
              setTestCompleted(false);
              setQuestionCount(10);
              setSelectedLanguage('all');
              setSelectedDifficulty('all');
            }}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Test</span>
          </button>
        </div>
      </div>
    );
  }

  if (testStarted) {
    const currentQuestion = currentTest[currentQuestionIndex];
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Question {currentQuestionIndex + 1} of {currentTest.length} ({questionCount} total)
            </h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {currentQuestion.language}
              </span>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentTest.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h3>

          {currentQuestion.type === 'MCQ' && currentQuestion.options && (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    userAnswers[currentQuestionIndex] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>
          )}

          {(currentQuestion.type === 'Coding' || currentQuestion.type === 'Theory') && (
            <div className="mb-8">
              <textarea
                value={userAnswers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                onClick={completeTest}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Finish Test
              </button>

              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {currentQuestionIndex === currentTest.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Brain className="w-12 h-12" />
          <div>
            <h1 className="text-4xl font-bold">Mock Interview Test 🎯</h1>
            <p className="text-green-100 text-lg">Test your programming knowledge with curated questions</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Total Questions</span>
            </div>
            <div className="text-2xl font-bold">{interviewQuestions.length}</div>
            <div className="text-green-100 text-sm">In question bank</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-5 h-5" />
              <span className="font-semibold">Test Options</span>
            </div>
            <div className="text-2xl font-bold">4</div>
            <div className="text-green-100 text-sm">Question counts (5,10,15,20)</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Languages</span>
            </div>
            <div className="text-2xl font-bold">{languages.length}</div>
            <div className="text-green-100 text-sm">Programming languages</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Difficulty</span>
            </div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-green-100 text-sm">Levels available</div>
          </div>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Configure Your Test</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programming Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Languages</option>
              {languages.slice(1).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              {difficulties.slice(1).map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5 Questions (Quick Test)</option>
              <option value={10}>10 Questions (Standard)</option>
              <option value={15}>15 Questions (Extended)</option>
              <option value={20}>20 Questions (Comprehensive)</option>
            </select>
          </div>
        </div>

        <button
          onClick={startTest}
          disabled={getFilteredQuestions().length === 0}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>Start Test ({questionCount} Questions)</span>
        </button>

        {getFilteredQuestions().length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              No questions available for the selected filters. Please adjust your selection.
            </p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Available questions with current filters: <span className="font-semibold">{getFilteredQuestions().length}</span></p>
        </div>
      </div>

      {/* Question Preview */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sample Questions</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {getFilteredQuestions().slice(0, 4).map((question, index) => (
            <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {question.difficulty}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {question.language}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {question.type}
                </span>
              </div>
              <p className="text-gray-800 font-medium text-sm">{question.question}</p>
            </div>
          ))}
        </div>

        {getFilteredQuestions().length > 4 && (
          <div className="mt-4 text-center text-gray-600">
            <p>And {getFilteredQuestions().length - 4} more questions available...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTest;