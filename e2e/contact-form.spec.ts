import { test, expect } from '@playwright/test'
import { clearEmails, waitForEmail, isMailpitRunning } from './helpers/mailpit'

/**
 * Contact form e2e tests.
 * Uses input name selectors since labels wrap <span> for required asterisk.
 */

// Helpers using stable name selectors
function fullName(page: any) { return page.locator('input[name="fullName"]') }
function emailField(page: any) { return page.locator('input[name="email"]') }
function phoneField(page: any) { return page.locator('input[name="phone"]') }
function subjectField(page: any) { return page.locator('input[name="subject"]') }
function messageField(page: any) { return page.locator('textarea[name="message"]') }

async function fillForm(page: any, overrides: Record<string, string> = {}) {
  await fullName(page).fill(overrides.fullName ?? 'Test User')
  await emailField(page).fill(overrides.email ?? 'test@example.com')
  await phoneField(page).fill(overrides.phone ?? '+852 9999 8888')
  await subjectField(page).fill(overrides.subject ?? 'Test Subject')
  if (overrides.message) await messageField(page).fill(overrides.message)
}

test.describe('Contact form — UI validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })
  })

  test('contact form renders all required fields', async ({ page }) => {
    await expect(fullName(page)).toBeVisible()
    await expect(emailField(page)).toBeVisible()
    await expect(phoneField(page)).toBeVisible()
    await expect(subjectField(page)).toBeVisible()
    await expect(messageField(page)).toBeVisible()
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible()
  })

  test('required fields block submission when empty', async ({ page }) => {
    await page.getByRole('button', { name: /submit/i }).click()
    // Browser native validation prevents submission — form stays visible
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('text=Thank you')).not.toBeVisible()
  })

  test('email field rejects invalid email format', async ({ page }) => {
    await fullName(page).fill('Test User')
    await emailField(page).fill('not-an-email')
    await phoneField(page).fill('+852 9999 8888')
    await subjectField(page).fill('Test Subject')
    await page.getByRole('button', { name: /submit/i }).click()
    // Browser validation — form stays visible, no success message
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('text=Thank you')).not.toBeVisible()
  })

  test('form shows loading state on submit', async ({ page }) => {
    await page.route('/api/contact', async (route) => {
      await new Promise((r) => setTimeout(r, 600))
      await route.fulfill({ status: 200, body: JSON.stringify({ id: 'test-id' }) })
    })
    await fillForm(page)
    await page.getByRole('button', { name: /submit/i }).click()
    await expect(page.locator('button:has-text("Sending")')).toBeVisible({ timeout: 3_000 })
  })
})

test.describe('Contact form — successful submission', () => {
  test('shows thank-you message on successful API response', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })

    await page.route('/api/contact', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ id: 'mock-sub-123' }) }),
    )
    await fillForm(page, { message: 'Automated e2e test message.' })
    await page.getByRole('button', { name: /submit/i }).click()

    await expect(page.locator('text=Thank you')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('form')).not.toBeVisible()
  })

  test('shows error message on API failure', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })

    await page.route('/api/contact', (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) }),
    )
    await fillForm(page)
    await page.getByRole('button', { name: /submit/i }).click()

    await expect(page.locator('text=Something went wrong')).toBeVisible({ timeout: 10_000 })
  })
})

test.describe('Contact form — email capture (requires Mailpit)', () => {
  test('contact form submission sends notification email', async ({ page }) => {
    const mailpitUp = await isMailpitRunning()
    if (!mailpitUp) {
      test.skip()
      return
    }

    await clearEmails()
    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })

    const uniqueSubject = `E2E-${Date.now()}`
    await fillForm(page, {
      subject: uniqueSubject,
      message: 'Automated e2e test — please ignore.',
    })
    await page.getByRole('button', { name: /submit/i }).click()
    await expect(page.locator('text=Thank you')).toBeVisible({ timeout: 20_000 })

    const email = await waitForEmail(
      (m) => m.Subject.includes(uniqueSubject),
      25_000,
    )
    expect(email.Subject).toContain(uniqueSubject)
  })
})
