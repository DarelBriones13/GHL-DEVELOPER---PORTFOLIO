// ─────────────────────────────────────────
//  SHARED
// ─────────────────────────────────────────
export const personalInfo = {
  name: 'Darel S. Briones',
  location: 'Gingoog City, Misamis Oriental, Philippines',
  phone: '09947558334',
  email: 'darelbriones13@gmail.com',
  website: 'https://ghl-developer-portfolio.vercel.app/',
  tagline: 'Building smart systems, automating business processes, and providing reliable technical support through GoHighLevel, web development, and virtual assistance.',
  social: {
    github:   'https://github.com/DarelBriones13',
    linkedin: 'https://www.linkedin.com/in/darel-briones/',
    facebook: 'https://www.facebook.com/darelsabaria123',
  },
};

export const about = `Hi! I'm Darel S. Briones, a passionate GoHighLevel Specialist, Technical Virtual Assistant, and Full-Stack Web Developer from the Philippines.

I specialize in helping businesses simplify their daily operations by combining automation, CRM management, web development, and AI-powered solutions. My background in Information Technology has given me experience in designing websites, developing web applications, creating intelligent systems, and improving business workflows through modern technologies.

I believe that technology should reduce repetitive work so businesses can focus on growth.`;

export const education = [
  {
    id: 1,
    degree: 'Bachelor of Science in Information Technology',
    school: 'University / College Name',
    location: 'Gingoog City, Misamis Oriental',
    period: 'Aug 2021 – June 2026',
    status: 'Graduating',
    focusAreas: [
      'Web Development',
      'Mobile Development',
      'Artificial Intelligence',
      'Database Management',
      'Systems Analysis',
    ],
  },
];

export const internship = {
  title: 'Information Technology Intern',
  company: 'Local Civil Registrar Office (LCR)',
  period: 'Jan 2026 – Apr 2026',
  description: 'Worked closely with office staff to improve administrative processes through technology.',
  responsibilities: [
    'Performed accurate data entry and record management',
    'Organized and maintained digital records',
    'Assisted in database management',
    'Developed the LCR Management System',
    'Implemented an AI Autofill feature to improve encoding efficiency',
    'Provided technical support during system deployment',
    'Collaborated with employees to identify workflow improvements',
  ],
};

export const sharedStats = [
  { label: 'Projects Completed', value: 8,  suffix: '+' },
  { label: 'Technologies',       value: 20, suffix: '+' },
  { label: 'Years Learning',     value: 4,  suffix: '+' },
];

// ─────────────────────────────────────────
//  DEVELOPER MODE
// ─────────────────────────────────────────
export const devMode = {
  heroTitle: 'Full-Stack Web Developer',
  heroSubtitles: [
    'Full-Stack Web Developer',
    'Laravel & React Developer',
    'AI Solutions Builder',
    'Web Application Developer',
  ],
  heroIntro: 'Building responsive websites, management systems, and AI-powered applications using modern technologies. Passionate about clean code, scalable architecture, and user-friendly systems.',
  stats: [
    { label: 'Projects Built',    value: 8,  suffix: '+' },
    { label: 'Technologies Used', value: 15, suffix: '+' },
    { label: 'Years of Learning', value: 4,  suffix: '+' },
    { label: 'Lines of Code',     value: 50, suffix: 'K+' },
  ],
  skills: {
    technical: [
      { name: 'Laravel / PHP',      level: 88 },
      { name: 'React.js',           level: 78 },
      { name: 'JavaScript',         level: 85 },
      { name: 'HTML5 / CSS3',       level: 92 },
      { name: 'MySQL / PostgreSQL', level: 85 },
      { name: 'Supabase',           level: 75 },
      { name: 'REST APIs',          level: 87 },
      { name: 'Git / GitHub',       level: 88 },
      { name: 'Python',             level: 80 },
      { name: 'Flutter / Dart',     level: 78 },
    ],
    categories: [
      { name: 'Frontend',  skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Bootstrap'] },
      { name: 'Backend',   skills: ['Laravel', 'PHP', 'Python', 'REST APIs'] },
      { name: 'Database',  skills: ['MySQL', 'PostgreSQL', 'Supabase'] },
      { name: 'AI & Tools', skills: ['Groq API', 'AI Chatbots', 'Prompt Engineering'] },
      { name: 'Mobile',    skills: ['Flutter', 'Dart', 'Firebase'] },
    ],
    tools: ['VS Code', 'GitHub', 'Figma', 'Postman', 'Android Studio', 'Canva'],
  },
  experience: [
    {
      id: 1,
      title: 'GCC AI Chatbot',
      type: 'Full-Stack Development',
      period: 'June 2025 – Dec 2025',
      description: 'AI-powered chatbot for GCC that assists students, parents, and visitors by answering frequently asked questions from the school handbook.',
      highlights: [
        'Built with Laravel, PHP, MySQL, and Groq API',
        'AI-powered conversations with knowledge base',
        'Administrative dashboard for dynamic data management',
        'Smart search and fast inquiry responses',
      ],
      tech: ['Laravel', 'PHP', 'MySQL', 'Groq API', 'JavaScript'],
    },
    {
      id: 2,
      title: 'LCR Management System',
      type: 'Internship Project',
      period: 'Jan 2026 – Apr 2026',
      description: 'Management system for the Local Civil Registrar Office to improve record management and data processing with AI Autofill.',
      highlights: [
        'Digital record management and search',
        'AI Autofill for faster data entry',
        'Report generation and admin dashboard',
        'Built with Laravel, PHP, MySQL',
      ],
      tech: ['Laravel', 'PHP', 'MySQL', 'AI Integration'],
    },
  ],
  projects: [
    {
      id: 1,
      title: 'GCC AI Chatbot',
      description: 'AI-powered chatbot for GCC that answers FAQs using the school handbook knowledge base, with an admin dashboard for content management.',
      tech: ['Laravel', 'PHP', 'MySQL', 'Groq API', 'JavaScript'],
      category: 'AI & Automation',
      image: '/projects/gcc-ai-chatbot.png',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      demo: '#',
      github: 'https://github.com/DarelBriones13',
      featured: true,
    },
    {
      id: 2,
      title: 'Hybrid POS System',
      description: 'Modern Point-of-Sale system with inventory management, sales tracking, real-time database, and secure authentication.',
      tech: ['React.js', 'Supabase', 'JavaScript'],
      category: 'Web Application',
      image: '/projects/hybrid-pos.jpg',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 100%)',
      demo: '#',
      github: 'https://github.com/DarelBriones13',
      featured: true,
    },
    {
      id: 3,
      title: 'LCR Management System',
      description: 'Civil registry management system with digital records, AI-powered autofill, report generation, and an administrative dashboard.',
      tech: ['Laravel', 'PHP', 'MySQL', 'AI Integration'],
      category: 'Web Application',
      image: '/projects/lcr-management-system.jpg',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
      demo: '#',
      github: 'https://github.com/DarelBriones13',
      featured: true,
    },
    {
      id: 4,
      title: 'MediSync Patient Management System',
      description: 'A comprehensive patient management system for clinics featuring appointment scheduling, medical records, billing, and an admin dashboard.',
      tech: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
      category: 'Web Application',
      image: '/projects/patient-management-system.jpg',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 100%)',
      demo: '#',
      github: 'https://github.com/DarelBriones13',
      featured: false,
    },
  ],
  whyMe: [
    'Strong technical background in software and web development',
    'Experience developing real-world systems for organizations',
    'Hands-on with AI integration and automation tools',
    'Clean, maintainable code with best practices',
    'Fast learner who adapts quickly to new frameworks',
    'Bridges the gap between technical development and business needs',
  ],
};

// ─────────────────────────────────────────
//  GHL / VA MODE
// ─────────────────────────────────────────
export const ghlMode = {
  heroTitle: 'GoHighLevel Specialist & Technical VA',
  heroSubtitles: [
    'GoHighLevel Specialist',
    'Technical Virtual Assistant',
    'CRM Automation Specialist',
    'Business Systems Builder',
  ],
  heroIntro: 'Helping businesses simplify operations through GoHighLevel CRM automation, sales funnels, workflow systems, and reliable technical virtual assistance.',
  stats: [
    { label: 'GHL Systems Built', value: 3,  suffix: '+' },
    { label: 'Automations',       value: 10, suffix: '+' },
    { label: 'VA Skills',         value: 20, suffix: '+' },
    { label: 'Years Learning',    value: 4,  suffix: '+' },
  ],
  services: [
    {
      id: 'ghl',
      title: 'GoHighLevel Specialist',
      description: 'Complete GHL systems that help businesses automate their sales and customer management.',
      items: [
        'CRM Setup',
        'Workflow Automation',
        'Email Automation',
        'SMS Automation',
        'Sales Pipelines',
        'Landing Pages',
        'Funnels',
        'Website Builder',
        'Calendar Setup',
        'Appointment Booking',
        'Forms & Surveys',
        'Contact Management',
        'Opportunity Management',
        'Snapshot Creation',
        'Custom Fields',
        'Client Onboarding',
        'Basic API Integrations',
      ],
    },
    {
      id: 'va',
      title: 'Technical Virtual Assistant',
      description: 'Reliable administrative and technical support that keeps businesses organized and productive.',
      items: [
        'Calendar Management',
        'Email Management',
        'Google Workspace',
        'Google Sheets / Docs / Drive',
        'Microsoft Excel / Word',
        'Canva',
        'Internet Research',
        'Data Entry',
        'Lead Generation',
        'Appointment Scheduling',
        'CRM Management',
        'File Organization',
        'SOP Creation',
        'AI-assisted Productivity',
      ],
    },
  ],
  skills: {
    technical: [
      { name: 'GoHighLevel CRM',     level: 82 },
      { name: 'Workflow Automation',  level: 80 },
      { name: 'Email / SMS Automations', level: 78 },
      { name: 'Sales Funnels',        level: 75 },
      { name: 'Google Workspace',     level: 88 },
      { name: 'Microsoft Office',     level: 85 },
      { name: 'Canva',               level: 82 },
      { name: 'Data Entry',           level: 90 },
      { name: 'Lead Generation',      level: 78 },
      { name: 'AI-assisted Work',     level: 80 },
    ],
    categories: [
      { name: 'GoHighLevel',     skills: ['CRM Setup', 'Pipelines', 'Workflows', 'Email & SMS', 'Funnels', 'Snapshots'] },
      { name: 'Administrative',  skills: ['Calendar Mgmt', 'Email Mgmt', 'Data Entry', 'File Org', 'SOP Docs'] },
      { name: 'Google Suite',    skills: ['Sheets', 'Docs', 'Drive', 'Gmail', 'Calendar'] },
      { name: 'Creative Tools',  skills: ['Canva', 'Microsoft Word', 'Microsoft Excel'] },
      { name: 'AI Productivity', skills: ['ChatGPT', 'Claude AI', 'Prompt Engineering', 'AI Research'] },
    ],
    tools: ['GoHighLevel', 'Google Workspace', 'Microsoft Office', 'Canva', 'ChatGPT', 'Zapier'],
  },
  projects: [
    {
      id: 1,
      title: 'DarFitnessCoach CRM',
      status: 'upcoming',
      description: 'Complete coaching platform with client CRM, membership area, booking calendar, sales pipeline, email/SMS automation, and workout forms.',
      features: ['Client CRM', 'Membership Area', 'Booking Calendar', 'Sales Pipeline', 'Email & SMS Automation', 'Workout & Nutrition Forms', 'Client Portal', 'Landing Pages'],
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      demo: '#',
    },
    {
      id: 2,
      title: 'Dental Clinic CRM',
      status: 'upcoming',
      description: 'Complete appointment and patient management system with automated follow-ups, review requests, and missed appointment workflows.',
      features: ['Patient Booking', 'Calendar Management', 'Missed Appointment Automation', 'Follow-up Campaigns', 'Review Requests', 'Patient Pipeline', 'Email & SMS Reminders'],
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 100%)',
      demo: '#',
    },
    {
      id: 3,
      title: 'Real Estate CRM',
      status: 'upcoming',
      description: 'Lead generation and client management system for real estate businesses with buyer/seller pipelines and Facebook lead integration.',
      features: ['Buyer & Seller Pipelines', 'Property Landing Pages', 'Appointment Booking', 'Opportunity Tracking', 'Automated Follow-ups', 'Facebook Lead Integration', 'Email & SMS Campaigns'],
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
      demo: '#',
    },
  ],
  whyMe: [
    'Knowledge of GoHighLevel CRM and automation workflows',
    'Technical background that solves problems beyond basic VA tasks',
    'Organized, detail-oriented, and fast learner',
    'Able to bridge technical development and day-to-day business operations',
    'Experience with real-world administrative systems from internship',
    'AI-assisted productivity for faster and smarter output',
  ],
};

// ─────────────────────────────────────────
//  CERTIFICATIONS (shared)
// ─────────────────────────────────────────
export const certifications = [
  {
    id: 1,
    title: 'GoHighLevel CRM Specialist',
    issuer: 'GoHighLevel / Self-Study',
    date: '2025',
    category: 'ghl',
  },
  {
    id: 2,
    title: 'CRM & Workflow Automation',
    issuer: 'GoHighLevel Academy',
    date: '2025',
    category: 'ghl',
  },
  {
    id: 3,
    title: 'Web Development Fundamentals',
    issuer: 'Online Learning Platform',
    date: '2024',
    category: 'dev',
  },
  {
    id: 4,
    title: 'AI & Prompt Engineering',
    issuer: 'Coursera / DeepLearning.AI',
    date: '2024',
    category: 'dev',
  },
  {
    id: 5,
    title: 'Database Design & Management',
    issuer: 'Oracle / MySQL',
    date: '2025',
    category: 'dev',
  },
  {
    id: 6,
    title: 'Virtual Assistant Fundamentals',
    issuer: 'VA Bootcamp / Online',
    date: '2025',
    category: 'ghl',
  },
];
