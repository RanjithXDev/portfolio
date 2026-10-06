/**
 * All site content lives here. Edit this file to update the site —
 * no component code needs to change.
 */

export const meta = {
  name: 'Ranjith MV',
  role: 'Junior Software Engineer',
  focus: 'AI Agents · AWS Bedrock · MERN',
  email: 'ranjithxdev@gmail.com',
  location: 'Chennai, Tamil Nadu, India',
  // Used for Open Graph tags and the canonical link. Update after deploying.
  siteUrl: 'https://ranjithxdev.dev',
  // Path under public/. Set to '' to hide the CV link entirely.
  resume: '/Ranjith_Resume.pdf',
  description:
    'Junior Software Engineer building AI agents and cloud applications with AWS Bedrock, Amazon Bedrock AgentCore, Python and the MERN stack.',
};

export const hero = {
  greeting: 'Hello, I am',
  name: 'Ranjith MV',
  role: 'Junior Software Engineer',
  tagline: 'AI Agents · AWS Bedrock · MERN',
  intro:
    'I build AI-powered enterprise solutions — agent workflows, MCP tools and REST integrations — on AWS Bedrock and the MERN stack.',
  actions: [
    { label: 'View Experience', href: '#experience', variant: 'primary' },
    { label: 'Get in Touch', href: '#contact', variant: 'ghost' },
    { label: 'Download CV', href: '/Ranjith_Resume.pdf', variant: 'ghost', download: true },
  ],
};

export const about = {
  heading: 'About',
  paragraphs: [
    'Junior Software Engineer with hands-on experience in AWS, AWS Bedrock, Amazon Bedrock AgentCore, AI agents, and cloud-based application development.',
    'Skilled in building AI-powered solutions using Python and JavaScript, with experience in agent orchestration, workflow automation, API integration, and enterprise AI use cases.',
    'Strong understanding of AWS services, REST APIs, MERN stack, SQL, and machine learning, with a focus on developing scalable, reliable, and production-oriented software solutions.',
  ],
};

export const experience = {
  heading: 'Experience',
  roles: [
    {
      title: 'Junior Software Engineer',
      dates: '2026 — Present',
      bullets: [
        'Developed AI-powered enterprise solutions using AWS, Amazon Bedrock, AgentCore Runtime, and Strands Agents, focusing on agent-based workflows and real-world business use cases.',
        'Built and integrated AI agents, MCP tools, REST APIs, and Knowledge Bases using Python, enabling agents to interact with tools and retrieve relevant contextual information.',
        'Designed agentic workflows and business process automation using Flowise and Activepieces, including task coordination, SLA monitoring, escalation handling, notifications, and workflow state management.',
        'Developed backend and full-stack applications using Python, JavaScript, Node.js, React, and SQL, with experience integrating REST APIs and AI capabilities into web applications.',
        'Developed and customized WordPress websites using PHP, JavaScript, HTML, CSS, and BuddyBoss, including custom UI components, API integrations, user-related functionality, and WordPress customization.',
        'Gained hands-on experience with core AWS services including EC2, IAM, S3, Lambda, EBS, Elastic Load Balancing, and Auto Scaling, covering cloud infrastructure, access management, compute, storage, and scalability.',
        'Worked on an AI-driven healthcare operations use case involving discharge coordination, department task management, SLA monitoring, automated escalation, bottleneck identification, and operational recommendations.',
      ],
    },
  ],
};

export const skills = {
  heading: 'Skills',
  categories: [
    {
      name: 'AI & Agents',
      items: [
        'AWS Bedrock',
        'AgentCore Runtime',
        'Strands Agents',
        'MCP Tools',
        'Machine Learning',
        'Knowledge Bases',
        'RAG',
      ],
    },
    {
      name: 'Automation & Workflow',
      items: ['Flowise', 'Activepieces', 'n8n'],
    },
    {
      name: 'Full Stack',
      items: ['MERN Stack', 'Python', 'Java', 'JavaScript', 'Node.js', 'React', 'SQL', 'REST APIs'],
    },
    {
      name: 'Cloud & Infra',
      items: ['EC2', 'IAM', 'S3', 'Lambda', 'EBS', 'Auto Scaling', 'Elastic Load Balancing'],
    },
    {
      name: 'Security',
      items: ['Keycloak', 'IAM', 'OAuth'],
    },
  ],
};

/**
 * Education and certifications.
 *
 * Certificate files live in `public/`. Set `file` to a path under public
 * (e.g. '/mongodb.pdf') to make the card a link, or leave it empty ('') and
 * the card renders as plain text with no dead link.
 *
 * Add a certification by appending to `certifications.items`:
 *   {
 *     name:   'Certification name',
 *     issuer: 'Issuing body',
 *     year:   '2025',
 *     file:   '/your-certificate.pdf',   // or '' for no link
 *   }
 */
export const credentials = {
  heading: 'Education & Certifications',

  education: [
    {
      degree: 'B.Tech, Artificial Intelligence and Data Science',
      institution: 'Kongu Engineering College',
      period: '2023 — 2027',
      result: 'CGPA 8.43 / 10.00',
    },
    {
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'Kongu Matriculation Higher Secondary School',
      period: '2022 — 2023',
      result: '85.16%',
    },
  ],

  certifications: {
    label: 'Certifications',
    items: [
      {
        name: 'MongoDB Certified Associate Developer',
        issuer: 'MongoDB',
        year: '',
        file: '/mongodb.pdf',
      },
      {
        name: 'Oracle APEX Cloud Developer Certified Professional',
        issuer: 'Oracle',
        year: '',
        file: '/oracle_certificate.pdf',
      },
      {
        name: 'Oracle Certified Professional: Java SE 17 Developer',
        issuer: 'Oracle',
        year: '',
        file: '/oracle_java_certificate.pdf',
      },
      {
        name: 'AWS Certified AI Practitioner',
        issuer: 'Amazon Web Services',
        year: '2026',
        file: '/aws_ai_practitioner_certificate.pdf',
      },
    ],
  },
};

/**
 * PLACEHOLDER PROJECTS — replace these with real work.
 *
 * Add a project by appending an object to this array:
 *   {
 *     title:       'Project name',
 *     blurb:       'One or two sentences on what it does and why it matters.',
 *     tags:        ['Python', 'Bedrock'],
 *     image:       '',                          // path under public/; omit for a typographic placeholder
 *     repoUrl:     'https://github.com/...',   // omit or leave '' to hide the link
 *     liveUrl:     '',                          // omit or leave '' to hide the link
 *     placeholder: false,                       // set false once it is real
 *   }
 *
 * Entries with `placeholder: true` render an "In progress" tag so you never
 * ship a fake project by accident. The first entry in this array always gets
 * a larger, featured treatment — put your strongest project first.
 */
export const projects = {
  heading: 'Projects',
  items: [
    {
      title: 'LQ-LegalAI',
      blurb:
        'An agentic legal document analysis platform I designed and built solo, end to end — a 13+ agent LangGraph pipeline on Amazon Bedrock handling clause extraction, risk scoring, a grounded Q&A chatbot, AI drafting, and English-Tamil translation. Hybrid BM25 + vector retrieval, tracked on F1, recall, and latency; shipped on ECS Fargate with PII masking before translation.',
      tags: ['LangGraph', 'Amazon Bedrock', 'FastAPI', 'React', 'TypeScript', 'AWS'],
      repoUrl: '',
      liveUrl: '',
      placeholder: false,
    },
    {
      title: 'AI-Powered Road Safety Assessment Portal',
      blurb:
        'Backend services for an AI-driven road safety platform built for the Young Indians (Yi) organization, working directly with their stakeholders on requirements. Integrated the Google Vision API to extract data from PDF reports and automated real-time certificate generation from dynamic templates.',
      tags: ['Google Vision API', 'Python', 'Automation'],
      repoUrl: '',
      liveUrl: '',
      placeholder: false,
    },
    {
      title: 'Dyslexia Screening Tool',
      blurb:
        'A machine learning model that detects early signs of dyslexia from test responses and reading patterns, wrapped in a simple interface so teachers and parents get instant screening results without technical knowledge.',
      tags: ['Machine Learning', 'Python'],
      repoUrl: '',
      liveUrl: '',
      placeholder: false,
    },
  ],
};

export const contact = {
  heading: 'Contact',
  statement: 'Have a project, a role, or just an idea worth talking through?',
  intro:
    'I’m open to new projects, freelance work, collaborations and full-time opportunities in AI engineering and cloud development. The fastest way to reach me is email — I read everything myself.',
  email: 'ranjithxdev@gmail.com',
  location: 'Chennai, Tamil Nadu, India',
  links: [
    { label: 'Email', href: 'mailto:ranjithxdev@gmail.com', handle: 'ranjithxdev@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/RanjithXDev', handle: '@RanjithXDev' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ranjith-mv-baab48295/', handle: 'Ranjith MV' },
  ],
};

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const footer = {
  text: `© ${new Date().getFullYear()} Ranjith MV`,
  note: 'Built with React and Vite',
};
