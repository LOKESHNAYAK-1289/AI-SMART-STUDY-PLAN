import React, { useState } from 'react';
import { CheckCircle, Brain, TrendingUp, Clock, Target, Search, BookOpen, Zap } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  topics: string[];
}

interface StudyPlanDay {
  day: number;
  date: string;
  sessions: Array<{
    timeSlot: string;
    topic: string;
    duration: number;
    objectives: string[];
    studyMethod: string;
    resources: string[];
  }>;
  totalHours: number;
  dailyGoal: string;
}

const Dashboard: React.FC = () => {
  // State for study plan generator
  const [searchSubject, setSearchSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [studyDays, setStudyDays] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlanDay[]>([]);
  const [planSummary, setPlanSummary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Expanded subjects and topics
  const subjects: Subject[] = [
    // STEM Subjects
    {
      id: '1',
      name: 'Mathematics',
      topics: ['Calculus', 'Linear Algebra', 'Statistics', 'Probability', 'Discrete Mathematics', 'Number Theory', 'Geometry', 'Trigonometry', 'Differential Equations', 'Complex Analysis', 'Mathematical Logic', 'Topology', 'Real Analysis', 'Abstract Algebra']
    },
    {
      id: '2',
      name: 'Physics',
      topics: ['Classical Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Quantum Mechanics', 'Relativity', 'Nuclear Physics', 'Particle Physics', 'Astrophysics', 'Condensed Matter Physics', 'Fluid Dynamics', 'Statistical Mechanics']
    },
    {
      id: '3',
      name: 'Chemistry',
      topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Environmental Chemistry', 'Polymer Chemistry', 'Electrochemistry', 'Medicinal Chemistry', 'Materials Chemistry', 'Computational Chemistry', 'Green Chemistry']
    },
    {
      id: '4',
      name: 'Biology',
      topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Anatomy', 'Physiology', 'Molecular Biology', 'Biotechnology', 'Microbiology', 'Botany', 'Zoology', 'Marine Biology', 'Neuroscience', 'Immunology', 'Bioinformatics']
    },
    {
      id: '5',
      name: 'Computer Science',
      topics: ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Software Engineering', 'Machine Learning', 'Artificial Intelligence', 'Cybersecurity', 'Web Development', 'Mobile Development', 'Computer Graphics', 'Human-Computer Interaction', 'Distributed Systems']
    },
    
    // Programming Languages
    {
      id: '6',
      name: 'Python Programming',
      topics: ['Basic Syntax', 'Data Types', 'Functions', 'OOP in Python', 'Libraries (NumPy, Pandas)', 'Web Frameworks (Django, Flask)', 'Data Science', 'Machine Learning', 'GUI Development', 'Testing', 'Async Programming', 'Web Scraping']
    },
    {
      id: '7',
      name: 'Java Programming',
      topics: ['OOP Concepts', 'Data Structures', 'Collections Framework', 'Multithreading', 'Exception Handling', 'File I/O', 'JDBC', 'Spring Framework', 'Hibernate', 'Design Patterns', 'JVM Architecture', 'Maven/Gradle']
    },
    {
      id: '8',
      name: 'JavaScript Programming',
      topics: ['ES6+ Features', 'DOM Manipulation', 'Async Programming', 'Node.js', 'React.js', 'Vue.js', 'Angular', 'TypeScript', 'Express.js', 'MongoDB', 'REST APIs', 'GraphQL']
    },
    {
      id: '9',
      name: 'C++ Programming',
      topics: ['Object-Oriented Programming', 'Memory Management', 'STL', 'Templates', 'Pointers', 'Data Structures', 'Algorithms', 'System Programming', 'Game Development', 'Embedded Systems']
    },
    
    // Engineering Disciplines
    {
      id: '10',
      name: 'Mechanical Engineering',
      topics: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'Machine Design', 'Manufacturing Processes', 'Materials Science', 'Control Systems', 'Robotics', 'CAD/CAM', 'Automotive Engineering']
    },
    {
      id: '11',
      name: 'Electrical Engineering',
      topics: ['Circuit Analysis', 'Electronics', 'Power Systems', 'Control Systems', 'Signal Processing', 'Communications', 'Microprocessors', 'VLSI Design', 'Renewable Energy', 'Electromagnetics']
    },
    {
      id: '12',
      name: 'Civil Engineering',
      topics: ['Structural Engineering', 'Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering', 'Water Resources', 'Construction Management', 'Surveying', 'Urban Planning', 'Earthquake Engineering', 'Materials Testing']
    },
    {
      id: '13',
      name: 'Chemical Engineering',
      topics: ['Process Design', 'Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'Mass Transfer', 'Reaction Engineering', 'Process Control', 'Safety Engineering', 'Environmental Engineering', 'Biochemical Engineering']
    },
    
    // Medical Sciences
    {
      id: '14',
      name: 'Medicine',
      topics: ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology', 'Microbiology', 'Biochemistry', 'Internal Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Cardiology', 'Neurology', 'Oncology', 'Radiology']
    },
    {
      id: '15',
      name: 'Nursing',
      topics: ['Fundamentals of Nursing', 'Medical-Surgical Nursing', 'Pediatric Nursing', 'Psychiatric Nursing', 'Community Health Nursing', 'Critical Care Nursing', 'Pharmacology', 'Anatomy & Physiology', 'Patient Care', 'Healthcare Ethics']
    },
    {
      id: '16',
      name: 'Pharmacy',
      topics: ['Pharmacology', 'Pharmaceutical Chemistry', 'Pharmacognosy', 'Pharmaceutics', 'Clinical Pharmacy', 'Hospital Pharmacy', 'Drug Development', 'Toxicology', 'Biopharmaceutics', 'Regulatory Affairs']
    },
    {
      id: '17',
      name: 'Dentistry',
      topics: ['Oral Anatomy', 'Dental Materials', 'Oral Pathology', 'Periodontics', 'Endodontics', 'Orthodontics', 'Oral Surgery', 'Prosthodontics', 'Pediatric Dentistry', 'Dental Radiology']
    },
    
    // Business & Economics
    {
      id: '18',
      name: 'Business Administration',
      topics: ['Management Principles', 'Marketing', 'Finance', 'Human Resources', 'Operations Management', 'Business Ethics', 'Entrepreneurship', 'Strategic Management', 'Organizational Behavior', 'Business Law', 'International Business', 'Digital Marketing']
    },
    {
      id: '19',
      name: 'Economics',
      topics: ['Microeconomics', 'Macroeconomics', 'International Trade', 'Public Finance', 'Development Economics', 'Monetary Policy', 'Fiscal Policy', 'Economic Growth', 'Market Structures', 'Game Theory', 'Econometrics', 'Behavioral Economics']
    },
    {
      id: '20',
      name: 'Accounting & Finance',
      topics: ['Financial Accounting', 'Cost Accounting', 'Management Accounting', 'Auditing', 'Taxation', 'Corporate Finance', 'Investment Analysis', 'Banking', 'Insurance', 'Financial Markets', 'Risk Management', 'International Finance']
    },
    {
      id: '21',
      name: 'Marketing',
      topics: ['Consumer Behavior', 'Market Research', 'Brand Management', 'Digital Marketing', 'Social Media Marketing', 'Content Marketing', 'SEO/SEM', 'Sales Management', 'Advertising', 'Public Relations', 'E-commerce', 'Marketing Analytics']
    },
    
    // Social Sciences & Humanities
    {
      id: '22',
      name: 'Psychology',
      topics: ['Cognitive Psychology', 'Social Psychology', 'Developmental Psychology', 'Abnormal Psychology', 'Research Methods', 'Statistics in Psychology', 'Personality Psychology', 'Neuropsychology', 'Clinical Psychology', 'Educational Psychology', 'Forensic Psychology', 'Health Psychology']
    },
    {
      id: '23',
      name: 'Sociology',
      topics: ['Social Theory', 'Social Institutions', 'Social Change', 'Social Stratification', 'Culture and Society', 'Research Methods', 'Urban Sociology', 'Rural Sociology', 'Gender Studies', 'Social Problems', 'Criminology', 'Medical Sociology']
    },
    {
      id: '24',
      name: 'Political Science',
      topics: ['Political Theory', 'Comparative Politics', 'International Relations', 'Public Administration', 'Constitutional Law', 'Political Economy', 'Democracy', 'Governance', 'Political Parties', 'Electoral Systems', 'Public Policy', 'Diplomacy']
    },
    {
      id: '25',
      name: 'History',
      topics: ['Ancient History', 'Medieval History', 'Modern History', 'World Wars', 'Colonial History', 'Independence Movements', 'Constitutional History', 'Economic History', 'Social History', 'Cultural History', 'Art History', 'Military History']
    },
    {
      id: '26',
      name: 'Geography',
      topics: ['Physical Geography', 'Human Geography', 'Economic Geography', 'Environmental Geography', 'Cartography', 'Remote Sensing', 'GIS', 'Climate Change', 'Urban Planning', 'Regional Studies', 'Geopolitics', 'Cultural Geography']
    },
    {
      id: '27',
      name: 'Philosophy',
      topics: ['Logic', 'Ethics', 'Metaphysics', 'Epistemology', 'Political Philosophy', 'Philosophy of Mind', 'Philosophy of Science', 'Ancient Philosophy', 'Modern Philosophy', 'Contemporary Philosophy', 'Eastern Philosophy', 'Applied Ethics']
    },
    
    // Languages & Literature
    {
      id: '28',
      name: 'English Literature',
      topics: ['Poetry Analysis', 'Novel Studies', 'Drama', 'Literary Criticism', 'Creative Writing', 'Grammar', 'Composition', 'World Literature', 'Contemporary Literature', 'Classical Literature', 'Comparative Literature', 'Literary Theory']
    },
    {
      id: '29',
      name: 'Linguistics',
      topics: ['Phonetics', 'Phonology', 'Morphology', 'Syntax', 'Semantics', 'Pragmatics', 'Sociolinguistics', 'Psycholinguistics', 'Historical Linguistics', 'Applied Linguistics', 'Language Acquisition', 'Translation Studies']
    },
    {
      id: '30',
      name: 'Foreign Languages',
      topics: ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Language Pedagogy']
    },
    
    // Arts & Design
    {
      id: '31',
      name: 'Fine Arts',
      topics: ['Drawing', 'Painting', 'Sculpture', 'Printmaking', 'Art History', 'Art Criticism', 'Contemporary Art', 'Digital Art', 'Installation Art', 'Performance Art', 'Art Theory', 'Museum Studies']
    },
    {
      id: '32',
      name: 'Graphic Design',
      topics: ['Typography', 'Layout Design', 'Brand Identity', 'Logo Design', 'Web Design', 'UI/UX Design', 'Print Design', 'Digital Illustration', 'Motion Graphics', 'Design Theory', 'Color Theory', 'Design Software']
    },
    {
      id: '33',
      name: 'Architecture',
      topics: ['Architectural Design', 'Building Technology', 'Structural Systems', 'Environmental Design', 'Urban Planning', 'Architectural History', 'Construction Management', 'Sustainable Design', 'Interior Design', 'Landscape Architecture']
    },
    {
      id: '34',
      name: 'Music',
      topics: ['Music Theory', 'Composition', 'Performance', 'Music History', 'Ethnomusicology', 'Music Technology', 'Conducting', 'Music Education', 'Jazz Studies', 'Classical Music', 'Popular Music', 'Sound Engineering']
    },
    
    // Media & Communication
    {
      id: '35',
      name: 'Mass Communication',
      topics: ['Journalism', 'Broadcasting', 'Public Relations', 'Advertising', 'Media Studies', 'Communication Theory', 'Digital Media', 'Social Media', 'Film Studies', 'Documentary Production', 'Media Ethics', 'Media Law']
    },
    {
      id: '36',
      name: 'Film & Television',
      topics: ['Cinematography', 'Film Direction', 'Screenwriting', 'Film Editing', 'Sound Design', 'Production Management', 'Film History', 'Documentary Filmmaking', 'Animation', 'Visual Effects', 'Film Criticism', 'Television Production']
    },
    
    // Education
    {
      id: '37',
      name: 'Education',
      topics: ['Educational Psychology', 'Curriculum Development', 'Teaching Methods', 'Assessment & Evaluation', 'Educational Technology', 'Special Education', 'Early Childhood Education', 'Adult Education', 'Educational Administration', 'Comparative Education', 'Educational Research']
    },
    
    // Law
    {
      id: '38',
      name: 'Law',
      topics: ['Constitutional Law', 'Criminal Law', 'Civil Law', 'Contract Law', 'Property Law', 'Corporate Law', 'International Law', 'Human Rights', 'Legal Research', 'Jurisprudence', 'Environmental Law', 'Intellectual Property Law']
    },
    
    // Agriculture & Environmental Sciences
    {
      id: '39',
      name: 'Agriculture',
      topics: ['Crop Science', 'Soil Science', 'Plant Pathology', 'Entomology', 'Animal Husbandry', 'Agricultural Economics', 'Farm Management', 'Sustainable Agriculture', 'Biotechnology', 'Food Science', 'Horticulture', 'Agricultural Engineering']
    },
    {
      id: '40',
      name: 'Environmental Science',
      topics: ['Ecology', 'Environmental Chemistry', 'Environmental Biology', 'Climate Change', 'Pollution Control', 'Natural Resource Management', 'Environmental Policy', 'Sustainability', 'Conservation Biology', 'Environmental Impact Assessment', 'Renewable Energy', 'Waste Management']
    },
    
    // Sports & Physical Education
    {
      id: '41',
      name: 'Physical Education',
      topics: ['Exercise Physiology', 'Sports Psychology', 'Biomechanics', 'Sports Medicine', 'Nutrition', 'Coaching', 'Sports Management', 'Fitness Training', 'Rehabilitation', 'Sports Sociology', 'Motor Learning', 'Athletic Training']
    },
    
    // Competitive Exams
    {
      id: '42',
      name: 'Competitive Exams (India)',
      topics: ['UPSC Civil Services', 'SSC Exams', 'Banking Exams', 'Railway Exams', 'Defense Exams', 'State PSC', 'JEE/NEET', 'GATE', 'UGC NET', 'CLAT', 'CAT/MAT', 'GRE/GMAT']
    },
    {
      id: '43',
      name: 'International Exams',
      topics: ['SAT', 'ACT', 'GRE', 'GMAT', 'TOEFL', 'IELTS', 'MCAT', 'LSAT', 'CPA', 'CFA', 'PMP', 'AWS Certifications']
    },
    
    // Vocational & Technical
    {
      id: '44',
      name: 'Information Technology',
      topics: ['Network Administration', 'System Administration', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Data Analytics', 'Digital Forensics', 'IT Project Management', 'Enterprise Architecture', 'IT Service Management']
    },
    {
      id: '45',
      name: 'Data Science',
      topics: ['Statistics', 'Machine Learning', 'Deep Learning', 'Data Mining', 'Big Data', 'Data Visualization', 'Python/R Programming', 'SQL', 'Business Intelligence', 'Predictive Analytics', 'Natural Language Processing', 'Computer Vision']
    },
    
    // Emerging Fields
    {
      id: '46',
      name: 'Artificial Intelligence',
      topics: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'Natural Language Processing', 'Robotics', 'Expert Systems', 'AI Ethics', 'Reinforcement Learning', 'Generative AI', 'AI in Healthcare', 'AI in Finance']
    },
    {
      id: '47',
      name: 'Cybersecurity',
      topics: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Digital Forensics', 'Risk Management', 'Compliance', 'Incident Response', 'Malware Analysis', 'Penetration Testing', 'Security Architecture', 'Cloud Security', 'IoT Security']
    },
    {
      id: '48',
      name: 'Blockchain Technology',
      topics: ['Blockchain Fundamentals', 'Cryptocurrency', 'Smart Contracts', 'DeFi', 'NFTs', 'Consensus Mechanisms', 'Blockchain Development', 'Ethereum', 'Bitcoin', 'Hyperledger', 'Blockchain Security', 'Regulatory Aspects']
    },
    
    // Interdisciplinary Studies
    {
      id: '49',
      name: 'Biotechnology',
      topics: ['Genetic Engineering', 'Bioinformatics', 'Bioprocessing', 'Medical Biotechnology', 'Agricultural Biotechnology', 'Industrial Biotechnology', 'Stem Cell Research', 'Gene Therapy', 'Biosafety', 'Bioethics', 'Nanobiotechnology']
    },
    {
      id: '50',
      name: 'Nanotechnology',
      topics: ['Nanomaterials', 'Nanoelectronics', 'Nanomedicine', 'Nanocomposites', 'Characterization Techniques', 'Fabrication Methods', 'Applications', 'Safety & Ethics', 'Quantum Effects', 'Self-Assembly', 'Nanodevices']
    }
  ];

  // Add comprehensive programming subjects
  const programmingSubjects: Subject[] = [
    // Core Programming Languages
    {
      id: '51',
      name: 'Python Programming',
      topics: ['Basic Syntax', 'Data Types & Variables', 'Control Structures', 'Functions', 'Object-Oriented Programming', 'Exception Handling', 'File I/O', 'Modules & Packages', 'Decorators', 'Generators', 'Lambda Functions', 'List Comprehensions', 'Regular Expressions', 'Threading & Multiprocessing', 'Web Scraping', 'Data Science Libraries (NumPy, Pandas)', 'Web Frameworks (Django, Flask)', 'Testing (unittest, pytest)', 'Virtual Environments', 'Package Management (pip)']
    },
    {
      id: '52',
      name: 'Java Programming',
      topics: ['Java Fundamentals', 'Object-Oriented Programming', 'Inheritance & Polymorphism', 'Abstract Classes & Interfaces', 'Exception Handling', 'Collections Framework', 'Generics', 'Multithreading', 'File I/O & NIO', 'JDBC Database Connectivity', 'Java 8+ Features (Streams, Lambda)', 'Design Patterns', 'JVM Architecture', 'Memory Management', 'Spring Framework', 'Spring Boot', 'Hibernate ORM', 'Maven & Gradle', 'JUnit Testing', 'Annotations']
    },
    {
      id: '53',
      name: 'JavaScript Programming',
      topics: ['JavaScript Fundamentals', 'ES6+ Features', 'DOM Manipulation', 'Event Handling', 'Asynchronous Programming (Promises, async/await)', 'Closures & Scope', 'Prototypes & Inheritance', 'Arrow Functions', 'Destructuring', 'Modules (ES6)', 'Error Handling', 'Regular Expressions', 'JSON Handling', 'Local Storage & Session Storage', 'Fetch API', 'Web APIs', 'Debugging Techniques', 'Performance Optimization', 'Memory Management', 'Testing (Jest, Mocha)']
    },
    {
      id: '54',
      name: 'C++ Programming',
      topics: ['C++ Fundamentals', 'Object-Oriented Programming', 'Pointers & References', 'Memory Management', 'STL (Standard Template Library)', 'Templates', 'Operator Overloading', 'Inheritance & Polymorphism', 'Virtual Functions', 'Exception Handling', 'File I/O', 'Preprocessor Directives', 'Namespaces', 'Smart Pointers', 'Move Semantics', 'Lambda Expressions', 'Multithreading', 'Design Patterns', 'Data Structures Implementation', 'Algorithm Implementation']
    },
    {
      id: '55',
      name: 'C# Programming',
      topics: ['C# Fundamentals', '.NET Framework/.NET Core', 'Object-Oriented Programming', 'Properties & Indexers', 'Delegates & Events', 'LINQ', 'Generics', 'Collections', 'Exception Handling', 'File I/O', 'Reflection', 'Attributes', 'Async/Await', 'Entity Framework', 'ASP.NET Core', 'Web API Development', 'Dependency Injection', 'Unit Testing (NUnit, xUnit)', 'NuGet Package Management', 'Windows Forms/WPF']
    },
    {
      id: '56',
      name: 'Go Programming',
      topics: ['Go Fundamentals', 'Variables & Types', 'Functions', 'Structs & Methods', 'Interfaces', 'Goroutines', 'Channels', 'Error Handling', 'Packages & Modules', 'Pointers', 'Slices & Maps', 'JSON Handling', 'HTTP Programming', 'Testing', 'Benchmarking', 'Reflection', 'Context Package', 'Concurrency Patterns', 'Web Development (Gin, Echo)', 'Database Integration']
    },
    {
      id: '57',
      name: 'Rust Programming',
      topics: ['Rust Fundamentals', 'Ownership & Borrowing', 'Lifetimes', 'Structs & Enums', 'Pattern Matching', 'Error Handling (Result, Option)', 'Traits', 'Generics', 'Collections', 'Iterators', 'Closures', 'Smart Pointers', 'Concurrency', 'Unsafe Rust', 'Macros', 'Cargo Package Manager', 'Testing', 'Documentation', 'WebAssembly', 'Systems Programming']
    },
    {
      id: '58',
      name: 'PHP Programming',
      topics: ['PHP Fundamentals', 'Variables & Data Types', 'Control Structures', 'Functions', 'Object-Oriented Programming', 'Namespaces', 'Error Handling', 'File Handling', 'Sessions & Cookies', 'Database Integration (PDO, MySQLi)', 'Regular Expressions', 'JSON & XML Processing', 'Composer Package Manager', 'Laravel Framework', 'Symfony Framework', 'RESTful APIs', 'Security Best Practices', 'Testing (PHPUnit)', 'Performance Optimization', 'Debugging']
    },
    {
      id: '59',
      name: 'TypeScript Programming',
      topics: ['TypeScript Fundamentals', 'Type Annotations', 'Interfaces', 'Classes', 'Generics', 'Enums', 'Union & Intersection Types', 'Type Guards', 'Decorators', 'Modules', 'Namespaces', 'Advanced Types', 'Utility Types', 'Declaration Files', 'Compiler Configuration', 'Integration with JavaScript', 'React with TypeScript', 'Node.js with TypeScript', 'Testing', 'Build Tools Integration']
    },
    {
      id: '60',
      name: 'Kotlin Programming',
      topics: ['Kotlin Fundamentals', 'Null Safety', 'Data Classes', 'Extension Functions', 'Higher-Order Functions', 'Lambdas', 'Coroutines', 'Collections', 'Object-Oriented Programming', 'Functional Programming', 'Interoperability with Java', 'Android Development', 'Spring Boot with Kotlin', 'Testing', 'DSL Creation', 'Reflection', 'Annotations', 'Multiplatform Development', 'Gradle with Kotlin', 'Best Practices']
    },
    {
      id: '61',
      name: 'Swift Programming',
      topics: ['Swift Fundamentals', 'Optionals', 'Closures', 'Enumerations', 'Structures & Classes', 'Properties', 'Methods', 'Inheritance', 'Initialization', 'Deinitialization', 'Automatic Reference Counting', 'Error Handling', 'Type Casting', 'Nested Types', 'Extensions', 'Protocols', 'Generics', 'Access Control', 'iOS Development', 'SwiftUI']
    },
    {
      id: '62',
      name: 'Ruby Programming',
      topics: ['Ruby Fundamentals', 'Object-Oriented Programming', 'Blocks & Iterators', 'Modules & Mixins', 'Metaprogramming', 'Regular Expressions', 'File I/O', 'Exception Handling', 'Testing (RSpec, Minitest)', 'Gems & Bundler', 'Ruby on Rails', 'Active Record', 'RESTful APIs', 'Database Integration', 'Web Development', 'Debugging', 'Performance Optimization', 'Best Practices', 'Design Patterns', 'Deployment']
    },
    {
      id: '63',
      name: 'Scala Programming',
      topics: ['Scala Fundamentals', 'Functional Programming', 'Object-Oriented Programming', 'Pattern Matching', 'Case Classes', 'Traits', 'Collections', 'Higher-Order Functions', 'Implicits', 'Type System', 'Concurrency (Actors)', 'SBT Build Tool', 'Testing (ScalaTest)', 'Spark with Scala', 'Play Framework', 'Akka Framework', 'Cats Library', 'Monads', 'Type Classes', 'Best Practices']
    },
    {
      id: '64',
      name: 'R Programming',
      topics: ['R Fundamentals', 'Data Types & Structures', 'Data Manipulation', 'Statistical Analysis', 'Data Visualization (ggplot2)', 'Functions', 'Control Structures', 'Package Management', 'Data Import/Export', 'String Manipulation', 'Regular Expressions', 'Apply Functions', 'Debugging', 'R Markdown', 'Shiny Applications', 'Machine Learning', 'Time Series Analysis', 'Statistical Modeling', 'Bioinformatics', 'Performance Optimization']
    },
    {
      id: '65',
      name: 'MATLAB Programming',
      topics: ['MATLAB Fundamentals', 'Arrays & Matrices', 'Functions & Scripts', 'Control Flow', 'Data Types', 'File I/O', 'Graphics & Plotting', 'Image Processing', 'Signal Processing', 'Numerical Methods', 'Optimization', 'Statistics & Machine Learning', 'Simulink', 'App Designer', 'Parallel Computing', 'GPU Computing', 'Toolboxes', 'Debugging', 'Performance Optimization', 'Integration with Other Languages']
    },

    // Web Development Technologies
    {
      id: '66',
      name: 'HTML & CSS',
      topics: ['HTML5 Semantics', 'CSS3 Features', 'Responsive Design', 'Flexbox', 'CSS Grid', 'Animations & Transitions', 'Media Queries', 'CSS Preprocessors (Sass, Less)', 'CSS Frameworks (Bootstrap, Tailwind)', 'Web Accessibility', 'SEO Best Practices', 'Cross-Browser Compatibility', 'CSS Methodologies (BEM, OOCSS)', 'Performance Optimization', 'CSS Variables', 'Modern Layout Techniques', 'Form Styling', 'Typography', 'Color Theory', 'Web Standards']
    },
    {
      id: '67',
      name: 'React.js',
      topics: ['React Fundamentals', 'JSX', 'Components & Props', 'State & Lifecycle', 'Event Handling', 'Conditional Rendering', 'Lists & Keys', 'Forms', 'Hooks (useState, useEffect, useContext)', 'Custom Hooks', 'Context API', 'React Router', 'State Management (Redux, Zustand)', 'Testing (Jest, React Testing Library)', 'Performance Optimization', 'Error Boundaries', 'Code Splitting', 'Server-Side Rendering (Next.js)', 'TypeScript with React', 'Best Practices']
    },
    {
      id: '68',
      name: 'Angular',
      topics: ['Angular Fundamentals', 'TypeScript', 'Components', 'Templates', 'Data Binding', 'Directives', 'Services & Dependency Injection', 'HTTP Client', 'Routing', 'Forms (Template-driven, Reactive)', 'Pipes', 'Lifecycle Hooks', 'Observables & RxJS', 'State Management (NgRx)', 'Testing (Jasmine, Karma)', 'Angular CLI', 'Modules', 'Lazy Loading', 'PWA Development', 'Performance Optimization']
    },
    {
      id: '69',
      name: 'Vue.js',
      topics: ['Vue.js Fundamentals', 'Vue Instance', 'Templates & Directives', 'Components', 'Props & Events', 'Computed Properties', 'Watchers', 'Lifecycle Hooks', 'Vue Router', 'Vuex State Management', 'Composition API', 'Single File Components', 'Vue CLI', 'Nuxt.js', 'Testing (Vue Test Utils)', 'Transitions & Animations', 'Custom Directives', 'Plugins', 'Performance Optimization', 'Best Practices']
    },
    {
      id: '70',
      name: 'Node.js',
      topics: ['Node.js Fundamentals', 'Event Loop', 'Modules (CommonJS, ES6)', 'File System', 'HTTP Module', 'Express.js Framework', 'Middleware', 'Routing', 'RESTful APIs', 'Database Integration', 'Authentication & Authorization', 'Error Handling', 'Async/Await', 'Streams', 'Buffer', 'Child Processes', 'Cluster Module', 'Testing (Mocha, Jest)', 'Debugging', 'Performance Optimization']
    },

    // Database Technologies
    {
      id: '71',
      name: 'SQL & Database Design',
      topics: ['SQL Fundamentals', 'DDL & DML', 'Joins', 'Subqueries', 'Aggregate Functions', 'Window Functions', 'Indexes', 'Views', 'Stored Procedures', 'Triggers', 'Transactions', 'ACID Properties', 'Normalization', 'Database Design', 'Performance Tuning', 'Query Optimization', 'Backup & Recovery', 'Security', 'NoSQL Concepts', 'Database Administration']
    },
    {
      id: '72',
      name: 'MongoDB',
      topics: ['MongoDB Fundamentals', 'Documents & Collections', 'CRUD Operations', 'Query Language', 'Indexing', 'Aggregation Framework', 'Data Modeling', 'Schema Design', 'Replication', 'Sharding', 'GridFS', 'Transactions', 'Security', 'Performance Optimization', 'Mongoose ODM', 'Atlas Cloud', 'Backup & Recovery', 'Monitoring', 'Best Practices', 'Migration Strategies']
    },
    {
      id: '73',
      name: 'PostgreSQL',
      topics: ['PostgreSQL Fundamentals', 'Advanced Data Types', 'JSON/JSONB', 'Arrays', 'Full-Text Search', 'Window Functions', 'Common Table Expressions', 'Stored Procedures', 'Triggers', 'Extensions', 'Partitioning', 'Replication', 'Performance Tuning', 'Query Planning', 'Backup & Recovery', 'Security', 'Connection Pooling', 'Monitoring', 'High Availability', 'Best Practices']
    },
    {
      id: '74',
      name: 'MySQL',
      topics: ['MySQL Fundamentals', 'Storage Engines', 'Indexing Strategies', 'Query Optimization', 'Stored Procedures', 'Functions', 'Triggers', 'Views', 'Partitioning', 'Replication', 'Clustering', 'Backup & Recovery', 'Security', 'Performance Tuning', 'Monitoring', 'High Availability', 'MySQL Workbench', 'Administration', 'Best Practices', 'Migration']
    },

    // Mobile Development
    {
      id: '75',
      name: 'Android Development',
      topics: ['Android Fundamentals', 'Activities & Fragments', 'Layouts & Views', 'Intent & Intent Filters', 'Services', 'Broadcast Receivers', 'Content Providers', 'SQLite Database', 'Shared Preferences', 'Networking', 'JSON Parsing', 'Material Design', 'RecyclerView', 'Navigation Component', 'MVVM Architecture', 'Room Database', 'Retrofit', 'Dagger/Hilt', 'Testing', 'Publishing']
    },
    {
      id: '76',
      name: 'iOS Development',
      topics: ['iOS Fundamentals', 'UIKit', 'SwiftUI', 'View Controllers', 'Auto Layout', 'Table Views', 'Collection Views', 'Navigation', 'Core Data', 'Networking', 'JSON Parsing', 'Delegates & Protocols', 'Notifications', 'Core Animation', 'Grand Central Dispatch', 'Memory Management', 'Testing (XCTest)', 'App Store Guidelines', 'Human Interface Guidelines', 'Publishing']
    },
    {
      id: '77',
      name: 'React Native',
      topics: ['React Native Fundamentals', 'Components & Styling', 'Navigation', 'State Management', 'AsyncStorage', 'Networking', 'Native Modules', 'Platform-Specific Code', 'Debugging', 'Performance Optimization', 'Testing', 'Deployment', 'Push Notifications', 'Camera & Media', 'Maps Integration', 'Third-Party Libraries', 'Code Push', 'Expo Framework', 'Best Practices', 'Troubleshooting']
    },
    {
      id: '78',
      name: 'Flutter',
      topics: ['Flutter Fundamentals', 'Dart Language', 'Widgets', 'Layouts', 'State Management', 'Navigation & Routing', 'Animations', 'Networking', 'Local Storage', 'Platform Channels', 'Testing', 'Debugging', 'Performance Optimization', 'Material Design', 'Cupertino Design', 'Packages & Plugins', 'Deployment', 'Firebase Integration', 'Best Practices', 'Cross-Platform Development']
    },

    // DevOps & Cloud Technologies
    {
      id: '79',
      name: 'Docker & Containerization',
      topics: ['Docker Fundamentals', 'Images & Containers', 'Dockerfile', 'Docker Compose', 'Volumes', 'Networks', 'Multi-stage Builds', 'Container Orchestration', 'Kubernetes Basics', 'Docker Swarm', 'Registry Management', 'Security Best Practices', 'Monitoring', 'Logging', 'CI/CD Integration', 'Microservices', 'Performance Optimization', 'Troubleshooting', 'Production Deployment', 'Best Practices']
    },
    {
      id: '80',
      name: 'AWS Cloud Services',
      topics: ['AWS Fundamentals', 'EC2', 'S3', 'RDS', 'Lambda', 'API Gateway', 'CloudFormation', 'CloudWatch', 'IAM', 'VPC', 'Route 53', 'CloudFront', 'ELB', 'Auto Scaling', 'ECS/EKS', 'DynamoDB', 'SNS/SQS', 'ElastiCache', 'Security Best Practices', 'Cost Optimization']
    },
    {
      id: '81',
      name: 'Kubernetes',
      topics: ['Kubernetes Fundamentals', 'Pods', 'Services', 'Deployments', 'ConfigMaps & Secrets', 'Volumes', 'Namespaces', 'Ingress', 'RBAC', 'Helm Charts', 'Monitoring', 'Logging', 'Networking', 'Security', 'Cluster Management', 'CI/CD Integration', 'Troubleshooting', 'Performance Tuning', 'Best Practices', 'Production Deployment']
    },
    {
      id: '82',
      name: 'Git & Version Control',
      topics: ['Git Fundamentals', 'Repository Management', 'Branching & Merging', 'Remote Repositories', 'Conflict Resolution', 'Git Workflow', 'Rebasing', 'Stashing', 'Tagging', 'Git Hooks', 'GitHub/GitLab', 'Pull Requests', 'Code Review', 'CI/CD Integration', 'Git Best Practices', 'Advanced Git Commands', 'Git Internals', 'Troubleshooting', 'Team Collaboration', 'Release Management']
    },

    // Testing & Quality Assurance
    {
      id: '83',
      name: 'Software Testing',
      topics: ['Testing Fundamentals', 'Unit Testing', 'Integration Testing', 'System Testing', 'Acceptance Testing', 'Test-Driven Development', 'Behavior-Driven Development', 'Test Automation', 'Selenium WebDriver', 'API Testing', 'Performance Testing', 'Security Testing', 'Mobile Testing', 'Cross-Browser Testing', 'Test Planning', 'Test Case Design', 'Bug Reporting', 'Test Management Tools', 'CI/CD Testing', 'Quality Assurance']
    },

    // Data Science & Machine Learning
    {
      id: '84',
      name: 'Machine Learning',
      topics: ['ML Fundamentals', 'Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM', 'Neural Networks', 'Deep Learning', 'Feature Engineering', 'Model Evaluation', 'Cross-Validation', 'Hyperparameter Tuning', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Model Deployment', 'MLOps']
    },
    {
      id: '85',
      name: 'Data Analysis & Visualization',
      topics: ['Data Analysis Fundamentals', 'Pandas', 'NumPy', 'Data Cleaning', 'Exploratory Data Analysis', 'Statistical Analysis', 'Data Visualization', 'Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI', 'Excel Advanced', 'SQL for Analysis', 'Time Series Analysis', 'A/B Testing', 'Business Intelligence', 'Dashboard Creation', 'Reporting', 'Data Storytelling']
    },

    // Cybersecurity
    {
      id: '86',
      name: 'Cybersecurity',
      topics: ['Security Fundamentals', 'Network Security', 'Web Application Security', 'Cryptography', 'Ethical Hacking', 'Penetration Testing', 'Vulnerability Assessment', 'Incident Response', 'Digital Forensics', 'Risk Management', 'Compliance', 'Security Frameworks', 'OWASP Top 10', 'Security Tools', 'Malware Analysis', 'Social Engineering', 'Cloud Security', 'Mobile Security', 'IoT Security', 'Security Awareness']
    },

    // Game Development
    {
      id: '87',
      name: 'Game Development',
      topics: ['Game Design Fundamentals', 'Unity Engine', 'Unreal Engine', 'C# for Unity', 'C++ for Unreal', 'Game Physics', '2D Game Development', '3D Game Development', 'Animation Systems', 'Audio Integration', 'UI/UX for Games', 'Multiplayer Networking', 'Game Optimization', 'Mobile Game Development', 'VR/AR Development', 'Game Testing', 'Publishing', 'Monetization', 'Game Analytics', 'Indie Game Development']
    },

    // Emerging Technologies
    {
      id: '88',
      name: 'Blockchain Development',
      topics: ['Blockchain Fundamentals', 'Cryptocurrency', 'Smart Contracts', 'Solidity', 'Ethereum', 'Web3.js', 'DeFi', 'NFTs', 'Consensus Mechanisms', 'Hyperledger', 'Bitcoin', 'Cryptocurrency Trading', 'Blockchain Security', 'Decentralized Applications', 'IPFS', 'Tokenomics', 'Regulatory Compliance', 'Blockchain Testing', 'Deployment', 'Best Practices']
    },
    {
      id: '89',
      name: 'Internet of Things (IoT)',
      topics: ['IoT Fundamentals', 'Arduino Programming', 'Raspberry Pi', 'Sensors & Actuators', 'Communication Protocols', 'MQTT', 'IoT Security', 'Cloud Integration', 'Data Analytics', 'Edge Computing', 'Industrial IoT', 'Smart Home', 'Wearable Technology', 'IoT Platforms', 'Device Management', 'Firmware Development', 'Power Management', 'Wireless Technologies', 'IoT Testing', 'Deployment Strategies']
    },
    {
      id: '90',
      name: 'Augmented & Virtual Reality',
      topics: ['AR/VR Fundamentals', 'Unity for AR/VR', 'Unreal Engine VR', 'ARCore', 'ARKit', 'Oculus Development', 'HTC Vive', 'WebXR', '3D Modeling', 'Spatial Computing', 'Hand Tracking', 'Eye Tracking', 'Haptic Feedback', 'Performance Optimization', 'User Experience Design', 'Mixed Reality', 'AR/VR Testing', 'Deployment', 'Hardware Integration', 'Future Technologies']
    }
  ];

  // Combine all subjects
  const allSubjects = [...subjects, ...programmingSubjects];

  const filteredSubjects = allSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchSubject.toLowerCase())
  );

  const stats = {
    topicsCompleted: 12,
    totalTopics: 24,
    gapsResolved: 5,
    studyStreak: 7
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedTopics([]);
    setSearchSubject('');
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleGenerateStudyPlan = async () => {
    if (selectedTopics.length === 0 || !selectedSubject) return;

    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      const mockPlan = generateMockStudyPlan();
      setGeneratedPlan(mockPlan.plan);
      setPlanSummary(mockPlan.summary);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockStudyPlan = () => {
    const plan = [];
    const hoursPerTopic = (studyDays * hoursPerDay) / selectedTopics.length;
    
    for (let day = 1; day <= studyDays; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day - 1);
      
      const topicsForDay = selectedTopics.slice(
        Math.floor((day - 1) * selectedTopics.length / studyDays),
        Math.floor(day * selectedTopics.length / studyDays)
      );

      if (topicsForDay.length > 0) {
        plan.push({
          day,
          date: date.toISOString().split('T')[0],
          sessions: topicsForDay.map((topic, index) => ({
            timeSlot: index === 0 ? 'Morning' : index === 1 ? 'Afternoon' : 'Evening',
            topic,
            duration: Math.min(hoursPerTopic, hoursPerDay),
            objectives: [`Study ${topic} fundamentals`, `Practice ${topic} problems`],
            studyMethod: 'Reading and Practice',
            resources: ['Textbook', 'Online tutorials']
          })),
          totalHours: hoursPerDay,
          dailyGoal: `Master ${topicsForDay.join(' and ')}`
        });
      }
    }

    return {
      plan,
      summary: {
        totalTopics: selectedTopics.length,
        totalHours: studyDays * hoursPerDay,
        difficulty: 'Medium',
        recommendations: ['Take regular breaks', 'Review previous topics', 'Practice consistently']
      }
    };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to AI Smart Study Plan! 👋</h1>
        <p className="text-blue-100 text-lg">Your intelligent study companion. Ready to create personalized learning plans?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Topics Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.topicsCompleted}/{stats.totalTopics}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(stats.topicsCompleted / stats.totalTopics) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gaps Resolved</p>
              <p className="text-2xl font-bold text-blue-600">{stats.gapsResolved}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-orange-600">{stats.studyStreak} days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Focus</p>
              <p className="text-2xl font-bold text-purple-600">2.5h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* AI-Powered Study Plan Generator */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Zap className="w-7 h-7 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Study Plan Generator</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Subject Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Subject ({allSubjects.length} available)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  placeholder="Search subjects (Physics, Math, Computer Science, Biology...)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {searchSubject && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSubjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => handleSubjectSelect(subject)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-gray-500">{subject.topics.length} topics available</div>
                    </button>
                  ))}
                  {filteredSubjects.length === 0 && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No subjects found matching "{searchSubject}"
                    </div>
                  )}
                </div>
              )}

              {selectedSubject && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Selected: {selectedSubject.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Topics Selection */}
            {selectedSubject && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Topics to Study ({selectedTopics.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
                  {selectedSubject.topics.map((topic) => (
                    <label key={topic} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => handleTopicToggle(topic)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Study Configuration */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={studyDays}
                  onChange={(e) => setStudyDays(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours per Day: {hoursPerDay}h
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateStudyPlan}
              disabled={selectedTopics.length === 0 || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI is creating your plan...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Generate AI Study Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Generated Plan */}
          <div>
            {generatedPlan.length > 0 ? (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>Your AI-Generated Study Plan</span>
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generatedPlan.map((day) => (
                    <div key={day.day} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Day {day.day}</h4>
                        <div className="text-sm text-gray-500">
                          {day.date} • {day.totalHours}h total
                        </div>
                      </div>
                      
                      <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                        <strong>Goal:</strong> {day.dailyGoal}
                      </div>
                      
                      <div className="space-y-2">
                        {day.sessions.map((session, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  session.timeSlot === 'Morning' ? 'bg-yellow-400' :
                                  session.timeSlot === 'Afternoon' ? 'bg-orange-400' : 'bg-purple-400'
                                }`}></div>
                                <span className="font-medium text-gray-800">{session.topic}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {session.duration}h • {session.timeSlot}
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              <strong>Method:</strong> {session.studyMethod}
                            </div>
                            <div className="text-xs text-gray-600">
                              <strong>Objectives:</strong> {session.objectives.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {planSummary && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">AI Plan Summary</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>• {planSummary.totalTopics} topics over {studyDays} days</p>
                      <p>• {planSummary.totalHours} total study hours</p>
                      <p>• Difficulty level: {planSummary.difficulty}</p>
                      {planSummary.recommendations && (
                        <div className="mt-2">
                          <strong>AI Tips:</strong>
                          <ul className="ml-4 mt-1">
                            {planSummary.recommendations.map((tip: string, index: number) => (
                              <li key={index}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Study Plan Yet</h3>
                <p className="text-gray-500">Select a subject and topics to generate your AI-powered study plan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Subject Access */}
      <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-lg font-bold">Quick Access</h2>
        </div>
        <p className="text-green-100 leading-relaxed mb-4">
          {allSubjects.length} subjects available including STEM, Humanities, Commerce, and Professional courses.
        </p>
        <div className="text-sm text-green-100">
          <p className="mb-1">📚 STEM: Physics, Math, Chemistry, CS</p>
          <p className="mb-1">📖 Humanities: History, Literature, Philosophy</p>
          <p className="mb-1">💼 Commerce: Economics, Business, Accountancy</p>
          <p>⚖️ Professional: Law, Medicine, Engineering</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;