// Google Sheets API integration
const SHEET_ID = '10v0fu6XycQ0t98olwIDCTlyHjsF2b5mp_0KNq9el3iU'
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || ''

// Sheet ranges
const SCHOOLS_RANGE = 'BASE!A:L' // Écoles
const PROGRAMS_RANGE = 'BASE V2!A:S' // Programmes

export interface School {
  ecole: string
  pays: string
  site: string
  logo: string
  lat: number
  lgn: number
  campus: string
  accreditation: string
  annee: string
  contact: string
  alumni: string
  check: string
}

export interface ProgramData {
  school: string
  masterName: string
  category: string
  programType: string
  masterIn: string
  domainSpeciality: string
  language: string
  duration: string
  prerequisites: string
  price: string
  description: string
  link: string
  lienPostuler: string
  director: string
  campus: string
  intake: string
  dateLimite: string
  contactDuMaster: string
  requiredDocuments: string
}

export interface CombinedProgram {
  id: string
  // School info
  school: School
  // Program info
  program: ProgramData
}

async function fetchSheetData(range: string): Promise<any[][]> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    return []
  }
}

function parseSchools(data: any[][]): School[] {
  if (data.length < 2) return []
  
  const headers = data[0]
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

function parsePrograms(data: any[][]): ProgramData[] {
  if (data.length < 2) return []
  
  const headers = data[0]
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

export async function fetchAllData(): Promise<CombinedProgram[]> {
  try {
    // Fetch both sheets in parallel
    const [schoolsData, programsData] = await Promise.all([
      fetchSheetData(SCHOOLS_RANGE),
      fetchSheetData(PROGRAMS_RANGE)
    ])

    const schools = parseSchools(schoolsData)
    const programs = parsePrograms(programsData)

    // Create a map of schools for quick lookup
    const schoolsMap = new Map<string, School>()
    schools.forEach(school => {
      schoolsMap.set(school.ecole, school)
    })

    // Combine programs with their corresponding schools
    const combinedPrograms: CombinedProgram[] = []
    
    programs.forEach((program, index) => {
      const school = schoolsMap.get(program.school)
      if (school) {
        combinedPrograms.push({
          id: `${program.school}-${index}`,
          school,
          program
        })
      }
    })

    return combinedPrograms
  } catch (error) {
    console.error('Error fetching all data:', error)
    return []
  }
}

// Fallback data when API is not available
export async function fetchDataWithFallback(): Promise<CombinedProgram[]> {
  if (!API_KEY) {
    console.warn('Google Sheets API key not found, using fallback data')
    return getFallbackData()
  }

  try {
    const data = await fetchAllData()
    if (data.length === 0) {
      console.warn('No data from Google Sheets, using fallback')
      return getFallbackData()
    }
    return data
  } catch (error) {
    console.error('Error fetching from Google Sheets, using fallback:', error)
    return getFallbackData()
  }
}

function getFallbackData(): CombinedProgram[] {
  // Fallback data based on the original programs
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
    }
  ]
}