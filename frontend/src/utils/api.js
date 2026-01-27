// API utility with authentication headers
import { supabase } from '../services/supabaseClient'

/**
 * Get the current access token from Supabase session
 */
async function getAccessToken() {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('[API] Error getting session:', error)
    return null
  }
  
  return session?.access_token || null
}

/**
 * Make an authenticated API request
 * @param {string} url - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiRequest(url, options = {}) {
  const token = await getAccessToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * GET request with authentication
 */
export async function apiGet(url) {
  return apiRequest(url, { method: 'GET' })
}

/**
 * POST request with authentication
 */
export async function apiPost(url, data) {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * PUT request with authentication
 */
export async function apiPut(url, data) {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * DELETE request with authentication
 */
export async function apiDelete(url) {
  return apiRequest(url, { method: 'DELETE' })
}
