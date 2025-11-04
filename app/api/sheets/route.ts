import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const SHEET_ID = '10v0fu6XycQ0t98olwIDCTlyHjsF2b5mp_0KNq9el3iU'
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

async function getAccessToken() {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Service account credentials not configured')
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Token error: ${data.error_description || data.error}`)
  }
  
  return data.access_token
}

async function fetchSheetData(range: string) {
  const accessToken = await getAccessToken()
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  return data.values || []
}

export async function GET() {
  try {
    // Fetch both sheets
    const [schoolsData, programsData] = await Promise.all([
      fetchSheetData('BASE!A:L'),
      fetchSheetData('BASE V2!A:S')
    ])

    return NextResponse.json({
      schools: schoolsData,
      programs: programsData,
      success: true
    })
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', success: false },
      { status: 500 }
    )
  }
}