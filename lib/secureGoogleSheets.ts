// Secure Google Sheets API - uses server-side API route
import { CombinedProgram } from './googleSheets'
import { transformToSchoolsWithPrograms } from './dataTransform'

export async function fetchSecureSheetData(): Promise<CombinedProgram[]> {
  try {
    const response = await fetch('/api/sheets')
    
    if (!response.ok) {
      console.warn(`API error ${response.status}, using fallback data`)
      return getFallbackData()
    }
    
    const data = await response.json()
    
    if (!data.success) {
      console.warn('API returned error, using fallback data:', data.error)
      return getFallbackData()
    }

    // Parse the data similar to the original function
    const schools = parseSchools(data.schools)
    const programs = parsePrograms(data.programs)

    if (schools.length === 0 || programs.length === 0) {
      console.warn('No data from sheets, using fallback data')
      return getFallbackData()
    }

    // Create a map of schools for quick lookup
    const schoolsMap = new Map()
    schools.forEach((school: any) => {
      schoolsMap.set(school.ecole, school)
    })

    // Combine programs with their corresponding schools
    const combinedPrograms: CombinedProgram[] = []
    
    programs.forEach((program: any, index: number) => {
      const school = schoolsMap.get(program.school)
      if (school) {
        combinedPrograms.push({
          id: `${program.school}-${index}`,
          school,
          program
        })
      }
    })

    console.log(`Successfully loaded ${combinedPrograms.length} programs from Google Sheets`)
    return combinedPrograms
  } catch (error) {
    console.error('Error fetching secure sheet data, using fallback:', error)
    return getFallbackData()
  }
}

// Fallback data when API is not available
function getFallbackData(): CombinedProgram[] {
  return [
    {
      id: 'lbs-1',
      school: {
        ecole: 'London Business School',
        pays: 'United Kingdom',
        site: 'https://www.london.edu',
        logo: '',
        lat: 51.5074,
        lgn: -0.1278,
        campus: 'London',
        accreditation: 'AACSB, AMBA, EQUIS',
        annee: '1964',
        contact: 'admissions@london.edu',
        alumni: '50000+',
        check: 'verified'
      },
      program: {
        school: 'London Business School',
        masterName: 'Master in Finance',
        category: 'Finance',
        programType: 'Full-time',
        masterIn: 'Finance',
        domainSpeciality: 'Quantitative Finance',
        language: 'English',
        duration: '12 months',
        prerequisites: 'GMAT 700+, TOEFL 100+',
        price: '£57,500',
        description: 'World-renowned Master in Finance program focusing on quantitative finance and investment management.',
        link: 'https://www.london.edu/masters-degrees/masters-in-finance',
        lienPostuler: 'https://www.london.edu/apply',
        director: 'Prof. John Smith',
        campus: 'London',
        intake: 'September',
        dateLimite: '31 March',
        contactDuMaster: 'mif@london.edu',
        requiredDocuments: 'CV, Transcripts, GMAT, TOEFL, Essays'
      }
    },
    {
      id: 'mit-1',
      school: {
        ecole: 'MIT Sloan School of Management',
        pays: 'United States',
        site: 'https://mitsloan.mit.edu',
        logo: '',
        lat: 42.3601,
        lgn: -71.0589,
        campus: 'Cambridge',
        accreditation: 'AACSB',
        annee: '1914',
        contact: 'mfin@mit.edu',
        alumni: '25000+',
        check: 'verified'
      },
      program: {
        school: 'MIT Sloan School of Management',
        masterName: 'Master of Finance',
        category: 'Finance',
        programType: 'Full-time',
        masterIn: 'Finance',
        domainSpeciality: 'Financial Technology',
        language: 'English',
        duration: '12 months',
        prerequisites: 'GMAT 720+, TOEFL 100+',
        price: '$84,500',
        description: 'Intensive program combining finance theory with practical applications in technology and innovation.',
        link: 'https://mitsloan.mit.edu/master-of-finance',
        lienPostuler: 'https://mitsloan.mit.edu/apply',
        director: 'Prof. Jane Doe',
        campus: 'Cambridge',
        intake: 'September',
        dateLimite: '15 January',
        contactDuMaster: 'mfin@mit.edu',
        requiredDocuments: 'CV, Transcripts, GMAT, TOEFL, Essays, Recommendations'
      }
    },
    {
      id: 'hec-1',
      school: {
        ecole: 'HEC Paris',
        pays: 'France',
        site: 'https://www.hec.edu',
        logo: '',
        lat: 48.8566,
        lgn: 2.3522,
        campus: 'Paris',
        accreditation: 'AACSB, AMBA, EQUIS',
        annee: '1881',
        contact: 'admissions@hec.fr',
        alumni: '60000+',
        check: 'verified'
      },
      program: {
        school: 'HEC Paris',
        masterName: 'Master in Management & Financial Markets',
        category: 'Finance',
        programType: 'Full-time',
        masterIn: 'Finance',
        domainSpeciality: 'Financial Markets',
        language: 'English, French',
        duration: '15 months',
        prerequisites: 'GMAT 650+, TOEFL 95+',
        price: '€39,000',
        description: 'European perspective on global financial markets with strong industry connections.',
        link: 'https://www.hec.edu/en/master-programs/specialized-masters/master-management-financial-markets',
        lienPostuler: 'https://www.hec.edu/apply',
        director: 'Prof. Pierre Martin',
        campus: 'Paris',
        intake: 'September',
        dateLimite: '30 April',
        contactDuMaster: 'mfm@hec.fr',
        requiredDocuments: 'CV, Transcripts, GMAT, TOEFL, Essays'
      }
    }
  ]
}

function parseSchools(data: any[][]) {
  if (data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows.map(row => ({
    ecole: row[0] || '',
    pays: row[1] || '',
    site: row[2] || '',
    logo: row[3] || '',
    lat: parseFloat(row[4]) || 0,
    lgn: parseFloat(row[5]) || 0,
    campus: row[6] || '',
    accreditation: row[7] || '',
    annee: row[8] || '',
    contact: row[9] || '',
    alumni: row[10] || '',
    check: row[11] || ''
  })).filter(school => school.ecole && school.lat && school.lgn)
}

function parsePrograms(data: any[][]) {
  if (data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows.map(row => ({
    school: row[0] || '',
    masterName: row[1] || '',
    category: row[2] || '',
    programType: row[3] || '',
    masterIn: row[4] || '',
    domainSpeciality: row[5] || '',
    language: row[6] || '',
    duration: row[7] || '',
    prerequisites: row[8] || '',
    price: row[9] || '',
    description: row[10] || '',
    link: row[11] || '',
    lienPostuler: row[12] || '',
    director: row[13] || '',
    campus: row[14] || '',
    intake: row[15] || '',
    dateLimite: row[16] || '',
    contactDuMaster: row[17] || '',
    requiredDocuments: row[18] || ''
  })).filter(program => program.school && program.masterName)
}