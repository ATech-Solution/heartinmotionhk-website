/**
 * Shared auth helpers for e2e tests.
 */
import { Page } from '@playwright/test'

export const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'tan@atech.software'
export const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'Admin@123456'
export const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

/** Call the Payload logout API, then navigate to login and authenticate. */
export async function loginAsAdmin(page: Page): Promise<void> {
  // Explicitly log out any existing session before testing login
  await page.context().clearCookies()
  await fetch(`${BASE_URL}/api/users/logout`, { method: 'POST' }).catch(() => {})

  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')

  // Payload admin is a React SPA — wait for full hydration before interacting
  const emailInput = page.locator('input[type="email"]').first()
  await emailInput.waitFor({ state: 'visible', timeout: 25_000 })
  await emailInput.fill(ADMIN_EMAIL)

  const passwordInput = page.locator('input[type="password"]').first()
  await passwordInput.fill(ADMIN_PASSWORD)

  await page.getByRole('button', { name: /log.?in|Login/i }).click()
  await page.waitForURL('**/admin**', { timeout: 20_000 })
}

/** Call the REST API login endpoint and return the JWT token. */
export async function getAdminToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Admin login failed: ${res.status}`)
  const data = await res.json()
  return data.token as string
}

export async function createTestUser(token: string, email: string, password: string, verified = false): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ email, password, role: 'editor', _verified: verified }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Create user failed: ${JSON.stringify(err)}`)
  }
  const data = await res.json()
  return data.doc?.id as string
}

export async function deleteTestUser(token: string, userId: string): Promise<void> {
  await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
  })
}
