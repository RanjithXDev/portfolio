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
      title: 'Junior Software Engineer Intern',
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
      items: ['AWS Bedrock', 'AgentCore Runtime', 'Strands Agents', 'MCP Tools', 'Machine Learning'],
    },
    {
      name: 'Automation & Workflow',
      items: ['Flowise', 'Activepieces', 'REST APIs', 'Knowledge Bases'],
    },
    {
      name: 'Full Stack',
      items: ['MERN Stack', 'Python', 'JavaScript', 'Node.js', 'React', 'SQL'],
    },
    {
      name: 'Cloud & Infra',
      items: ['EC2', 'IAM', 'S3', 'Lambda', 'EBS', 'Auto Scaling', 'Elastic Load Balancing'],
    },
    {
      name: 'Web',
      items: ['WordPress', 'PHP', 'BuddyBoss', 'HTML/CSS'],
    },
  ],
};

/**
 * PLACEHOLDER PROJECTS — replace these with real work.
 *
 * Add a project by appending an object to this array:
 *   {
 *     title:       'Project name',
 *     blurb:       'One or two sentences on what it does and why it matters.',
 *     tags:        ['Python', 'Bedrock'],
 *     repoUrl:     'https://github.com/...',   // omit or leave '' to hide the link
 *     liveUrl:     '',                          // omit or leave '' to hide the link
 *     placeholder: false,                       // set false once it is real
 *   }
 *
 * Cards with `placeholder: true` render in a visibly-unfinished style so you
 * never ship a fake project by accident.
 */
export const projects = {
  heading: 'Projects',
  note: 'Placeholder cards — real projects coming soon.',
  items: [
    {
      title: 'Project Slot 01',
      blurb:
        'Reserved for an agent-based project — e.g. the healthcare discharge-coordination workflow built on Bedrock AgentCore.',
      tags: ['AWS Bedrock', 'AgentCore', 'Python'],
      repoUrl: '',
      liveUrl: '',
      placeholder: true,
    },
    {
      title: 'Project Slot 02',
      blurb:
        'Reserved for a full-stack build — e.g. a MERN application with REST API and AI capabilities integrated.',
      tags: ['React', 'Node.js', 'SQL'],
      repoUrl: '',
      liveUrl: '',
      placeholder: true,
    },
    {
      title: 'Project Slot 03',
      blurb:
        'Reserved for an automation project — e.g. a Flowise or Activepieces workflow handling SLA monitoring and escalation.',
      tags: ['Flowise', 'Activepieces', 'REST APIs'],
      repoUrl: '',
      liveUrl: '',
      placeholder: true,
    },
  ],
};

export const contact = {
  heading: 'Contact',
  intro: 'Open to opportunities in AI engineering and cloud development. The fastest way to reach me is email.',
  email: 'ranjithxdev@gmail.com',
  location: 'Chennai, Tamil Nadu, India',
  links: [
    { label: 'Email', href: 'mailto:ranjithxdev@gmail.com', handle: 'ranjithxdev@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/RanjithXDev', handle: '@RanjithXDev' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ranjith-mv-baab48295/', handle: 'Ranjith MV' },
  ],
};

/**
 * Terminal status lines. The Console types these out as each section
 * scrolls into view — keyed by section id.
 */
export const statusLines = {
  hero: 'agent.init() — session ready',
  about: 'loading profile.json — 3 records',
  experience: 'querying work_history — 1 role active',
  skills: 'indexing capabilities — 5 categories',
  projects: 'scanning repositories — 3 slots reserved',
  contact: 'opening channel — awaiting input',
};

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const footer = {
  text: `© ${new Date().getFullYear()} Ranjith MV`,
  note: 'Built with React, Vite and Three.js',
};
