import { Program } from '../types/program'

export const programs: Program[] = [
  {
    id: '1',
    name: 'Master in Finance',
    school: 'London Business School',
    city: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    website: 'https://www.london.edu/masters-degrees/masters-in-finance',
    language: ['English'],
    duration: '12 months',
    ranking: [
      { source: 'Financial Times', position: 1 },
      { source: 'QS', position: 2 }
    ],
    tuition: {
      amount: 57500,
      currency: 'GBP',
      period: 'Total'
    },
    averageAge: 24,
    studentProfile: 'Recent graduates with strong quantitative background',
    admissionRequirements: {
      gmat: 700,
      toefl: 100,
      workExperience: '0-2 years preferred',
      other: ['Strong mathematical background', 'Bachelor degree in relevant field']
    },
    type: 'Business School',
    description: 'World-renowned Master in Finance program focusing on quantitative finance and investment management.'
  },
  {
    id: '2',
    name: 'Master of Science in Finance',
    school: 'MIT Sloan School of Management',
    city: 'Cambridge',
    country: 'United States',
    latitude: 42.3601,
    longitude: -71.0589,
    website: 'https://mitsloan.mit.edu/master-of-finance',
    language: ['English'],
    duration: '12 months',
    ranking: [
      { source: 'Financial Times', position: 2 },
      { source: 'QS', position: 1 }
    ],
    tuition: {
      amount: 84500,
      currency: 'USD',
      period: 'Total'
    },
    averageAge: 25,
    studentProfile: 'STEM graduates seeking finance careers',
    admissionRequirements: {
      gmat: 720,
      toefl: 100,
      workExperience: '0-3 years',
      other: ['Strong quantitative background', 'STEM degree preferred']
    },
    type: 'Business School',
    description: 'Intensive program combining finance theory with practical applications in technology and innovation.'
  },
  {
    id: '3',
    name: 'Master in Management & Financial Markets',
    school: 'HEC Paris',
    city: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    website: 'https://www.hec.edu/en/master-programs/specialized-masters/master-management-financial-markets',
    language: ['English', 'French'],
    duration: '15 months',
    ranking: [
      { source: 'Financial Times', position: 5 },
      { source: 'QS', position: 8 }
    ],
    tuition: {
      amount: 39000,
      currency: 'EUR',
      period: 'Total'
    },
    averageAge: 24,
    studentProfile: 'International students with business or economics background',
    admissionRequirements: {
      gmat: 650,
      toefl: 95,
      ielts: 7.0,
      workExperience: '0-2 years',
      other: ['Bachelor in business, economics, or related field']
    },
    type: 'Business School',
    description: 'European perspective on global financial markets with strong industry connections.'
  },
  {
    id: '4',
    name: 'Master of Finance',
    school: 'University of Cambridge - Judge Business School',
    city: 'Cambridge',
    country: 'United Kingdom',
    latitude: 52.2053,
    longitude: 0.1218,
    website: 'https://www.jbs.cam.ac.uk/programmes/master-of-finance/',
    language: ['English'],
    duration: '12 months',
    ranking: [
      { source: 'Financial Times', position: 8 },
      { source: 'QS', position: 6 }
    ],
    tuition: {
      amount: 59000,
      currency: 'GBP',
      period: 'Total'
    },
    averageAge: 25,
    studentProfile: 'High-achieving graduates seeking finance careers',
    admissionRequirements: {
      gmat: 680,
      toefl: 110,
      ielts: 7.5,
      workExperience: '0-3 years',
      other: ['First-class honours degree', 'Strong analytical skills']
    },
    type: 'Business School',
    description: 'Rigorous program combining academic excellence with practical finance applications.'
  },
  {
    id: '5',
    name: 'Master in Finance',
    school: 'ESCP Business School',
    city: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    website: 'https://escp.eu/programmes/specialised-masters/master-in-finance',
    language: ['English', 'French'],
    duration: '15 months',
    ranking: [
      { source: 'Financial Times', position: 12 }
    ],
    tuition: {
      amount: 32000,
      currency: 'EUR',
      period: 'Total'
    },
    averageAge: 23,
    studentProfile: 'Recent graduates with international outlook',
    admissionRequirements: {
      gmat: 600,
      toefl: 90,
      ielts: 6.5,
      workExperience: '0-2 years',
      other: ['Bachelor degree', 'Motivation for finance career']
    },
    type: 'Business School',
    description: 'Multi-campus European program with strong industry partnerships.'
  }
]