import { test, expect } from '@playwright/test'
import {
  clearEmails,
  waitForEmail,
  getEmailDetail,
  isMailpitRunning,
} from './helpers/mailpit'
import { getAdminToken, createTestUser, deleteTestUser, BASE_URL } from './helpers/auth'

/**
 * Email sending e2e tests.
 * All tests require Mailpit running on 127.0.0.1:1025 (SMTP) / 127.0.0.1:8025 (API).
 * Start with: npm run mailpit
 * The dev server must also be started with SMTP env vars overriding AWS SES:
 *   AWS_SES_SMTP_HOST=127.0.0.1 AWS_SES_SMTP_PORT=1025 npm run dev
 */

async function requireMailpit() {
  const running = await isMailpitRunning()
  if (!running) test.skip()
}

// Form helpers using stable name selectors
async function fillContactForm(page: any, overrides: Record<string, string> = {}) {
  await page.locator('input[name="fullName"]').fill(overrides.fullName ?? 'E2E Tester')
  await page.locator('input[name="email"]').fill(overrides.email ?? 'tester@example.com')
  await page.locator('input[name="phone"]').fill(overrides.phone ?? '+852 9999 8888')
  await page.locator('input[name="subject"]').fill(overrides.subject ?? `E2E-${Date.now()}`)
  if (overrides.message) {
    await page.locator('textarea[name="message"]').fill(overrides.message)
  }
}

// ─── Contact form notification email ─────────────────────────────────────────

test.describe('Contact form notification email', () => {
  test('submitting contact form triggers admin notification email', async ({ page }) => {
    await requireMailpit()
    await clearEmails()

    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })

    const uniqueSubject = `E2E-ContactForm-${Date.now()}`
    await fillContactForm(page, {
      subject: uniqueSubject,
      message: 'This is an automated e2e test — please ignore.',
    })
    await page.getByRole('button', { name: /submit/i }).click()

    await expect(page.locator('text=Thank you')).toBeVisible({ timeout: 20_000 })

    const email = await waitForEmail(
      (m) => m.Subject.includes(uniqueSubject),
      25_000,
    )
    expect(email).toBeTruthy()
    expect(email.Subject).toContain(uniqueSubject)

    const detail = await getEmailDetail(email.ID)
    expect(detail.HTML).toContain('E2E Tester')
    expect(detail.HTML).toContain('tester@example.com')
  })

  test('contact form email contains all submitted field values', async ({ page }) => {
    await requireMailpit()
    await clearEmails()

    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })

    const uniqueSubject = `E2E-Fields-${Date.now()}`
    const testMessage = `Unique message content ${Date.now()}`

    await fillContactForm(page, {
      fullName: 'Field Test User',
      email: 'fields@example.com',
      phone: '+852 1234 5678',
      subject: uniqueSubject,
      message: testMessage,
    })
    await page.getByRole('button', { name: /submit/i }).click()

    await expect(page.locator('text=Thank you')).toBeVisible({ timeout: 20_000 })

    const email = await waitForEmail((m) => m.Subject.includes(uniqueSubject), 25_000)
    const detail = await getEmailDetail(email.ID)

    expect(detail.HTML).toContain('Field Test User')
    expect(detail.HTML).toContain('fields@example.com')
    expect(detail.HTML).toContain('+852 1234 5678')
    expect(detail.HTML).toContain(testMessage)
  })
})

// ─── Password reset email ─────────────────────────────────────────────────────

test.describe('Password reset email', () => {
  let adminToken: string
  let testUserId: string
  const testEmail = `e2e-pw-${Date.now()}@test.com`

  test.beforeAll(async () => {
    const mailpitUp = await isMailpitRunning()
    if (!mailpitUp) return
    adminToken = await getAdminToken()
    testUserId = await createTestUser(adminToken, testEmail, 'TempPass123!')
  })

  test.afterAll(async () => {
    if (adminToken && testUserId) {
      await deleteTestUser(adminToken, testUserId)
    }
  })

  test('forgot-password request sends email with branded reset link', async () => {
    await requireMailpit()
    await clearEmails()

    const res = await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    })
    expect(res.status).toBe(200)

    const email = await waitForEmail(
      (m) => m.To.some((t) => t.Address === testEmail),
      20_000,
    )
    expect(email.Subject).toMatch(/reset|password/i)

    const detail = await getEmailDetail(email.ID)
    expect(detail.HTML).toContain('/reset-password?token=')
    expect(detail.HTML).toContain('Heart in Motion')
    expect(detail.HTML).toContain('1 hour')
  })

  test('reset email contains a valid extractable token', async () => {
    await requireMailpit()
    await clearEmails()

    await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    })

    const email = await waitForEmail(
      (m) => m.To.some((t) => t.Address === testEmail),
      20_000,
    )
    const detail = await getEmailDetail(email.ID)
    const tokenMatch = detail.HTML.match(/reset-password\?token=([A-Za-z0-9._%-]+)/)
    expect(tokenMatch).toBeTruthy()
    expect(decodeURIComponent(tokenMatch![1]).length).toBeGreaterThan(10)
  })
})

// ─── Email verification ───────────────────────────────────────────────────────

test.describe('Email verification', () => {
  let adminToken: string
  let newUserId: string
  const newUserEmail = `e2e-verify-${Date.now()}@test.com`

  test.beforeAll(async () => {
    const mailpitUp = await isMailpitRunning()
    if (!mailpitUp) return
    adminToken = await getAdminToken()
  })

  test.afterAll(async () => {
    if (adminToken && newUserId) {
      await deleteTestUser(adminToken, newUserId)
    }
  })

  test('creating a new user triggers a verification email', async () => {
    await requireMailpit()
    await clearEmails()

    newUserId = await createTestUser(adminToken, newUserEmail, 'VerifyPass123!')

    const email = await waitForEmail(
      (m) => m.To.some((t) => t.Address === newUserEmail),
      20_000,
    )
    expect(email.Subject).toMatch(/verify|confirm|welcome/i)

    const detail = await getEmailDetail(email.ID)
    expect(detail.HTML).toContain('/verify-email?token=')
    expect(detail.HTML).toContain('Heart in Motion')
  })

  test('verification email contains a valid token link', async () => {
    await requireMailpit()
    // Use emails captured by the previous test; request again if none found
    const emails = await (await import('./helpers/mailpit')).getEmails()
    let verifyEmail = emails.find(
      (m) => m.To.some((t) => t.Address === newUserEmail),
    )
    if (!verifyEmail) {
      // Re-trigger for standalone run
      const extraEmail = `retry-verify-${Date.now()}@test.com`
      const extraId = await createTestUser(adminToken, extraEmail, 'VerifyPass123!')
      verifyEmail = await waitForEmail(
        (m) => m.To.some((t) => t.Address === extraEmail),
        20_000,
      )
      await deleteTestUser(adminToken, extraId)
    }

    const detail = await getEmailDetail(verifyEmail.ID)
    const tokenMatch = detail.HTML.match(/verify-email\?token=([A-Za-z0-9]+)/)
    expect(tokenMatch).toBeTruthy()
    expect(tokenMatch![1].length).toBeGreaterThan(5)
  })

  test('verification link responds with success', async () => {
    await requireMailpit()
    const emails = await (await import('./helpers/mailpit')).getEmails()
    const verifyEmail = emails.find((m) => m.To.some((t) => t.Address === newUserEmail))
    if (!verifyEmail) {
      test.skip()
      return
    }

    const detail = await getEmailDetail(verifyEmail.ID)
    const tokenMatch = detail.HTML.match(/verify-email\?token=([A-Za-z0-9]+)/)
    if (!tokenMatch) { test.skip(); return }

    const res = await fetch(`${BASE_URL}/api/users/verify/${tokenMatch[1]}`, {
      method: 'POST',
    })
    expect([200, 301, 302, 307, 308]).toContain(res.status)
  })
})

// ─── Email template unit checks (via live API) ────────────────────────────────
// Templates are tested indirectly through the Mailpit integration tests above.
// These smoke tests verify the emails sent to Mailpit contain the expected content.

test.describe('Email template rendering', () => {
  let adminToken: string
  let templateTestUserId: string
  const templateTestEmail = `e2e-template-${Date.now()}@test.com`

  test.beforeAll(async () => {
    const mailpitUp = await isMailpitRunning()
    if (!mailpitUp) return
    adminToken = await getAdminToken()
    await clearEmails()
    templateTestUserId = await createTestUser(adminToken, templateTestEmail, 'TempPass123!', false)
  })

  test.afterAll(async () => {
    if (adminToken && templateTestUserId) {
      await deleteTestUser(adminToken, templateTestUserId)
    }
  })

  test('forgot password template contains reset link and branding', async () => {
    await requireMailpit()
    await clearEmails()

    await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: templateTestEmail }),
    })

    const email = await waitForEmail(
      (m) => m.To.some((t) => t.Address === templateTestEmail),
      20_000,
    )
    const detail = await getEmailDetail(email.ID)

    expect(detail.HTML).toContain('reset-password?token=')
    expect(detail.HTML).toContain('Heart in Motion')
    expect(detail.HTML).toContain('Reset Password')
    expect(detail.HTML).toContain('1 hour')
  })

  test('verify email template contains verify link and branding', async () => {
    await requireMailpit()
    await clearEmails()

    // Create a fresh user to trigger a new verification email
    const verifyTestEmail = `e2e-verifytempl-${Date.now()}@test.com`
    const verifyTestId = await createTestUser(adminToken, verifyTestEmail, 'TempPass123!', false)
    try {
      const email = await waitForEmail(
        (m) => m.To.some((t) => t.Address === verifyTestEmail),
        20_000,
      )
      const detail = await getEmailDetail(email.ID)
      expect(detail.HTML).toContain('/verify-email?token=')
      expect(detail.HTML).toContain('Heart in Motion')
      expect(detail.HTML).toMatch(/[Vv]erify/)
    } finally {
      await deleteTestUser(adminToken, verifyTestId)
    }
  })

  test('forgot password template falls back to email when no name', async () => {
    await requireMailpit()
    await clearEmails()

    // Create a nameless user and request reset
    const namelessEmail = `e2e-noname-${Date.now()}@test.com`
    const namelessId = await createTestUser(adminToken, namelessEmail, 'TempPass123!', true)
    try {
      await fetch(`${BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: namelessEmail }),
      })
      const email = await waitForEmail(
        (m) => m.To.some((t) => t.Address === namelessEmail),
        20_000,
      )
      const detail = await getEmailDetail(email.ID)
      expect(detail.HTML).toContain(namelessEmail)
    } finally {
      await deleteTestUser(adminToken, namelessId)
    }
  })
})
