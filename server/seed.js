const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Skill = require('./models/Skill');
const JobRoleProfile = require('./models/JobRoleProfile');
const Course = require('./models/Course');
const Official = require('./models/Official');
const Quiz = require('./models/Quiz');
const QuizAttempt = require('./models/QuizAttempt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mospi_skill_intelligence';

const skillsSeed = [
  // Statistical (6)
  { name: 'Survey Design', category: 'Statistical', description: 'Formulating questionnaires, sampling frames, non-response mitigation, and field survey protocols.' },
  { name: 'Sampling Methods', category: 'Statistical', description: 'Probability sampling, stratified cluster sampling, sample size estimation, and design effects.' },
  { name: 'National Accounts', category: 'Statistical', description: 'Compilation of GDP, GVA, Gross Fixed Capital Formation (GFCF), and Input-Output tables according to SNA 2008.' },
  { name: 'Price Statistics', category: 'Statistical', description: 'Consumer Price Index (CPI), Wholesale Price Index (WPI), Laspeyres/Paasche index formulas, and hedonic pricing.' },
  { name: 'SDG Indicators', category: 'Statistical', description: 'Monitoring and benchmarking UN Sustainable Development Goal indicators for Indian national frameworks.' },
  { name: 'Data Quality Frameworks', category: 'Statistical', description: 'Auditing administrative data, statistical data verification, outlier detection, and imputation techniques.' },

  // Technical (7)
  { name: 'Python', category: 'Technical', description: 'Pandas, NumPy, automated data processing scripts, and ETL pipelines for statistical datasets.' },
  { name: 'SQL', category: 'Technical', description: 'Relational database queries, multi-table joins, aggregation functions, and database schema optimization.' },
  { name: 'R', category: 'Technical', description: 'Statistical modeling, time-series forecasting, survey data analysis (survey package), and plotting.' },
  { name: 'GIS', category: 'Technical', description: 'Geographic Information Systems, spatial data analysis, village/district thematic mapping, and QGIS.' },
  { name: 'Data Visualization', category: 'Technical', description: 'Designing intuitive dashboards using PowerBI, Tableau, and Recharts for executive statistical summaries.' },
  { name: 'AI/ML Basics', category: 'Technical', description: 'Supervised/unsupervised machine learning, natural language processing for administrative classification, and LLM prompting.' },
  { name: 'Cloud Computing', category: 'Technical', description: 'Managing scalable statistical data processing workloads on MeghRaj NIC Govt Cloud.' },

  // Digital Governance (4)
  { name: 'Cybersecurity Awareness', category: 'DigitalGovernance', description: 'Safeguarding government network infrastructure, credential hygiene, and identifying phishing attacks.' },
  { name: 'Data Privacy', category: 'DigitalGovernance', description: 'Compliance with India Personal Data Protection (DPDP) Act, statistical anonymization, and confidentiality.' },
  { name: 'Digital Signatures', category: 'DigitalGovernance', description: 'Implementation of eSign, e-Office document encryption, and PKI security protocols.' },
  { name: 'Govt Cloud Usage', category: 'DigitalGovernance', description: 'Deploying secure microservices and storing official microdata on NIC MeghRaj cloud infrastructure.' },

  // Behavioural (5)
  { name: 'Leadership', category: 'Behavioural', description: 'Motivating field survey teams, managing cross-divisional projects, and public administration ethics.' },
  { name: 'Communication', category: 'Behavioural', description: 'Drafting policy briefs, presenting press releases on national statistical estimates, and inter-ministry liaison.' },
  { name: 'Project Management', category: 'Behavioural', description: 'Agile project delivery, milestone tracking, resource allocation, and risk management in government schemes.' },
  { name: 'Change Management', category: 'Behavioural', description: 'Transitioning manual paper statistical workflows into digital-first survey frameworks.' },
  { name: 'Ethics', category: 'Behavioural', description: 'Objectivity, impartiality, confidentiality, and integrity in public data collection and reporting.' }
];

const jobRoleProfilesSeed = [
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
      { skill: 'Communication', category: 'Behavioural', minLevel: 85 },
      { skill: 'Project Management', category: 'Behavioural', minLevel: 75 }
    ]
  },
  {
    roleName: 'Senior Statistical Officer',
    description: 'Leads statistical methodology teams, oversees GDP national compilation, and reports to ministry leadership.',
    requiredSkills: [
      { skill: 'National Accounts', category: 'Statistical', minLevel: 90 },
      { skill: 'Price Statistics', category: 'Statistical', minLevel: 85 },
      { skill: 'SDG Indicators', category: 'Statistical', minLevel: 80 },
      { skill: 'Data Quality Frameworks', category: 'Statistical', minLevel: 85 },
      { skill: 'Leadership', category: 'Behavioural', minLevel: 90 },
      { skill: 'Communication', category: 'Behavioural', minLevel: 90 }
    ]
  },
  {
    roleName: 'Director Data Governance',
    description: 'Oversees digital transformation, security protocols, cloud architecture, and privacy compliance across MoSPI.',
    requiredSkills: [
      { skill: 'Data Privacy', category: 'DigitalGovernance', minLevel: 95 },
      { skill: 'Cybersecurity Awareness', category: 'DigitalGovernance', minLevel: 90 },
      { skill: 'Govt Cloud Usage', category: 'DigitalGovernance', minLevel: 85 },
      { skill: 'Digital Signatures', category: 'DigitalGovernance', minLevel: 80 },
      { skill: 'Leadership', category: 'Behavioural', minLevel: 90 }
    ]
  }
];

const coursesSeed = [
  // Statistical Courses
  { title: 'Advanced Survey Sampling & Estimation Techniques', provider: 'NSSTA-TPAC', skillsCovered: ['Survey Design', 'Sampling Methods'], durationHours: 15, level: 'Advanced', description: 'Comprehensive NSSTA training on multi-stage cluster sampling, probability proportional to size (PPS), and variance estimation.' },
  { title: 'National Accounts Compilation (SNA 2008 Framework)', provider: 'NSSTA-TPAC', skillsCovered: ['National Accounts'], durationHours: 25, level: 'Intermediate', description: 'Practical guidelines on compiling gross value added (GVA) by economic activity and estimating gross domestic product (GDP).' },
  { title: 'Consumer & Wholesale Price Index Methodology', provider: 'iGOT', skillsCovered: ['Price Statistics'], durationHours: 12, level: 'Intermediate', description: 'Understanding Laspeyres price indices, basket revision protocols, and price collection data verification.' },
  { title: 'SDG National Indicator Framework & Data Benchmarking', provider: 'iGOT', skillsCovered: ['SDG Indicators'], durationHours: 10, level: 'Beginner', description: 'Overview of NITI Aayog and MoSPI SDG indicator guidelines, baseline mapping, and disaggregated reporting.' },
  { title: 'Statistical Data Audit & Outlier Detection Protocols', provider: 'NSSTA-TPAC', skillsCovered: ['Data Quality Frameworks', 'Survey Design'], durationHours: 18, level: 'Advanced', description: 'Techniques for automated validation rules, imputation of missing survey responses, and outlier management.' },
  { title: 'Introduction to Sample Survey Questionnaire Design', provider: 'iGOT', skillsCovered: ['Survey Design'], durationHours: 8, level: 'Beginner', description: 'Best practices for field enumerator forms, cognitive testing of questions, and digital CAPI survey layouts.' },

  // Technical Courses
  { title: 'Python for Statistical Officers & Data Analysts', provider: 'iGOT', skillsCovered: ['Python', 'Data Visualization'], durationHours: 20, level: 'Beginner', description: 'Hands-on Python training using Pandas and Seaborn to aggregate large official survey datasets.' },
  { title: 'Advanced SQL Querying for Large Microdata Tables', provider: 'iGOT', skillsCovered: ['SQL'], durationHours: 16, level: 'Intermediate', description: 'Optimizing complex SQL queries, window functions, and indexing strategies on government relational databases.' },
  { title: 'R Programming for Time-Series & Economic Forecasting', provider: 'NSSTA-TPAC', skillsCovered: ['R', 'National Accounts'], durationHours: 22, level: 'Advanced', description: 'Statistical modeling in R for seasonal adjustment of economic indicators and ARIMA forecasting.' },
  { title: 'GIS Mapping & Spatial Statistics for District Officers', provider: 'NSSTA-TPAC', skillsCovered: ['GIS'], durationHours: 14, level: 'Intermediate', description: 'Using QGIS to map survey block boundaries, district demographic clusters, and spatial heatmaps.' },
  { title: 'Interactive Dashboard Design with Recharts & PowerBI', provider: 'iGOT', skillsCovered: ['Data Visualization'], durationHours: 12, level: 'Intermediate', description: 'Building executive dashboards, data storytelling techniques, and real-time statistical KPI visuals.' },
  { title: 'Generative AI & LLM Applications in Public Administration', provider: 'iGOT', skillsCovered: ['AI/ML Basics'], durationHours: 10, level: 'Beginner', description: 'Leveraging AI prompt engineering for automatic survey summary generation and text classification.' },
  { title: 'MeghRaj NIC Govt Cloud Infrastructure Management', provider: 'iGOT', skillsCovered: ['Cloud Computing', 'Govt Cloud Usage'], durationHours: 18, level: 'Advanced', description: 'Deploying secure microservices, containerization, and microdata storage on National Informatics Centre Cloud.' },

  // Digital Governance Courses
  { title: 'Digital Personal Data Protection (DPDP) Act Compliance', provider: 'iGOT', skillsCovered: ['Data Privacy'], durationHours: 10, level: 'Intermediate', description: 'Understanding statutory requirements for statistical data anonymization, respondent consent, and microdata security.' },
  { title: 'Cybersecurity Hygiene for Government Officials', provider: 'iGOT', skillsCovered: ['Cybersecurity Awareness'], durationHours: 6, level: 'Beginner', description: 'CERT-In guidelines on password security, multi-factor authentication, phishing defense, and secure portal access.' },
  { title: 'Implementation of Digital Signatures & e-Office Workflows', provider: 'iGOT', skillsCovered: ['Digital Signatures'], durationHours: 5, level: 'Beginner', description: 'Step-by-step workflow for signing official statistical gazette releases and internal ministry approvals.' },

  // Behavioural Courses
  { title: 'Transformational Leadership in Public Administration', provider: 'iGOT', skillsCovered: ['Leadership', 'Change Management'], durationHours: 14, level: 'Intermediate', description: 'Fostering innovation, leading field survey teams, and managing organizational change in government offices.' },
  { title: 'Effective Communication of National Statistical Findings', provider: 'NSSTA-TPAC', skillsCovered: ['Communication'], durationHours: 10, level: 'Intermediate', description: 'Drafting press notes, communicating statistical error margins to news media, and executive summary writing.' },
  { title: 'Agile Project Management for Government Statistical Projects', provider: 'iGOT', skillsCovered: ['Project Management'], durationHours: 16, level: 'Intermediate', description: 'Applying Gantt charts, sprint planning, and risk mitigation strategies to large-scale national censuses.' },
  { title: 'Public Service Ethics & Statistical Integrity', provider: 'iGOT', skillsCovered: ['Ethics'], durationHours: 8, level: 'Beginner', description: 'Core principles of impartiality, scientific independence, and public trust in official statistics.' }
];

async function seedDatabase() {
  try {
    let connected = false;
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
      connected = true;
      console.log('Connected to MongoDB at:', MONGODB_URI);
    } catch (dbErr) {
      console.log('MongoDB server connection timeout. Using MongoDB Memory Server fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Connected to In-Memory MongoDB at:', uri);
      connected = true;
    }

    // Clear existing collections
    await Skill.deleteMany({});
    await JobRoleProfile.deleteMany({});
    await Course.deleteMany({});
    await Official.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});

    console.log('Cleared existing data.');

    // Seed Skills
    await Skill.insertMany(skillsSeed);
    console.log(`Seeded ${skillsSeed.length} skills.`);

    // Seed Job Role Profiles
    await JobRoleProfile.insertMany(jobRoleProfilesSeed);
    console.log(`Seeded ${jobRoleProfilesSeed.length} job role profiles.`);

    // Seed Courses
    await Course.insertMany(coursesSeed);
    console.log(`Seeded ${coursesSeed.length} iGOT & NSSTA courses.`);

    // Seed Officials & Admin
    const defaultPasswordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const official1 = new Official({
      name: 'Rajesh Kumar Verma',
      email: 'official@mospi.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'official',
      designation: 'Statistical Officer',
      department: 'National Accounts Division (NAD)',
      jobRole: 'Statistical Officer',
      qualifications: ['M.Sc. Statistics', 'NSSTA Advanced Diploma'],
      workExperienceYears: 5,
      pastTrainings: [
        { title: 'Introduction to Sample Survey Questionnaire Design', completedOn: new Date('2025-11-15'), provider: 'iGOT' },
        { title: 'Consumer & Wholesale Price Index Methodology', completedOn: new Date('2026-01-20'), provider: 'iGOT' },
        { title: 'Cybersecurity Hygiene for Government Officials', completedOn: new Date('2026-03-10'), provider: 'iGOT' }
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
    });

    const official2 = new Official({
      name: 'Sunita Sharma',
      email: 'survey.officer@mospi.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'official',
      designation: 'Survey Officer',
      department: 'Field Operations Division (FOD)',
      jobRole: 'Survey Officer',
      qualifications: ['B.Sc. Mathematics & Statistics'],
      workExperienceYears: 4,
      pastTrainings: [
        { title: 'GIS Mapping & Spatial Statistics for District Officers', completedOn: new Date('2026-02-12'), provider: 'NSSTA-TPAC' }
      ],
      competencyScores: [
        { skill: 'Survey Design', category: 'Statistical', level: 85 },
        { skill: 'Sampling Methods', category: 'Statistical', level: 80 },
        { skill: 'GIS', category: 'Technical', level: 65 },
        { skill: 'Leadership', category: 'Behavioural', level: 75 },
        { skill: 'Communication', category: 'Behavioural', level: 80 }
      ]
    });

    const adminUser = new Official({
      name: 'Dr. Amitabha Sengupta',
      email: 'admin@mospi.gov.in',
      passwordHash: adminPasswordHash,
      role: 'admin',
      designation: 'Director General (Statistics)',
      department: 'MoSPI Central Command & NSSTA Director',
      jobRole: 'Director Data Governance',
      qualifications: ['Ph.D. Econometrics', 'IAS / ISS Senior Officer'],
      workExperienceYears: 18,
      pastTrainings: [],
      competencyScores: [
        { skill: 'Data Privacy', category: 'DigitalGovernance', level: 95 },
        { skill: 'Cybersecurity Awareness', category: 'DigitalGovernance', level: 90 },
        { skill: 'Govt Cloud Usage', category: 'DigitalGovernance', level: 90 },
        { skill: 'Leadership', category: 'Behavioural', level: 95 }
      ]
    });

    await official1.save();
    await official2.save();
    await adminUser.save();
    console.log('Seeded Official & Admin accounts:');
    console.log('- Official 1: official@mospi.gov.in / password123');
    console.log('- Official 2: survey.officer@mospi.gov.in / password123');
    console.log('- Admin: admin@mospi.gov.in / admin123');

    // Seed Sample Quiz & Attempt
    const sampleQuiz = new Quiz({
      sourceTitle: 'MoSPI National Accounts Methodology Manual 2026',
      skillTag: 'National Accounts',
      category: 'Statistical',
      createdBy: official1._id,
      questions: [
        {
          question: 'What is the standard valuation base for Gross Value Added (GVA) under the System of National Accounts (SNA 2008)?',
          options: [
            'GVA at Basic Prices',
            'GVA at Market Prices including all retail taxes',
            'GVA at Factor Cost exclusive of subsidies',
            'GVA at Constant 1999 Base Year Prices'
          ],
          correctIndex: 0,
          explanation: 'Under SNA 2008 guidelines adopted by MoSPI, GVA is estimated at basic prices, which includes product subsidies minus product taxes.'
        },
        {
          question: 'Which MoSPI division is primarily responsible for compiling annual and quarterly Gross Domestic Product (GDP) estimates?',
          options: [
            'Survey Design and Research Division (SDRD)',
            'National Accounts Division (NAD)',
            'Field Operations Division (FOD)',
            'Price Statistics Division (PSD)'
          ],
          correctIndex: 1,
          explanation: 'The National Accounts Division (NAD) under the Central Statistics Office compiles national accounts aggregates including GDP.'
        },
        {
          question: 'In statistical estimation, what does the term "Imputed Rent" signify in National Accounts calculation?',
          options: [
            'Rent collected directly by local municipal bodies.',
            'Estimated rental value of owner-occupied housing included in GDP GDP calculation.',
            'Tax deductions granted to commercial building owners.',
            'Depreciation cost of administrative government buildings.'
          ],
          correctIndex: 1,
          explanation: 'Imputed rent estimates the economic value provided by owner-occupied dwellings to match standard SNA output accounting.'
        }
      ]
    });
    await sampleQuiz.save();

    const sampleAttempt = new QuizAttempt({
      quizId: sampleQuiz._id,
      officialId: official1._id,
      answers: [0, 1, 1],
      score: 3,
      totalQuestions: 3,
      percentage: 100,
      takenAt: new Date()
    });
    await sampleAttempt.save();

    console.log('Seeded sample quiz and quiz attempt history.');
    console.log('Database seeding completed successfully!');
    if (connected && mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
