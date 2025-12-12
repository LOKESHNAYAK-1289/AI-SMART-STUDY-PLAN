import React, { useState } from 'react';
import { Plus, Mic, Upload, Check, BookOpen, Clock, Trash2, FileText, Brain, Sparkles, AlertCircle, X } from 'lucide-react';
import { Topic } from '../types';

interface FileAnalysis {
  extractedTopics: string[];
  suggestedDifficulty: 'easy' | 'medium' | 'hard';
  estimatedStudyTime: string;
  keySubjects: string[];
  recommendations: string[];
}

const TopicTracker: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([
    { id: '1', name: 'Arrays and Strings', subject: 'Data Structures', completed: true, difficulty: 'easy', dateCompleted: new Date('2024-01-15') },
    { id: '2', name: 'Binary Trees', subject: 'Data Structures', completed: true, difficulty: 'medium', dateCompleted: new Date('2024-01-18') },
    { id: '3', name: 'Dynamic Programming', subject: 'Algorithms', completed: false, difficulty: 'hard' },
    { id: '4', name: 'Graph Algorithms', subject: 'Algorithms', completed: false, difficulty: 'hard' },
    { id: '5', name: 'Hash Tables', subject: 'Data Structures', completed: false, difficulty: 'medium' },
  ]);

  const [newTopic, setNewTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isListening, setIsListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const subjects = ['Data Structures', 'Algorithms', 'Mathematics', 'System Design', 'Databases', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Engineering'];

  const addTopic = () => {
    if (newTopic.trim()) {
      const topic: Topic = {
        id: Date.now().toString(),
        name: newTopic.trim(),
        subject: selectedSubject,
        completed: false,
        difficulty: selectedDifficulty
      };
      setTopics([...topics, topic]);
      setNewTopic('');
    }
  };

  const addTopicsFromAnalysis = (topicsToAdd: string[]) => {
    const newTopics = topicsToAdd.map(topicName => ({
      id: Date.now().toString() + Math.random(),
      name: topicName,
      subject: fileAnalysis?.keySubjects[0] || selectedSubject,
      completed: false,
      difficulty: fileAnalysis?.suggestedDifficulty || 'medium'
    }));
    
    setTopics(prev => [...prev, ...newTopics]);
    setShowAnalysis(false);
    setFileAnalysis(null);
    setUploadedFile(null);
  };

  const toggleTopicCompletion = (id: string) => {
    setTopics(topics.map(topic => 
      topic.id === id 
        ? { 
            ...topic, 
            completed: !topic.completed,
            dateCompleted: !topic.completed ? new Date() : undefined
          }
        : topic
    ));
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input - in real app, you'd integrate with Web Speech API
    setTimeout(() => {
      setNewTopic('Graph Theory Fundamentals');
      setIsListening(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      analyzeFile(file);
    }
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Read file content
      const text = await readFileContent(file);
      
      // Simulate AI analysis with realistic delay
      setTimeout(() => {
        const analysis = performFileAnalysis(text, file.name);
        setFileAnalysis(analysis);
        setShowAnalysis(true);
        setIsAnalyzing(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error analyzing file:', error);
      setIsAnalyzing(false);
      alert('Error analyzing file. Please try again.');
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      // Add more MIME types here
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/msword', // .doc
        'application/vnd.ms-powerpoint', // .ppt
      ];

      // Check file type with better error message
      if (!allowedTypes.includes(file.type)) {
        const readableType = file.type || file.name.split('.').pop();
        reject(new Error(`Unsupported file type: ${readableType}. Supported: PDF, TXT, MD, DOC, DOCX, PPT, PPTX`));
        return;
      }

      reader.onload = (event) => {
        const result = event.target?.result as string;
        resolve(result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Handle different file types
      if (file.type === 'application/pdf') {
        // For PDF files, simulate extraction (in production, use pdf-parse library)
        resolve('Sample PDF content with topics like Data Structures, Algorithms, Computer Networks, Database Management Systems, Operating Systems, Software Engineering, Machine Learning, Artificial Intelligence, Web Development, Mobile Development');
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.type === 'application/msword') {
        // For DOCX/DOC files, simulate extraction (in production, use mammoth library)
        resolve('Sample DOCX content with academic topics including Advanced Mathematics, Statistical Analysis, Research Methodology, Data Visualization, Programming Fundamentals, Software Development, Project Management, Technical Writing');
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
                 file.type === 'application/vnd.ms-powerpoint') {
        // For PPTX/PPT files, simulate extraction
        resolve('Sample presentation content covering Introduction to Machine Learning, Neural Networks, Deep Learning Algorithms, Computer Vision, Natural Language Processing, Data Mining, Big Data Analytics, Cloud Computing');
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        const readableType = file.type || file.name.split('.').pop();
        reject(new Error(`Unsupported file type: ${readableType}. Supported: PDF, TXT, MD, DOC, DOCX, PPT, PPTX`));
      }
    });
  };

  const performFileAnalysis = (content: string, fileName: string): FileAnalysis => {
    // Simulate AI analysis based on content
    const lowerContent = content.toLowerCase();
    
    // Extract potential topics using keyword matching
    const topicKeywords = [
      'data structures', 'algorithms', 'arrays', 'linked lists', 'trees', 'graphs',
      'sorting', 'searching', 'dynamic programming', 'recursion', 'hash tables',
      'stacks', 'queues', 'binary search', 'depth first search', 'breadth first search',
      'machine learning', 'artificial intelligence', 'neural networks', 'deep learning',
      'computer networks', 'database management', 'operating systems', 'software engineering',
      'web development', 'mobile development', 'cybersecurity', 'cloud computing',
      'calculus', 'linear algebra', 'statistics', 'probability', 'discrete mathematics',
      'physics', 'mechanics', 'thermodynamics', 'electromagnetism', 'quantum physics',
      'chemistry', 'organic chemistry', 'inorganic chemistry', 'physical chemistry',
      'biology', 'genetics', 'molecular biology', 'cell biology', 'ecology'
    ];

    const extractedTopics = topicKeywords
      .filter(keyword => lowerContent.includes(keyword))
      .map(keyword => keyword.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '))
      .slice(0, 8); // Limit to 8 topics

    // Determine subject based on content
    let primarySubject = 'Computer Science';
    if (lowerContent.includes('math') || lowerContent.includes('calculus') || lowerContent.includes('algebra')) {
      primarySubject = 'Mathematics';
    } else if (lowerContent.includes('physics') || lowerContent.includes('mechanics')) {
      primarySubject = 'Physics';
    } else if (lowerContent.includes('chemistry') || lowerContent.includes('chemical')) {
      primarySubject = 'Chemistry';
    } else if (lowerContent.includes('biology') || lowerContent.includes('biological')) {
      primarySubject = 'Biology';
    } else if (lowerContent.includes('engineering') || lowerContent.includes('mechanical')) {
      primarySubject = 'Engineering';
    }

    // Determine difficulty based on content complexity
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    if (lowerContent.includes('advanced') || lowerContent.includes('complex') || lowerContent.includes('graduate')) {
      difficulty = 'hard';
    } else if (lowerContent.includes('basic') || lowerContent.includes('introduction') || lowerContent.includes('beginner')) {
      difficulty = 'easy';
    }

    // Generate recommendations
    const recommendations = [
      `Start with foundational topics in ${primarySubject}`,
      'Create a study schedule with 2-3 topics per week',
      'Use active recall and spaced repetition for better retention',
      'Practice with real-world examples and projects',
      'Join study groups or online communities for discussion'
    ];

    return {
      extractedTopics,
      suggestedDifficulty: difficulty,
      estimatedStudyTime: `${Math.ceil(extractedTopics.length * 1.5)} weeks`,
      keySubjects: [primarySubject],
      recommendations
    };
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileAnalysis(null);
    setShowAnalysis(false);
  };

  const completedTopics = topics.filter(t => t.completed).length;
  const totalTopics = topics.length;
  const completionRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Topic Tracker</h1>
        <p className="text-gray-600">Track your learning progress and manage your study topics</p>
        
        {/* Progress Overview */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Overall Progress</span>
            <span className="text-sm font-bold text-blue-700">{completedTopics}/{totalTopics} topics completed</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
          </div>
          <p className="text-xs text-blue-600 mt-1">{completionRate.toFixed(1)}% complete</p>
        </div>
      </div>

      {/* Add New Topic */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Topic</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic Name</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Enter topic name..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                />
                <button
                  onClick={startVoiceInput}
                  className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                    isListening 
                      ? 'border-red-500 bg-red-50 text-red-600' 
                      : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              {isListening && (
                <p className="text-sm text-red-600 mt-1">🎤 Listening... Speak now!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="flex space-x-3">
                {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? difficulty === 'easy' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                          difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                          'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addTopic}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Topic</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* File Upload Section */}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.txt,.md,.doc,.docx,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload Syllabus or Study Material</p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX, TXT, MD supported</p>
                <button
                  type="button"
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Choose File
                </button>
              </label>
            </div>

            {/* Uploaded File Display */}
            {uploadedFile && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{uploadedFile.name}</span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-blue-600">
                  Size: {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
                
                {isAnalyzing && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-700">AI is analyzing your file...</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Use voice input while walking or commuting</li>
                <li>• Upload your syllabus to auto-extract topics</li>
                <li>• Mark topics complete as you learn them</li>
                <li>• AI will suggest optimal study sequences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Results */}
      {showAnalysis && fileAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Analysis Results</h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Analysis Summary */}
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">📊 Analysis Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Primary Subject:</span>
                    <span className="font-medium text-purple-900">{fileAnalysis.keySubjects[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Suggested Difficulty:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      fileAnalysis.suggestedDifficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      fileAnalysis.suggestedDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {fileAnalysis.suggestedDifficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Estimated Study Time:</span>
                    <span className="font-medium text-purple-900">{fileAnalysis.estimatedStudyTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Topics Found:</span>
                    <span className="font-medium text-purple-900">{fileAnalysis.extractedTopics.length}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">🎯 AI Recommendations</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  {fileAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Extracted Topics */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">📚 Extracted Topics</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {fileAnalysis.extractedTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <span className="font-medium text-gray-900">{topic}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        fileAnalysis.suggestedDifficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        fileAnalysis.suggestedDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {fileAnalysis.suggestedDifficulty}
                      </span>
                      <span className="text-xs text-gray-500">{fileAnalysis.keySubjects[0]}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => addTopicsFromAnalysis(fileAnalysis.extractedTopics)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add All Topics</span>
                </button>
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topics List */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Topics</h2>
        
        <div className="space-y-3">
          {topics.map((topic) => (
            <div key={topic.id} className={`p-4 rounded-lg border-2 transition-all ${
              topic.completed 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-white hover:border-blue-200'
            }`}>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleTopicCompletion(topic.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    topic.completed 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {topic.completed && <Check className="w-4 h-4" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className={`font-semibold ${topic.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                      {topic.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      topic.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      topic.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{topic.subject}</span>
                    </span>
                    {topic.dateCompleted && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Completed {topic.dateCompleted.toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTopic(topic.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No topics added yet. Start by adding your first topic or uploading a syllabus!</p>
          </div>
        )}
      </div>

      {/* How AI Analysis Works */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How AI File Analysis Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Upload File</h3>
            <p className="text-gray-600 text-sm">Upload your syllabus, study material, or course outline in PDF, DOC, DOCX, PPT, PPTX, TXT, or MD format</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
            <p className="text-gray-600 text-sm">Our AI extracts topics, determines difficulty levels, and suggests optimal study sequences</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Smart Recommendations</h3>
            <p className="text-gray-600 text-sm">Get personalized study plans, time estimates, and learning recommendations</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Supported File Types</h4>
              <p className="text-blue-700 text-sm">
                PDF documents, Word documents (.doc, .docx), PowerPoint presentations (.ppt, .pptx), 
                Text files (.txt), and Markdown files (.md). The AI can extract topics from course syllabi, 
                study guides, textbook chapters, lecture slides, and academic papers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicTracker;