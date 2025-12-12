import React, { useState } from 'react';
import { User, Calendar, Briefcase, GraduationCap, Heart, Save } from 'lucide-react';
import TagInput from './TagInput';
import MultiSelect from './MultiSelect';

interface ProfileData {
  full_name: string;
  surname: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  completed_education: string[];
  currently_pursuing: string;
  skills: string[];
  interested_topics: string[];
  hobbies: string[];
  employment_status: 'employed' | 'unemployed' | 'student' | 'freelancer' | 'other' | null;
  employment_domain: string;
}

const UserProfile: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: 'Demo User',
    surname: 'Student',
    date_of_birth: '2000-01-01',
    gender: 'prefer_not_to_say',
    completed_education: ['12th', 'btech'],
    currently_pursuing: 'Computer Science Engineering',
    skills: ['JavaScript', 'Python', 'React', 'Node.js'],
    interested_topics: ['Machine Learning', 'Web Development', 'Data Science'],
    hobbies: ['Reading', 'Gaming', 'Photography'],
    employment_status: 'student',
    employment_domain: '',
  });

  // Education options
  const educationOptions = [
    { value: '10th', label: '10th Grade' },
    { value: '12th', label: '12th Grade' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'btech', label: 'B.Tech' },
    { value: 'mtech', label: 'M.Tech' },
    { value: 'bsc', label: 'B.Sc' },
    { value: 'msc', label: 'M.Sc' },
    { value: 'ba', label: 'B.A' },
    { value: 'ma', label: 'M.A' },
    { value: 'phd', label: 'Ph.D' },
    { value: 'other', label: 'Other' },
  ];

  // Skill suggestions
  const skillSuggestions = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB',
    'Machine Learning', 'Data Science', 'Web Development', 'Mobile Development',
    'UI/UX Design', 'Project Management', 'Digital Marketing', 'Content Writing',
    'Photography', 'Video Editing', 'Graphic Design', 'Public Speaking'
  ];

  // Topic suggestions
  const topicSuggestions = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Engineering', 'Medicine', 'Business', 'Economics', 'Psychology',
    'Literature', 'History', 'Philosophy', 'Art', 'Music', 'Sports',
    'Artificial Intelligence', 'Data Structures', 'Algorithms', 'Databases'
  ];

  // Hobby suggestions
  const hobbySuggestions = [
    'Reading', 'Writing', 'Painting', 'Drawing', 'Photography', 'Cooking',
    'Gardening', 'Traveling', 'Gaming', 'Sports', 'Music', 'Dancing',
    'Hiking', 'Swimming', 'Cycling', 'Yoga', 'Meditation', 'Chess',
    'Board Games', 'Movies', 'TV Shows', 'Podcasts', 'Blogging'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage(null);

    // Simulate saving
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Profile updated successfully! (Demo mode - changes not saved)' });
      setSaving(false);
    }, 1000);
  };

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-blue-100">Complete your profile to get personalized study recommendations</p>
            <span className="inline-block mt-2 bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full font-medium">
              Demo Mode
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Personal Information</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surname
                </label>
                <input
                  type="text"
                  value={profileData.surname}
                  onChange={(e) => updateField('surname', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your surname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profileData.date_of_birth}
                  onChange={(e) => updateField('date_of_birth', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={profileData.gender || ''}
                  onChange={(e) => updateField('gender', e.target.value || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Education</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completed Education
                </label>
                <MultiSelect
                  options={educationOptions}
                  selected={profileData.completed_education}
                  onChange={(selected) => updateField('completed_education', selected)}
                  placeholder="Select completed education levels"
                  maxSelections={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currently Pursuing
                </label>
                <input
                  type="text"
                  value={profileData.currently_pursuing}
                  onChange={(e) => updateField('currently_pursuing', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., B.Tech Computer Science, MBA, etc."
                />
              </div>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Skills & Interests</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <TagInput
                  tags={profileData.skills}
                  onChange={(tags) => updateField('skills', tags)}
                  placeholder="Add your skills (press Enter or comma to add)"
                  suggestions={skillSuggestions}
                  maxTags={15}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interested Topics
                </label>
                <TagInput
                  tags={profileData.interested_topics}
                  onChange={(tags) => updateField('interested_topics', tags)}
                  placeholder="Add topics you're interested in"
                  suggestions={topicSuggestions}
                  maxTags={15}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hobbies
                </label>
                <TagInput
                  tags={profileData.hobbies}
                  onChange={(tags) => updateField('hobbies', tags)}
                  placeholder="Add your hobbies"
                  suggestions={hobbySuggestions}
                  maxTags={15}
                />
              </div>
            </div>
          </div>

          {/* Employment */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Employment</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Employment Status
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'employed', label: 'Employed' },
                    { value: 'unemployed', label: 'Unemployed' },
                    { value: 'student', label: 'Student' },
                    { value: 'freelancer', label: 'Freelancer' },
                    { value: 'other', label: 'Other' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="employment_status"
                        value={option.value}
                        checked={profileData.employment_status === option.value}
                        onChange={(e) => updateField('employment_status', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(profileData.employment_status === 'employed' || profileData.employment_status === 'freelancer') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Domain
                  </label>
                  <input
                    type="text"
                    value={profileData.employment_domain}
                    onChange={(e) => updateField('employment_domain', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Development, Marketing, Finance, etc."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Profile (Demo)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;