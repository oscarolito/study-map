export interface SheetFilters {
  countries: string[]
  languages: string[]
  durations: string[]
  programTypes: string[]
  domains: string[]
  priceRange: [number, number]
  searchQuery: string
}

export interface SchoolWithPrograms {
  id: string
  name: string
  country: string
  website: string
  logo: string
  latitude: number
  longitude: number
  campus: string
  accreditation: string
  year: string
  contact: string
  alumni: string
  programs: ProgramInfo[]
}

export interface ProgramInfo {
  id: string
  name: string
  category: string
  type: string
  masterIn: string
  domain: string
  language: string[]
  duration: string
  prerequisites: string
  price: string
  description: string
  link: string
  applicationLink: string
  director: string
  campus: string
  intake: string
  deadline: string
  contact: string
  requiredDocuments: string[]
}