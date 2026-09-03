// In-memory data store fallback for 100% demo uptime when MongoDB service is not running
const bcrypt = require('bcryptjs');

class LocalStore {
  constructor() {
    this.skills = [];
    this.jobRoleProfiles = [];
    this.courses = [];
    this.officials = [];
    this.quizzes = [];
    this.quizAttempts = [];
    this.isInitialized = false;
  }

  async initDefaultData() {
    if (this.isInitialized) return;

    this.skills = [
      { name: 'Survey Design', category: 'Statistical', description: 'Questionnaires, sampling frames, field survey protocols.' },
      { name: 'Sampling Methods', category: 'Statistical', description: 'Probability sampling, stratified cluster sampling, sample size estimation.' },
      { name: 'National Accounts', category: 'Statistical', description: 'Compilation of GDP, GVA, Gross Fixed Capital Formation (GFCF) under SNA 2008.' },
      { name: 'Price Statistics', category: 'Statistical', description: 'Consumer Price Index (CPI), Wholesale Price Index (WPI), Laspeyres formula.' },
      { name: 'SDG Indicators', category: 'Statistical', description: 'Monitoring and benchmarking UN Sustainable Development Goal indicators.' },
      { name: 'Data Quality Frameworks', category: 'Statistical', description: 'Auditing administrative data, validation rules, outlier detection.' },
      { name: 'Python', category: 'Technical', description: 'Pandas, NumPy, automated data processing scripts for statistical datasets.' },
      { name: 'SQL', category: 'Technical', description: 'Relational database queries, joins, aggregation functions.' },
      { name: 'R', category: 'Technical', description: 'Statistical modeling, time-series forecasting, survey data analysis.' },
      { name: 'GIS', category: 'Technical', description: 'Geographic Information Systems, spatial data analysis, thematic mapping.' },
      { name: 'Data Visualization', category: 'Technical', description: 'Designing intuitive dashboards using PowerBI, Tableau, and Recharts.' },
      { name: 'AI/ML Basics', category: 'Technical', description: 'Supervised machine learning, text classification, and LLM prompt engineering.' },
      { name: 'Cybersecurity Awareness', category: 'DigitalGovernance', description: 'Safeguarding government network infrastructure and credential hygiene.' },
      { name: 'Data Privacy', category: 'DigitalGovernance', description: 'Compliance with India DPDP Act, statistical anonymization, confidentiality.' },
      { name: 'Digital Signatures', category: 'DigitalGovernance', description: 'Implementation of eSign, e-Office document encryption.' },
      { name: 'Leadership', category: 'Behavioural', description: 'Motivating field survey teams, managing cross-divisional projects.' },
      { name: 'Communication', category: 'Behavioural', description: 'Drafting policy briefs, presenting press releases on national statistical estimates.' }
    ];

    this.jobRoleProfiles = [
      {
        roleName: 'Statistical Officer',
        description: 'Responsible for survey data processing, statistical validation, and GDP indicator aggregation.',
        requiredSkills: [
          { skill: 'Survey Design', category: 'Statistical', minLevel: 80 },
          { skill: 'Sampling Methods', category: 'Statistical', minLevel: 75 },
          { skill: 'National Accounts', category: 'Statistical', minLevel: 70 },
          { skill: 'Price Statistics', category: 'Statistical', minLevel: 65 },
          { skill: 'Python', category: 'Technical', minLevel: 65 },
          { skill: 'SQL', category: 'Technical', minLevel: 70 },
          { skill: 'Data Visualization', category: 'Technical', minLevel: 60 },
          { skill: 'Data Privacy', category: 'DigitalGovernance', minLevel: 75 },
          { skill: 'Cybersecurity Awareness', category: 'DigitalGovernance', minLevel: 70 },
          { skill: 'Communication', category: 'Behavioural', minLevel: 80 },
          { skill: 'Leadership', category: 'Behavioural', minLevel: 65 }
        ]
      },
      {
        roleName: 'Data Analyst',
        description: 'Specializes in analytical modeling, Python scripts, database queries, and visualization dashboards.',
        requiredSkills: [
          { skill: 'Python', category: 'Technical', minLevel: 85 },
          { skill: 'SQL', category: 'Technical', minLevel: 85 },
          { skill: 'Data Visualization', category: 'Technical', minLevel: 80 },
          { skill: 'AI/ML Basics', category: 'Technical', minLevel: 70 },
          { skill: 'R', category: 'Technical', minLevel: 65 },
          { skill: 'Data Quality Frameworks', category: 'Statistical', minLevel: 75 },
          { skill: 'Data Privacy', category: 'DigitalGovernance', minLevel: 75 }
        ]
      },
      {
        roleName: 'Survey Officer',
        description: 'Manages field operations, sampling verification, field enumerator training, and respondent relations.',
        requiredSkills: [
          { skill: 'Survey Design', category: 'Statistical', minLevel: 90 },
          { skill: 'Sampling Methods', category: 'Statistical', minLevel: 85 },
          { skill: 'GIS', category: 'Technical', minLevel: 70 },
          { skill: 'Leadership', category: 'Behavioural', minLevel: 80 },
          { skill: 'Communication', category: 'Behavioural', minLevel: 85 }
        ]
      }
    ];

    this.courses = [
      { title: 'Advanced Survey Sampling & Estimation Techniques', provider: 'NSSTA-TPAC', skillsCovered: ['Survey Design', 'Sampling Methods'], durationHours: 15, level: 'Advanced', description: 'Comprehensive NSSTA training on multi-stage cluster sampling, PPS sampling, and variance estimation.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'National Accounts Compilation (SNA 2008 Framework)', provider: 'NSSTA-TPAC', skillsCovered: ['National Accounts'], durationHours: 25, level: 'Intermediate', description: 'Practical guidelines on compiling gross value added (GVA) by economic activity and estimating gross domestic product (GDP).', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'Consumer & Wholesale Price Index Methodology', provider: 'iGOT', skillsCovered: ['Price Statistics'], durationHours: 12, level: 'Intermediate', description: 'Understanding Laspeyres price indices, basket revision protocols, and price collection data verification.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'SDG National Indicator Framework & Data Benchmarking', provider: 'iGOT', skillsCovered: ['SDG Indicators'], durationHours: 10, level: 'Beginner', description: 'Overview of NITI Aayog and MoSPI SDG indicator guidelines, baseline mapping, and disaggregated reporting.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'Python for Statistical Officers & Data Analysts', provider: 'iGOT', skillsCovered: ['Python', 'Data Visualization'], durationHours: 20, level: 'Beginner', description: 'Hands-on Python training using Pandas and Seaborn to aggregate large official survey datasets.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'Advanced SQL Querying for Large Microdata Tables', provider: 'iGOT', skillsCovered: ['SQL'], durationHours: 16, level: 'Intermediate', description: 'Optimizing complex SQL queries, window functions, and indexing strategies on government relational databases.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'R Programming for Time-Series & Economic Forecasting', provider: 'NSSTA-TPAC', skillsCovered: ['R', 'National Accounts'], durationHours: 22, level: 'Advanced', description: 'Statistical modeling in R for seasonal adjustment of economic indicators and ARIMA forecasting.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'Digital Personal Data Protection (DPDP) Act Compliance', provider: 'iGOT', skillsCovered: ['Data Privacy'], durationHours: 10, level: 'Intermediate', description: 'Understanding statutory requirements for statistical data anonymization, respondent consent, and microdata security.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'Cybersecurity Hygiene for Government Officials', provider: 'iGOT', skillsCovered: ['Cybersecurity Awareness'], durationHours: 6, level: 'Beginner', description: 'CERT-In guidelines on password security, multi-factor authentication, and secure portal access.', externalLink: 'https://igotkarmayogi.gov.in' },
      { title: 'Effective Communication of National Statistical Findings', provider: 'NSSTA-TPAC', skillsCovered: ['Communication'], durationHours: 10, level: 'Intermediate', description: 'Drafting press notes, communicating statistical error margins to news media, and executive summary writing.', externalLink: 'https://igotkarmayogi.gov.in' }
    ];

    const defaultPasswordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    this.officials = [
      {
        _id: 'official_id_101',
        name: 'Rajesh Kumar Verma',
        email: 'official@mospi.gov.in',
        passwordHash: defaultPasswordHash,
        role: 'official',
        designation: 'Statistical Officer',
        department: 'National Accounts Division (NAD)',
        jobRole: 'Statistical Officer',
        qualifications: ['M.Sc. Statistics'],
        workExperienceYears: 5,
        pastTrainings: [
          { title: 'Consumer & Wholesale Price Index Methodology', completedOn: new Date('2026-01-20'), provider: 'iGOT' }
        ],
        competencyScores: [
          { skill: 'Survey Design', category: 'Statistical', level: 65 },
          { skill: 'Sampling Methods', category: 'Statistical', level: 70 },
          { skill: 'National Accounts', category: 'Statistical', level: 50 },
          { skill: 'Price Statistics', category: 'Statistical', level: 60 },
          { skill: 'Python', category: 'Technical', level: 40 },
          { skill: 'SQL', category: 'Technical', level: 65 },
          { skill: 'Data Visualization', category: 'Technical', level: 55 },
          { skill: 'Cybersecurity Awareness', category: 'DigitalGovernance', level: 60 },
          { skill: 'Data Privacy', category: 'DigitalGovernance', level: 55 },
          { skill: 'Communication', category: 'Behavioural', level: 75 },
          { skill: 'Leadership', category: 'Behavioural', level: 60 }
        ]
      },
      {
        _id: 'official_id_102',
        name: 'Sunita Sharma',
        email: 'survey.officer@mospi.gov.in',
        passwordHash: defaultPasswordHash,
        role: 'official',
        designation: 'Survey Officer',
        department: 'Field Operations Division (FOD)',
        jobRole: 'Survey Officer',
        qualifications: ['B.Sc. Mathematics & Statistics'],
        workExperienceYears: 4,
        pastTrainings: [],
        competencyScores: [
          { skill: 'Survey Design', category: 'Statistical', level: 85 },
          { skill: 'Sampling Methods', category: 'Statistical', level: 80 },
          { skill: 'Communication', category: 'Behavioural', level: 80 }
        ]
      },
      {
        _id: 'admin_id_999',
        name: 'Dr. Amitabha Sengupta',
        email: 'admin@mospi.gov.in',
        passwordHash: adminPasswordHash,
        role: 'admin',
        designation: 'Director General (Statistics)',
        department: 'MoSPI Central Command & NSSTA Director',
        jobRole: 'Statistical Officer',
        qualifications: ['Ph.D. Econometrics'],
        workExperienceYears: 18,
        pastTrainings: [],
        competencyScores: [
          { skill: 'Data Privacy', category: 'DigitalGovernance', level: 95 },
          { skill: 'Leadership', category: 'Behavioural', level: 95 }
        ]
      }
    ];

    this.isInitialized = true;
    console.log('In-memory database store initialized successfully with default MoSPI dataset.');
  }
}

const localStore = new LocalStore();
localStore.initDefaultData();

module.exports = localStore;
