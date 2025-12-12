import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, CameraOff, AlertCircle, Loader, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface FaceDetectionProps {
  onMoodDetected?: (mood: string) => void;
  className?: string;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({ onMoodDetected, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionStats, setDetectionStats] = useState({
    facesCount: 0,
    confidence: 0,
    lastDetection: null as Date | null
  });
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isDetectionActive, setIsDetectionActive] = useState(false);

  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load face-api.js models
  const loadModels = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const MODEL_URL = '/models';
      
      // Load all required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setIsModelLoaded(true);
      console.log('✅ Face-api.js models loaded successfully');
    } catch (err: any) {
      console.error('❌ Error loading face-api.js models:', err);
      setError('Failed to load face detection models. Please ensure models are placed in public/models folder.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        console.log('📹 Camera started successfully');
      }
    } catch (err: any) {
      console.error('❌ Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and refresh the page.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else {
        setError('Failed to access camera. Please check your camera settings.');
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setIsDetectionActive(false);
      console.log('📹 Camera stopped');
    }
  };

  // Start face detection
  const startDetection = () => {
    if (!isModelLoaded || !isCameraActive || !videoRef.current || !canvasRef.current) {
      return;
    }

    setIsDetectionActive(true);
    
    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        await detectFaces();
      }
    }, 100); // Detect every 100ms for smooth real-time detection
  };

  // Stop face detection
  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetectionActive(false);
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Face detection function
  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

    try {
      // Detect faces with landmarks and expressions
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      // Update canvas size to match video
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      };
      
      faceapi.matchDimensions(canvasRef.current, displaySize);

      // Clear previous drawings
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      if (detections.length > 0) {
        setFaceDetected(true);
        
        // Update detection stats
        const avgConfidence = detections.reduce((sum, det) => sum + det.detection.score, 0) / detections.length;
        setDetectionStats({
          facesCount: detections.length,
          confidence: Math.round(avgConfidence * 100),
          lastDetection: new Date()
        });

        // Resize detections to match canvas
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Draw face detection boxes
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        
        // Draw face landmarks if enabled
        if (showLandmarks) {
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        }

        // Draw face expressions
        faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

        // Get dominant emotion for mood detection
        if (detections[0].expressions && onMoodDetected) {
          const expressions = detections[0].expressions;
          const dominantEmotion = Object.entries(expressions).reduce((a, b) => 
            expressions[a[0] as keyof typeof expressions] > expressions[b[0] as keyof typeof expressions] ? a : b
          )[0];
          
          // Map face-api emotions to mood tracker emotions
          const moodMapping: Record<string, string> = {
            'happy': 'great',
            'neutral': 'okay',
            'sad': 'stressed',
            'angry': 'overwhelmed',
            'fearful': 'stressed',
            'disgusted': 'stressed',
            'surprised': 'good'
          };
          
          const mappedMood = moodMapping[dominantEmotion] || 'okay';
          onMoodDetected(mappedMood);
        }
      } else {
        setFaceDetected(false);
        setDetectionStats(prev => ({ ...prev, facesCount: 0 }));
      }
    } catch (err) {
      console.error('Face detection error:', err);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    loadModels();
    
    return () => {
      stopCamera();
      stopDetection();
    };
  }, []);

  // Auto-start detection when camera and models are ready
  useEffect(() => {
    if (isModelLoaded && isCameraActive && !isDetectionActive) {
      startDetection();
    }
  }, [isModelLoaded, isCameraActive]);

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
      stopDetection();
    } else {
      startCamera();
    }
  };

  const toggleDetection = () => {
    if (isDetectionActive) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Camera className="w-6 h-6 text-blue-600" />
            <span>Real-Time Face Detection</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            AI-powered mood detection using your camera
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`p-2 rounded-lg transition-colors ${
              showLandmarks 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Toggle face landmarks"
          >
            {showLandmarks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={toggleDetection}
            disabled={!isModelLoaded || !isCameraActive}
            className={`p-2 rounded-lg transition-colors ${
              isDetectionActive 
                ? 'bg-red-100 text-red-600' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
            title={isDetectionActive ? 'Stop detection' : 'Start detection'}
          >
            <RefreshCw className={`w-4 h-4 ${isDetectionActive ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={toggleCamera}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isCameraActive 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {isCameraActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                <span>Stop Camera</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Start Camera</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Camera Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              {error.includes('models') && (
                <div className="mt-3 text-sm text-red-700">
                  <p className="font-medium mb-2">Required model files:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>public/models/tiny_face_detector_model-weights_manifest.json</li>
                    <li>public/models/tiny_face_detector_model-shard1</li>
                    <li>public/models/face_landmark_68_model-weights_manifest.json</li>
                    <li>public/models/face_landmark_68_model-shard1</li>
                    <li>public/models/face_recognition_model-weights_manifest.json</li>
                    <li>public/models/face_recognition_model-shard1</li>
                    <li>public/models/face_expression_model-weights_manifest.json</li>
                    <li>public/models/face_expression_model-shard1</li>
                  </ul>
                  <p className="mt-2 text-red-600">
                    Download models from: <a href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights" target="_blank" rel="noopener noreferrer" className="underline">face-api.js GitHub</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading AI Models...</h3>
          <p className="text-gray-500">Preparing face detection capabilities</p>
        </div>
      )}

      {/* Camera View */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Video Container */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-auto max-h-96 object-cover"
              onLoadedMetadata={() => {
                if (canvasRef.current && videoRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth;
                  canvasRef.current.height = videoRef.current.videoHeight;
                }
              }}
            />
            
            {/* Overlay Canvas for Face Detection */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
            />

            {/* Status Overlay */}
            <div className="absolute top-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  faceDetected 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  {faceDetected ? '✅ Face Detected' : '❌ No Face Detected'}
                </div>
                
                {isDetectionActive && (
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Live Detection</span>
                  </div>
                )}
              </div>
            </div>

            {/* No Camera State */}
            {!isCameraActive && (
              <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                <div className="text-center text-white">
                  <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Camera Not Active</h3>
                  <p className="text-gray-300 text-sm">Click "Start Camera" to begin face detection</p>
                </div>
              </div>
            )}
          </div>

          {/* Detection Stats */}
          {isCameraActive && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Faces Detected</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{detectionStats.facesCount}</div>
                <div className="text-blue-600 text-sm">Currently visible</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Confidence</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{detectionStats.confidence}%</div>
                <div className="text-green-600 text-sm">Detection accuracy</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">Last Detection</span>
                </div>
                <div className="text-lg font-bold text-purple-900">
                  {detectionStats.lastDetection 
                    ? detectionStats.lastDetection.toLocaleTimeString()
                    : 'Never'
                  }
                </div>
                <div className="text-purple-600 text-sm">Latest face found</div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLandmarks}
                onChange={(e) => setShowLandmarks(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Show Face Landmarks</span>
            </label>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📋 How to Use Face Detection</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>1. <strong>Allow Camera Access:</strong> Click "Start Camera" and grant permission when prompted</p>
          <p>2. <strong>Position Your Face:</strong> Look directly at the camera for best detection</p>
          <p>3. <strong>AI Analysis:</strong> The system will detect your facial expressions for mood analysis</p>
          <p>4. <strong>Privacy:</strong> All processing happens locally - no data is sent to servers</p>
        </div>
      </div>

      {/* Model Setup Instructions */}
      {!isModelLoaded && !isLoading && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">⚙️ Setup Required</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>To enable face detection, download the required model files:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Visit: <a href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights" target="_blank" rel="noopener noreferrer" className="underline font-medium">face-api.js models</a></li>
              <li>Download all model files (.json and binary files)</li>
              <li>Create a <code className="bg-yellow-100 px-1 rounded">public/models</code> folder in your project</li>
              <li>Place all downloaded files in the <code className="bg-yellow-100 px-1 rounded">public/models</code> folder</li>
              <li>Refresh the page to load the models</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetection;