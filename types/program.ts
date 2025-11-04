export interface Program {
  id: string
  name: string
  school: string
  city: string
  country: string
  latitude: number
  longitude: number
  website: string
  language: string[]
  duration: string
  ranking?: {
    source: string
    position: number
  }[]
  tuition: {
    amount: number
    currency: string
    period: string
  }
  averageAge?: number
  studentProfile?: string
  admissionRequirements: {
    gmat?: number
    gre?: number
    toefl?: number
    ielts?: number
    workExperience?: string
    other?: string[]
  }
  type: 'Business School' | 'University'
  description?: string
}