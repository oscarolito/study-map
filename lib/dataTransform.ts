import { CombinedProgram } from './googleSheets'
import { SchoolWithPrograms, ProgramInfo } from '../types/sheets'

export function transformToSchoolsWithPrograms(combinedData: CombinedProgram[]): SchoolWithPrograms[] {
  // Group programs by school
  const schoolsMap = new Map<string, SchoolWithPrograms>()

  combinedData.forEach(item => {
    const schoolName = item.school.ecole
    
    if (!schoolsMap.has(schoolName)) {
      // Create new school entry
      schoolsMap.set(schoolName, {
        id: schoolName.toLowerCase().replace(/\s+/g, '-'),
        name: schoolName,
        country: item.school.pays,
        website: item.school.site,
        logo: item.school.logo,
        latitude: item.school.lat,
        longitude: item.school.lgn,
        campus: item.school.campus,
        accreditation: item.school.accreditation,
        year: item.school.annee,
        contact: item.school.contact,
        alumni: item.school.alumni,
        programs: []
      })
    }

    // Add program to school
    const school = schoolsMap.get(schoolName)!
    const program: ProgramInfo = {
      id: item.id,
      name: item.program.masterName,
      category: item.program.category,
      type: item.program.programType,
      masterIn: item.program.masterIn,
      domain: item.program.domainSpeciality,
      language: item.program.language.split(',').map(lang => lang.trim()),
      duration: item.program.duration,
      prerequisites: item.program.prerequisites,
      price: item.program.price,
      description: item.program.description,
      link: item.program.link,
      applicationLink: item.program.lienPostuler,
      director: item.program.director,
      campus: item.program.campus,
      intake: item.program.intake,
      deadline: item.program.dateLimite,
      contact: item.program.contactDuMaster,
      requiredDocuments: item.program.requiredDocuments.split(',').map(doc => doc.trim()).filter(doc => doc)
    }

    school.programs.push(program)
  })

  return Array.from(schoolsMap.values())
}

export function extractFilterOptions(schools: SchoolWithPrograms[]) {
  const countries = new Set<string>()
  const languages = new Set<string>()
  const durations = new Set<string>()
  const programTypes = new Set<string>()
  const domains = new Set<string>()
  const prices: number[] = []

  schools.forEach(school => {
    countries.add(school.country)
    
    school.programs.forEach(program => {
      program.language.forEach(lang => languages.add(lang))
      if (program.duration) durations.add(program.duration)
      if (program.type) programTypes.add(program.type)
      if (program.domain) domains.add(program.domain)
      
      // Extract price number for range calculation
      const priceMatch = program.price.match(/[\d,]+/)
      if (priceMatch) {
        const price = parseInt(priceMatch[0].replace(/,/g, ''))
        if (!isNaN(price)) prices.push(price)
      }
    })
  })

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000

  return {
    countries: Array.from(countries).sort(),
    languages: Array.from(languages).sort(),
    durations: Array.from(durations).sort(),
    programTypes: Array.from(programTypes).sort(),
    domains: Array.from(domains).sort(),
    priceRange: [minPrice, maxPrice] as [number, number]
  }
}