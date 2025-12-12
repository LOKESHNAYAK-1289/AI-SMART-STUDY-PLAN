import React, { useState } from 'react';
import { User, GraduationCap, Code, Award, Briefcase, Mail, Phone, Github, Linkedin, Download, Eye, Edit3, Save, Plus, Trash2, FileText } from 'lucide-react';

interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  graduationYear: string;
  gpa?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    location: string;
  };
  objective: string;
  education: Education[];
  skills: {
    programming: string[];
    webDev: string[];
    tools: string[];
    softSkills: string[];
  };
  projects: Project[];
  certifications: Certification[];
  hobbies: string[];
}

const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: 'Durga Lokesh Nayak',
      email: 'durga.nayak@example.com',
      phone: '+91 9876543210',
      linkedin: 'linkedin.com/in/durga-nayak',
      github: 'github.com/durga-nayak',
      location: 'Vuyyuru, Andhra Pradesh'
    },
    objective: 'To utilize my technical knowledge and creativity to solve real-world problems and contribute to meaningful projects in the field of computer science.',
    education: [{
      id: '1',
      degree: 'B.Tech',
      field: 'Computer Science and Design (CSD)',
      institution: 'Vuyyuru Engineering College',
      location: 'Vuyyuru',
      graduationYear: '2026',
      gpa: '8.5'
    }],
    skills: {
      programming: ['Python', 'C', 'Java', 'JavaScript'],
      webDev: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
      tools: ['Git', 'VS Code', 'GitHub', 'Figma'],
      softSkills: ['Communication', 'Teamwork', 'Problem-solving', 'Leadership']
    },
    projects: [{
      id: '1',
      name: 'Project Kisan AI Assistant',
      description: 'An AI-based crop support tool for rural farmers to identify crop issues and get market price updates. Built using Python, machine learning algorithms, and web technologies.',
      technologies: ['Python', 'Machine Learning', 'Flask', 'HTML/CSS', 'JavaScript'],
      link: 'github.com/durga-nayak/kisan-ai'
    }],
    certifications: [{
      id: '1',
      name: 'Python for Everybody',
      issuer: 'University of Michigan (Coursera)',
      date: '2023',
      link: 'coursera.org/verify/certificate'
    }],
    hobbies: ['Exploring new technologies', 'UI/UX Design', 'Agriculture innovations', 'Open source contributions']
  });

  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSkills = (category: keyof typeof resumeData.skills, skills: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: skills }
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const deleteProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      link: ''
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const deleteCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    alert('Resume download feature would be implemented here. This would generate a professional PDF resume.');
  };

  if (previewMode) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Resume Preview</h1>
                <p className="text-blue-100">Professional resume for {resumeData.personalInfo.fullName}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setPreviewMode(false)}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDownload}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white rounded-xl shadow-lg border p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{resumeData.personalInfo.fullName}</h1>
            <div className="flex justify-center items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{resumeData.personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{resumeData.personalInfo.phone}</span>
              </div>
              <span>{resumeData.personalInfo.location}</span>
            </div>
            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
              <div className="flex justify-center items-center space-x-6 text-gray-600 mt-2">
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center space-x-1">
                    <Linkedin className="w-4 h-4" />
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.github && (
                  <div className="flex items-center space-x-1">
                    <Github className="w-4 h-4" />
                    <span>{resumeData.personalInfo.github}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Career Objective */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">CAREER OBJECTIVE</h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.objective}</p>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">EDUCATION</h2>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}, {edu.field}</h3>
                    <p className="text-gray-700">{edu.institution}, {edu.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Year of Graduation: {edu.graduationYear}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}/10</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">SKILLS</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Programming Languages:</h3>
                <p className="text-gray-700 mb-3">{resumeData.skills.programming.join(', ')}</p>
                
                <h3 className="font-semibold text-gray-900 mb-2">Web Development:</h3>
                <p className="text-gray-700">{resumeData.skills.webDev.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tools:</h3>
                <p className="text-gray-700 mb-3">{resumeData.skills.tools.join(', ')}</p>
                
                <h3 className="font-semibold text-gray-900 mb-2">Soft Skills:</h3>
                <p className="text-gray-700">{resumeData.skills.softSkills.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">PROJECTS</h2>
            {resumeData.projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <span className="text-blue-600 text-sm">{project.link}</span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <p className="text-gray-600 text-sm">
                  <strong>Technologies:</strong> {project.technologies.join(', ')}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">CERTIFICATIONS</h2>
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900">{cert.name}</span>
                      <span className="text-gray-700"> - {cert.issuer}</span>
                    </div>
                    <span className="text-gray-600">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hobbies */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">HOBBIES/INTERESTS</h2>
            <p className="text-gray-700">{resumeData.hobbies.join(', ')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Resume Builder 📄</h1>
              <p className="text-green-100">Create a professional resume that stands out</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setPreviewMode(true)}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleDownload}
              className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-2 font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <User className="w-6 h-6 text-blue-600" />
          <span>Personal Information</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn (optional)</label>
            <input
              type="text"
              value={resumeData.personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub (optional)</label>
            <input
              type="text"
              value={resumeData.personalInfo.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="github.com/yourusername"
            />
          </div>
        </div>
      </div>

      {/* Career Objective */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-purple-600" />
          <span>Career Objective</span>
        </h2>

        <textarea
          value={resumeData.objective}
          onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Write your career objective..."
        />
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-green-600" />
          <span>Education</span>
        </h2>

        {resumeData.education.map((edu, index) => (
          <div key={edu.id} className="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...edu, degree: e.target.value };
                  setResumeData(prev => ({ ...prev, education: newEducation }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...edu, field: e.target.value };
                  setResumeData(prev => ({ ...prev, education: newEducation }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...edu, institution: e.target.value };
                  setResumeData(prev => ({ ...prev, education: newEducation }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
              <input
                type="text"
                value={edu.graduationYear}
                onChange={(e) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...edu, graduationYear: e.target.value };
                  setResumeData(prev => ({ ...prev, education: newEducation }));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Code className="w-6 h-6 text-orange-600" />
          <span>Skills</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Programming Languages</label>
            <input
              type="text"
              value={resumeData.skills.programming.join(', ')}
              onChange={(e) => updateSkills('programming', e.target.value.split(', ').filter(s => s.trim()))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Python, Java, C++"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Web Development</label>
            <input
              type="text"
              value={resumeData.skills.webDev.join(', ')}
              onChange={(e) => updateSkills('webDev', e.target.value.split(', ').filter(s => s.trim()))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="HTML, CSS, JavaScript, React"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tools</label>
            <input
              type="text"
              value={resumeData.skills.tools.join(', ')}
              onChange={(e) => updateSkills('tools', e.target.value.split(', ').filter(s => s.trim()))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Git, VS Code, Docker"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
            <input
              type="text"
              value={resumeData.skills.softSkills.join(', ')}
              onChange={(e) => updateSkills('softSkills', e.target.value.split(', ').filter(s => s.trim()))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Communication, Teamwork, Leadership"
            />
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Code className="w-6 h-6 text-blue-600" />
            <span>Projects</span>
          </h2>
          <button
            onClick={addProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        {resumeData.projects.map((project, index) => (
          <div key={project.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Project {index + 1}</h3>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Link (optional)</label>
                <input
                  type="text"
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="github.com/username/project"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Describe your project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
              <input
                type="text"
                value={project.technologies.join(', ')}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(', ').filter(t => t.trim()))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-600" />
            <span>Certifications</span>
          </h2>
          <button
            onClick={addCertification}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>

        {resumeData.certifications.map((cert, index) => (
          <div key={cert.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Certification {index + 1}</h3>
              <button
                onClick={() => deleteCertification(cert.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issuer</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link (optional)</label>
                <input
                  type="text"
                  value={cert.link || ''}
                  onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Certificate verification link"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hobbies */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hobbies & Interests</h2>

        <textarea
          value={resumeData.hobbies.join(', ')}
          onChange={(e) => setResumeData(prev => ({ 
            ...prev, 
            hobbies: e.target.value.split(', ').filter(h => h.trim()) 
          }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Exploring new technologies, UI/UX Design, Photography"
        />
      </div>
    </div>
  );
};

export default ResumeBuilder;