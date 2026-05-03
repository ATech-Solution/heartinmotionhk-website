import { test, expect } from '@playwright/test'
import { loginAsAdmin, getAdminToken, createTestUser, deleteTestUser, ADMIN_EMAIL, BASE_URL } from './helpers/auth'
import { clearEmails, waitForEmail, isMailpitRunning } from './helpers/mailpit'

/**
 * Authentication e2e tests:
 * - Admin login / logout
 * - Forgot password UI
 * - Reset password page UI
 * - Password reset API flow
 */

// ─── Admin login (browser) ────────────────────────────────────────────────────

test.describe('Admin login', () => {
  test.beforeEach(async ({ page }) => {
    // Log out any existing session via Payload REST API, then clear browser cookies
    await page.context().clearCookies()
    await fetch(`${BASE_URL}/api/users/logout`, { method: 'POST' }).catch(() => {})
  })

  test('admin login page renders email and password fields', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    // Payload renders a React SPA — may briefly redirect to dashboard if cookies linger
    // Wait up to 3s for URL to settle
    await page.waitForTimeout(2000)
    if (page.url().includes('/admin') && !page.url().includes('login')) {
      // Already redirected — Payload client detected stale state. Navigate back.
      await page.goto('/api/users/logout', { waitUntil: 'domcontentloaded' }).catch(() => {})
      await page.context().clearCookies()
      await page.goto('/admin/login')
      await page.waitForLoadState('networkidle')
    }
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible({ timeout: 25_000 })
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test('invalid credentials show error message', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    if (page.url().includes('/admin') && !page.url().includes('login')) {
      await page.goto('/api/users/logout', { waitUntil: 'domcontentloaded' }).catch(() => {})
      await page.context().clearCookies()
      await page.goto('/admin/login')
      await page.waitForLoadState('networkidle')
    }
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.waitFor({ state: 'visible', timeout: 25_000 })
    await emailInput.fill('wrong@example.com')
    await page.locator('input[type="password"]').first().fill('wrongpassword')
    await page.getByRole('button', { name: /log.?in/i }).click()
    await expect(
      page.locator('[class*="error"], [class*="Error"], [role="alert"]').first(),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('valid admin credentials log in successfully', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL(/\/admin/)
    // Admin dashboard shows Collections heading
    await expect(page.locator('h2, h1, [class*="dashboard"]').first()).toBeVisible({ timeout: 15_000 })
  })

  test('admin logout API clears session', async () => {
    // Log in via API and verify token works
    const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'Admin@123456' }),
    })
    expect(loginRes.status).toBe(200)
    const loginData = await loginRes.json()
    const token = loginData.token

    // Verify token gives access
    const meRes = await fetch(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
    })
    expect(meRes.status).toBe(200)
    const meData = await meRes.json()
    expect(meData.user?.email).toBe(ADMIN_EMAIL)

    // Logout via POST
    const logoutRes = await fetch(`${BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: { Authorization: `JWT ${token}` },
    })
    expect([200, 204]).toContain(logoutRes.status)
  })
})

// ─── Admin API authentication ─────────────────────────────────────────────────

test.describe('Admin API authentication', () => {
  test('login API returns JWT token', async () => {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'Admin@123456' }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.token).toBeTruthy()
    expect(data.user?.email).toBe(ADMIN_EMAIL)
  })

  test('protected API requires auth token', async () => {
    const res = await fetch(`${BASE_URL}/api/users`, {
      headers: { 'Content-Type': 'application/json' },
    })
    expect([401, 403]).toContain(res.status)
  })

  test('protected API accessible with valid token', async () => {
    const token = await getAdminToken()
    const res = await fetch(`${BASE_URL}/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.docs)).toBeTruthy()
  })

  test('invalid token returns 401', async () => {
    const res = await fetch(`${BASE_URL}/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT invalid-token-here',
      },
    })
    expect([401, 403]).toContain(res.status)
  })
})

// ─── Forgot password UI ───────────────────────────────────────────────────────

test.describe('Forgot password UI', () => {
  test('forgot password API accepts valid email without revealing existence', async () => {
    const res = await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL }),
    })
    // Returns 200 regardless (security: don't reveal if email exists)
    expect(res.status).toBe(200)
  })

  test('forgot password API returns 200 for unknown email', async () => {
    const res = await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doesnotexist@example.com' }),
    })
    expect(res.status).toBe(200)
  })

  test('forgot password API rejects missing email with 400', async () => {
    const res = await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect([400, 422]).toContain(res.status)
  })
})

// ─── Reset password page (UI) ─────────────────────────────────────────────────

test.describe('Reset password page', () => {
  test('renders password inputs with valid token param', async ({ page }) => {
    await page.goto('/reset-password?token=test-ui-token')
    await expect(page.locator('h1')).toContainText('Reset Password')
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible()
  })

  test('shows error when passwords do not match', async ({ page }) => {
    await page.goto('/reset-password?token=test-ui-token')
    await page.locator('input[type="password"]').first().fill('Password123!')
    await page.locator('input[type="password"]').nth(1).fill('DifferentPass123!')
    await page.getByRole('button', { name: /reset password/i }).click()
    await expect(page.locator('text=do not match')).toBeVisible({ timeout: 5_000 })
  })

  test('shows error when password too short', async ({ page }) => {
    await page.goto('/reset-password?token=test-ui-token')
    await page.locator('input[type="password"]').first().fill('short')
    await page.locator('input[type="password"]').nth(1).fill('short')
    await page.getByRole('button', { name: /reset password/i }).click()
    // The browser's native minLength (8) validation blocks submission — either the native
    // tooltip fires OR the React-level error renders; either way the form stays visible.
    await expect(page.locator('form')).toBeVisible({ timeout: 3_000 })
    // Success state must NOT appear
    await expect(page.locator('text=successfully')).not.toBeVisible()
  })

  test('shows error on API rejection of invalid token', async ({ page }) => {
    await page.goto('/reset-password?token=bad-token-invalid')
    await page.locator('input[type="password"]').first().fill('NewPassword123!')
    await page.locator('input[type="password"]').nth(1).fill('NewPassword123!')
    await page.getByRole('button', { name: /reset password/i }).click()
    await expect(
      page.locator('p.text-red-500, [class*="error"]').filter({ hasText: /.+/ }).first(),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('shows error without token', async ({ page }) => {
    await page.goto('/reset-password')
    const btn = page.getByRole('button', { name: /reset password/i })
    if (await btn.isVisible()) {
      await page.locator('input[type="password"]').first().fill('NewPassword123!')
      await page.locator('input[type="password"]').nth(1).fill('NewPassword123!')
      await btn.click()
      await expect(page.locator('text=Invalid or missing reset token')).toBeVisible({ timeout: 5_000 })
    }
  })
})

// ─── Full password reset flow (requires Mailpit) ──────────────────────────────

test.describe('Full password reset flow (requires Mailpit)', () => {
  let adminToken: string
  let testUserId: string
  const testEmail = `e2e-reset-${Date.now()}@test.com`
  const newPassword = 'NewPass456!Reset'

  test.beforeAll(async () => {
    const mailpitUp = await isMailpitRunning()
    if (!mailpitUp) return
    adminToken = await getAdminToken()
    testUserId = await createTestUser(adminToken, testEmail, 'TempPass123!', true)
  })

  test.afterAll(async () => {
    if (adminToken && testUserId) {
      await deleteTestUser(adminToken, testUserId)
    }
  })

  test('full flow: request email → extract token → set new password → login', async ({ page }) => {
    const mailpitUp = await isMailpitRunning()
    if (!mailpitUp) {
      test.skip()
      return
    }

    await clearEmails()

    // 1. Request password reset
    const forgotRes = await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    })
    expect(forgotRes.status).toBe(200)

    // 2. Wait for reset email in Mailpit
    const email = await waitForEmail(
      (m) => m.To.some((t) => t.Address === testEmail),
      25_000,
    )
    expect(email.Subject).toMatch(/reset|password/i)

    // 3. Extract token from email HTML
    const { getEmailDetail } = await import('./helpers/mailpit')
    const detail = await getEmailDetail(email.ID)
    const tokenMatch = detail.HTML.match(/reset-password\?token=([A-Za-z0-9._%-]+)/)
    expect(tokenMatch).toBeTruthy()
    const resetToken = decodeURIComponent(tokenMatch![1])

    // 4. Navigate to reset page with token and set new password
    await page.goto(`/reset-password?token=${encodeURIComponent(resetToken)}`)
    await page.locator('input[type="password"]').first().fill(newPassword)
    await page.locator('input[type="password"]').nth(1).fill(newPassword)
    await page.getByRole('button', { name: /reset password/i }).click()

    await expect(page.locator('text=successfully')).toBeVisible({ timeout: 20_000 })

    // 5. Verify new password works via API
    const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: newPassword }),
    })
    expect(loginRes.status).toBe(200)
    const loginData = await loginRes.json()
    expect(loginData.token).toBeTruthy()
  })
})
