// Google Sheets with Service Account (more secure)
const SHEET_ID = '10v0fu6XycQ0t98olwIDCTlyHjsF2b5mp_0KNq9el3iU'

// Service Account credentials (from Google Cloud Console)
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''

export async function getAccessToken() {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Service account credentials not configured')
  }

  // Create JWT token for service account
  const jwt = require('jsonwebtoken')
  
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' })

  // Exchange JWT for access token
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
  return data.access_token
}

export async function fetchPrivateSheetData(range: string): Promise<any[][]> {
  try {
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
  } catch (error) {
    console.error('Error fetching private sheet data:', error)
    return []
  }
}