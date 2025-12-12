import React, { useState } from 'react';
import { Search, AlertTriangle, Lightbulb, BookOpen, Play, ExternalLink, Brain, Zap } from 'lucide-react';

// API Configuration
const API_KEY = "1c4e480ce6mshf640bd50e011943p199817jsn9fa0c566b19d";

// Updated API function with better error handling
async function updateAddress(addressId: string, newAddressData: object) {
  try {
    // Simulate API call with a Promise that resolves after a delay
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Address updated successfully",
          addressId: addressId,
          updatedData: newAddressData,
          timestamp: new Date().toISOString()
        });
      }, 1500); // 1.5 second delay to simulate network request
    });
    
    console.log("Address updated:", result);
    return result;
  } catch (error) {
    console.error("Network or server error:", error);
    throw error;
  }
}

interface Gap {
  topic: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'prerequisite' | 'conceptual' | 'practice';
  prerequisite?: string;
}

interface LearningStep {
  step: number;
  topic: string;
  description: string;
  estimatedTime: string;
  resources: string[];
}

const GapsDetector: React.FC = () => {
  const [confusion, setConfusion] = useState('');
  const [detectedGaps, setDetectedGaps] = useState<Gap[]>([]);
  const [learningPath, setLearningPath] = useState<LearningStep[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [keyInsights, setKeyInsights] = useState<string[]>([]);
  const [quickActions, setQuickActions] = useState<string[]>([]);

  // Handle address update with improved error handling
  const handleAddressUpdate = async () => {
    const sampleAddress = {
      street: "123 New Street",
      city: "New City",
      state: "NC",
      zip: "12345"
    };

    setIsUpdatingAddress(true);
    setApiResponse('');

    try {
      const result = await updateAddress("12345", sampleAddress);
      setApiResponse("Address updated successfully!");
      console.log("API Response:", result);
    } catch (error: any) {
      setApiResponse(`Failed to update address: ${error.message}`);
      console.error("Network Error:", error);
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const analyzeConfusion = async () => {
    if (!confusion.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis(confusion);
      setAnalysis(mockAnalysis.analysis);
      setDetectedGaps(mockAnalysis.gaps);
      setLearningPath(mockAnalysis.learningPath);
      setRecommendations(mockAnalysis.recommendations);
      setKeyInsights(mockAnalysis.keyInsights);
      setQuickActions(mockAnalysis.quickActions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockAnalysis = (confusion: string) => {
    const lowerConfusion = confusion.toLowerCase();
    
    if (lowerConfusion.includes('recursion')) {
      return {
        analysis: {
          rootCause: "🎯 Core Issue: Missing understanding of how recursive functions work and when they terminate",
          confusionType: "conceptual",
          severity: "high"
        },
        keyInsights: [
          "🔍 **Root Problem**: You're struggling with the fundamental concept of recursion termination",
          "📚 **Missing Foundation**: Base cases and call stack understanding are not clear",
          "⚡ **Quick Fix**: Start with simple examples like factorial before complex problems",
          "🎯 **Focus Area**: Visualization of function calls is crucial for understanding",
          "💡 **Learning Style**: You need hands-on practice with step-by-step tracing"
        ],
        quickActions: [
          "📺 Watch a 10-minute recursion visualization video RIGHT NOW",
          "✏️ Draw the call stack for factorial(5) on paper",
          "💻 Code and trace through 3 simple recursive functions today",
          "🔄 Practice identifying base cases in 5 different problems",
          "📖 Read about stack overflow and why it happens"
        ],
        gaps: [
          {
            topic: 'Base Cases in Recursion',
            description: '🎯 **Key Issue**: You struggle with identifying when recursive functions should stop.\n\n**Why This Matters**: Base cases prevent infinite recursion and stack overflow.\n\n**What You Need**: Clear understanding of termination conditions.',
            priority: 'high' as const,
            type: 'prerequisite' as const,
            prerequisite: 'Function Call Stack',
          },
          {
            topic: 'Call Stack Visualization',
            description: '🔍 **Core Problem**: You don\'t visualize how function calls stack up.\n\n**Impact**: Without this, recursion feels like magic instead of logic.\n\n**Solution**: Learn to trace function calls step-by-step.',
            priority: 'high' as const,
            type: 'conceptual' as const,
            prerequisite: 'Memory Management Basics',
          },
          {
            topic: 'Practice with Simple Examples',
            description: '💪 **Action Needed**: More hands-on coding practice required.\n\n**Focus**: Start with factorial, fibonacci, and sum of array.\n\n**Goal**: Build muscle memory for recursive thinking patterns.',
            priority: 'medium' as const,
            type: 'practice' as const,
          },
        ],
        learningPath: [
          {
            step: 1,
            topic: "🎯 Master Function Call Basics",
            description: "**Goal**: Understand how functions are called and return values\n\n**Key Points**:\n• Function parameters and return values\n• Call stack concept\n• Memory allocation for function calls",
            estimatedTime: "1 hour",
            resources: ["Function basics tutorial", "Call stack visualization"]
          },
          {
            step: 2,
            topic: "🛑 Master Base Cases",
            description: "**Goal**: Master stopping conditions in recursion\n\n**Key Points**:\n• What is a base case?\n• How to identify termination conditions\n• Common base case patterns",
            estimatedTime: "2 hours",
            resources: ["Base case examples", "Practice problems"]
          },
          {
            step: 3,
            topic: "💻 Practice Core Problems",
            description: "**Goal**: Build confidence with standard recursive problems\n\n**Key Points**:\n• Factorial implementation\n• Fibonacci sequence\n• Array sum recursion\n• Tree traversal basics",
            estimatedTime: "3 hours",
            resources: ["Coding exercises", "Step-by-step solutions"]
          }
        ],
        recommendations: {
          immediate: [
            "🎬 Watch: 'Recursion Explained Visually' (10 mins)",
            "✏️ Trace: factorial(4) step-by-step on paper",
            "💻 Code: Simple countdown function with base case"
          ],
          shortTerm: [
            "📝 Complete: 5 basic recursion problems daily",
            "🎨 Draw: Call stack diagrams for each solution",
            "🔍 Debug: Intentionally create infinite recursion to understand errors"
          ],
          longTerm: [
            "🌳 Master: Binary tree traversal algorithms",
            "⚡ Learn: Dynamic programming with memoization",
            "🏗️ Build: Recursive data structure implementations"
          ]
        }
      };
    }
    
    if (lowerConfusion.includes('pointer')) {
      return {
        analysis: {
          rootCause: "🎯 Core Issue: Missing understanding of memory addresses and pointer references",
          confusionType: "conceptual",
          severity: "high"
        },
        keyInsights: [
          "🔍 **Root Problem**: Memory address concept is not clear in your mind",
          "📚 **Missing Foundation**: Computer memory organization understanding is weak",
          "⚡ **Quick Fix**: Start with simple variable address examples",
          "🎯 **Focus Area**: Pointer arithmetic and dereferencing operations",
          "💡 **Learning Style**: You need visual memory diagrams and hands-on practice"
        ],
        quickActions: [
          "📊 Draw memory layout diagram with addresses RIGHT NOW",
          "💻 Write simple program to print variable addresses",
          "🔍 Practice pointer declaration and initialization",
          "✏️ Trace through pointer arithmetic examples",
          "🎯 Understand difference between pointer and value"
        ],
        gaps: [
          {
            topic: 'Memory Addresses',
            description: '🎯 **Key Issue**: Memory address concept is unclear.\n\n**Why This Matters**: Pointers are just memory addresses - without this foundation, pointers seem magical.\n\n**What You Need**: Clear mental model of computer memory.',
            priority: 'high' as const,
            type: 'prerequisite' as const,
            prerequisite: 'Computer Memory Basics',
          },
          {
            topic: 'Pointer Arithmetic',
            description: '💪 **Action Needed**: More practice with pointer math operations.\n\n**Focus**: Addition, subtraction, and array traversal with pointers.\n\n**Goal**: Comfortable manipulation of memory addresses.',
            priority: 'medium' as const,
            type: 'practice' as const,
          },
        ],
        learningPath: [
          {
            step: 1,
            topic: "🧠 Master Memory Fundamentals",
            description: "**Goal**: Understand computer memory organization\n\n**Key Points**:\n• Memory as array of bytes\n• Address numbering system\n• Stack vs heap memory\n• Variable storage locations",
            estimatedTime: "1.5 hours",
            resources: ["Memory layout diagrams", "Address visualization tools"]
          },
          {
            step: 2,
            topic: "👉 Master Pointer Basics",
            description: "**Goal**: Understand pointer declaration and usage\n\n**Key Points**:\n• Pointer declaration syntax\n• Address-of operator (&)\n• Dereference operator (*)\n• Null pointer concept",
            estimatedTime: "2 hours",
            resources: ["Pointer tutorials", "Interactive examples"]
          }
        ],
        recommendations: {
          immediate: [
            "📊 Draw: Memory diagram with variable addresses",
            "🔧 Use: Online pointer visualization tool",
            "💻 Code: Simple pointer declaration and usage"
          ],
          shortTerm: [
            "📝 Practice: Pointer declaration and dereferencing daily",
            "🔢 Master: Array traversal using pointers",
            "🎯 Debug: Common pointer errors and segmentation faults"
          ],
          longTerm: [
            "🏗️ Master: Dynamic memory allocation (malloc/free)",
            "🔒 Learn: Smart pointers in modern C++",
            "⚡ Build: Data structures using pointers"
          ]
        }
      };
    }

    // Default analysis for general confusion
    return {
      analysis: {
        rootCause: "🎯 Core Issue: Need more specific information to provide targeted help",
        confusionType: "general",
        severity: "medium"
      },
      keyInsights: [
        "🔍 **Analysis Needed**: Your question needs more specific details for better help",
        "📚 **General Pattern**: Most confusion comes from missing foundational concepts",
        "⚡ **Quick Win**: Break down the problem into smaller, specific parts",
        "🎯 **Focus Strategy**: Identify the exact step where you get stuck",
        "💡 **Learning Approach**: Use examples and hands-on practice"
      ],
      quickActions: [
        "📝 Write down the EXACT step where you get confused",
        "🔍 Identify what specific concept is unclear",
        "💻 Try a simple example to isolate the problem",
        "📚 Review basic concepts related to your topic",
        "🎯 Ask a more specific question about your confusion"
      ],
      gaps: [
        {
          topic: "Fundamental Concepts",
          description: "🎯 **Key Issue**: Basic concepts may not be solid.\n\n**Why This Matters**: Advanced topics build on fundamentals.\n\n**What You Need**: Review and strengthen foundation knowledge.",
          priority: "medium" as const,
          type: "conceptual" as const,
        },
        {
          topic: "Practice Problems",
          description: "💪 **Action Needed**: More hands-on practice required.\n\n**Focus**: Apply concepts through exercises and real examples.\n\n**Goal**: Build confidence through repetition and application.",
          priority: "medium" as const,
          type: "practice" as const,
        }
      ],
      learningPath: [
        {
          step: 1,
          topic: "📚 Review Foundation",
          description: "**Goal**: Strengthen basic concept understanding\n\n**Key Points**:\n• Identify knowledge gaps\n• Review prerequisite topics\n• Build solid foundation",
          estimatedTime: "2-3 hours",
          resources: ["Textbook chapters", "Online tutorials"]
        },
        {
          step: 2,
          topic: "💻 Apply Through Practice",
          description: "**Goal**: Apply concepts through hands-on exercises\n\n**Key Points**:\n• Start with simple examples\n• Progress to complex problems\n• Build practical skills",
          estimatedTime: "3-4 hours",
          resources: ["Practice problems", "Coding exercises"]
        }
      ],
      recommendations: {
        immediate: [
          "📖 Review: Basic concepts in your topic area",
          "🎯 Identify: Specific points of confusion",
          "💻 Try: Simple examples to test understanding"
        ],
        shortTerm: [
          "📝 Practice: Work through simple examples daily",
          "🔍 Seek: Additional learning resources and tutorials",
          "🎯 Focus: One concept at a time until mastery"
        ],
        longTerm: [
          "🏗️ Build: Progress to more complex problems gradually",
          "🌐 Connect: Link concepts to real-world applications",
          "⚡ Master: Advanced topics in your field of study"
        ]
      }
    };
  };

  const commonConfusions = [
    "I don't understand recursion",
    "Pointers are confusing me",
    "Can't grasp dynamic programming",
    "Object-oriented concepts are unclear",
    "Time complexity analysis is hard",
    "Graph algorithms don't make sense",
    "I struggle with calculus derivatives",
    "Organic chemistry reactions confuse me",
    "Physics momentum problems are difficult"
  ];

  const gapTypeColors = {
    prerequisite: 'bg-red-100 text-red-700 border-red-200',
    conceptual: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    practice: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const severityColors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h1 className="text-3xl font-bold">AI Doubts Clarification 🔍</h1>
        </div>
        <p className="text-red-100 text-lg">Tell me what's confusing you, and I'll use AI to identify exactly what you're missing</p>
      </div>

      {/* Confusion Input */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <span>What's Confusing You?</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your confusion or struggle in detail
            </label>
            <textarea
              value={confusion}
              onChange={(e) => setConfusion(e.target.value)}
              placeholder="e.g., I don't understand how recursion works, or why my recursive function doesn't stop, or I'm confused about when to use which sorting algorithm..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Quick examples:</span>
            {commonConfusions.map((example, index) => (
              <button
                key={index}
                onClick={() => setConfusion(example)}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            onClick={analyzeConfusion}
            disabled={!confusion.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI is analyzing your confusion...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Analysis Results</h2>
          </div>

          {/* Root Cause Analysis */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Root Cause Analysis */}
            <div className={`p-6 rounded-lg border ${severityColors[analysis.severity]}`}>
              <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Root Cause Analysis</span>
              </h3>
              <div className="space-y-3">
                <p className="font-medium">{analysis.rootCause}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="px-2 py-1 bg-white bg-opacity-50 rounded">
                    Type: <strong>{analysis.confusionType}</strong>
                  </span>
                  <span className="px-2 py-1 bg-white bg-opacity-50 rounded">
                    Severity: <strong>{analysis.severity}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            {keyInsights.length > 0 && (
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg text-blue-800 mb-4 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>🔍 Key Insights</span>
                </h3>
                <ul className="space-y-2">
                  {keyInsights.map((insight, index) => (
                    <li key={index} className="text-blue-700 text-sm leading-relaxed">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="p-6 bg-green-50 rounded-lg border border-green-200 mb-6">
              <h3 className="font-bold text-lg text-green-800 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>⚡ Quick Actions (Do These NOW!)</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-white rounded-lg border border-green-200">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-green-700 text-sm font-medium leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Gaps */}
          {detectedGaps.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Detected Learning Gaps</span>
              </h3>

              <div className="space-y-4">
                {detectedGaps.map((gap, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{gap.topic}</h4>
                          <div className={`w-3 h-3 rounded-full ${priorityColors[gap.priority]}`}></div>
                          <span className="text-sm text-gray-500 capitalize">{gap.priority} priority</span>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${gapTypeColors[gap.type]}`}>
                          {gap.type === 'prerequisite' ? '📚 Missing Prerequisite' :
                           gap.type === 'conceptual' ? '💡 Conceptual Gap' :
                           '🎯 Practice Needed'}
                        </span>
                      </div>
                    </div>

                    <div className="text-gray-700 mb-3 leading-relaxed whitespace-pre-line">{gap.description}</div>

                    {gap.prerequisite && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">
                          <strong>Prerequisite:</strong> {gap.prerequisite}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <Play className="w-4 h-4" />
                        <span>Watch Video</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <BookOpen className="w-4 h-4" />
                        <span>Read Guide</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        <ExternalLink className="w-4 h-4" />
                        <span>Practice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Path */}
          {learningPath.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-green-600" />
                <span>AI-Recommended Learning Path</span>
              </h3>

              <div className="space-y-4">
                {learningPath.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{step.topic}</h4>
                      <div className="text-gray-700 text-sm mb-2 whitespace-pre-line">{step.description}</div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="bg-white px-2 py-1 rounded">⏱️ {step.estimatedTime}</span>
                        <span>📚 {step.resources.length} resources available</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {recommendations && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Recommendations</span>
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.immediate && (
                  <div>
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center space-x-1">
                      <span>🚀</span>
                      <span>Do Right Now</span>
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-2">
                      {recommendations.immediate.map((item: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendations.shortTerm && (
                  <div>
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center space-x-1">
                      <span>📅</span>
                      <span>This Week</span>
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-2">
                      {recommendations.shortTerm.map((item: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendations.longTerm && (
                  <div>
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center space-x-1">
                      <span>🎯</span>
                      <span>Long Term Goals</span>
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-2">
                      {recommendations.longTerm.map((item: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* API Integration Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <ExternalLink className="w-6 h-6 text-green-600" />
          <span>API Integration Demo</span>
        </h2>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Test API integration functionality with address update endpoint.
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddressUpdate}
              disabled={isUpdatingAddress}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isUpdatingAddress ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Address...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Update Sample Address</span>
                </>
              )}
            </button>
          </div>

          {apiResponse && (
            <div className={`p-4 rounded-lg border ${
              apiResponse.includes('successfully') 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <h4 className="font-medium mb-1">API Response:</h4>
              <p className="text-sm">{apiResponse}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">API Configuration:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Endpoint:</strong> https://api.example.com/addresses/12345</p>
              <p><strong>Method:</strong> PUT</p>
              <p><strong>API Key:</strong> {API_KEY.substring(0, 20)}...</p>
              <p><strong>Content-Type:</strong> application/json</p>
              <p><strong>Authorization:</strong> Bearer token</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Sample Request Data:</h4>
            <pre className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded overflow-x-auto">
{JSON.stringify({
  street: "123 New Street",
  city: "New City", 
  state: "NC",
  zip: "12345"
}, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How AI Doubts Clarification Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. AI Analysis</h3>
            <p className="text-gray-600 text-sm">Advanced AI analyzes your confusion to understand the root cause and context</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Gap Identification</h3>
            <p className="text-gray-600 text-sm">AI identifies missing prerequisites, conceptual gaps, and practice needs</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Smart Solutions</h3>
            <p className="text-gray-600 text-sm">Get personalized learning paths and targeted resources to fill your gaps</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapsDetector;