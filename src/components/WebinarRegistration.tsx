import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Clock, Users, Award, CheckCircle, ArrowLeft, ExternalLink, Globe, Video, Star, Zap } from 'lucide-react';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

const WebinarRegistration: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBackToDashboard = () => {
    window.history.back();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 Registration Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for registering for our webinar! We've sent a confirmation email to <strong>{formData.email}</strong>
          </p>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">What's Next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-blue-800">Check your email for webinar details and calendar invite</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-blue-800">Join our WhatsApp group for updates and reminders</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-blue-800">Prepare your questions for the Q&A session</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleBackToDashboard}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', phone: '' });
              }}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Video className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Educational Webinar Series</h1>
            </div>
            <p className="text-xl text-blue-100 mb-6">
              Master Previous Year Question Papers • All Subjects • Multiple Languages
            </p>
            
            {/* Webinar Highlights */}
            <div className="grid md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Calendar className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Live Sessions</div>
                <div className="text-blue-100 text-sm">Interactive Q&A</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Globe className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">9+ Languages</div>
                <div className="text-blue-100 text-sm">Regional support</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Award className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Expert Faculty</div>
                <div className="text-blue-100 text-sm">Experienced teachers</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Star className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Free Access</div>
                <div className="text-blue-100 text-sm">No hidden costs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🎓 Register for Free Webinar</h2>
              <p className="text-indigo-100 text-lg mb-6">
                Join thousands of students mastering previous year question papers
              </p>
              
              {/* Webinar Details */}
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Calendar className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-semibold text-sm">Next Session</div>
                  <div className="text-indigo-100 text-sm">Every Saturday</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Clock className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-semibold text-sm">Duration</div>
                  <div className="text-indigo-100 text-sm">2-3 Hours</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Users className="w-5 h-5 mx-auto mb-2" />
                  <div className="font-semibold text-sm">Format</div>
                  <div className="text-indigo-100 text-sm">Live + Q&A</div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number (e.g., +91 9876543210)"
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-5 rounded-xl font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    <span>Register for Free Webinar</span>
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-center text-sm text-gray-600">
                By registering, you agree to receive webinar updates via email and SMS. 
                <br />
                <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer">Privacy Policy</span> • 
                <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer ml-1">Terms of Service</span>
              </p>
            </form>
          </div>

          {/* Webinar Benefits */}
          <div className="bg-gray-50 p-8 border-t">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">🎯 What You'll Get</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">📚 Complete Question Paper Solutions</h4>
                    <p className="text-gray-600 text-sm">Step-by-step solutions for CBSE, State Boards, JEE, NEET, UPSC</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">🌍 Multi-Language Support</h4>
                    <p className="text-gray-600 text-sm">Content in Telugu, Hindi, Tamil, English, and more</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">🎯 Exam Strategy Tips</h4>
                    <p className="text-gray-600 text-sm">Time management, marking schemes, and scoring techniques</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">📱 PDF Downloads</h4>
                    <p className="text-gray-600 text-sm">Downloadable question papers and answer keys</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">🎤 Live Q&A Session</h4>
                    <p className="text-gray-600 text-sm">Direct interaction with expert faculty</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">🏆 Bonus Materials</h4>
                    <p className="text-gray-600 text-sm">Study guides, shortcuts, and preparation checklists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebinarRegistration;