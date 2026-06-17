import { test, expect } from '@playwright/test'

/**
 * Smoke tests: every key page must load with HTTP 200 and no error state.
 */

const pages = [
  { name: 'Home',          path: '/en' },
  { name: 'About',         path: '/en/about' },
  { name: 'Services',      path: '/en/services' },
  { name: 'Contact',       path: '/en/contact' },
  { name: 'Privacy Policy', path: '/en/privacy-policy' },
  { name: 'Terms',         path: '/en/terms' },
  { name: 'Reset Password', path: '/en/reset-password' },
]

for (const { name, path } of pages) {
  test(`${name} page loads (${path})`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
    expect(response?.status(), `${name} HTTP status`).toBe(200)

    // No Next.js error overlay
    await expect(page.locator('body')).not.toContainText('Application error')
    await expect(page.locator('body')).not.toContainText('unhandled runtime error', { ignoreCase: true })
  })
}

test('Home page has site name or logo', async ({ page }) => {
  await page.goto('/en')
  // Header should have site name or logo image
  const header = page.locator('header')
  await expect(header).toBeVisible()
  const hasLogo = await header.locator('img').count() > 0
  const hasSiteName = await header.locator('text=Heart').count() > 0
  expect(hasLogo || hasSiteName).toBeTruthy()
})

test('Home page has a main section', async ({ page }) => {
  await page.goto('/en')
  await expect(page.locator('main')).toBeVisible()
  const sectionCount = await page.locator('section').count()
  expect(sectionCount).toBeGreaterThan(0)
})

test('Services page renders service content', async ({ page }) => {
  await page.goto('/en/services')
  await expect(page.locator('main')).toBeVisible()
})

test('Contact page has a form', async ({ page }) => {
  await page.goto('/en/contact')
  await expect(page.locator('form, [data-block-type="contact-form"]')).toBeVisible({ timeout: 10_000 })
})

test('Privacy policy page has policy content', async ({ page }) => {
  await page.goto('/en/privacy-policy')
  await expect(page.locator('main')).toBeVisible()
  // heading may start hidden due to scroll animations — check DOM presence
  await expect(page.locator('h1, h2').first()).toBeAttached()
})

test('Terms page has terms content', async ({ page }) => {
  await page.goto('/en/terms')
  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1, h2').first()).toBeAttached()
})

test('Reset password page renders form when token present', async ({ page }) => {
  await page.goto('/en/reset-password?token=test-token-for-ui')
  await expect(page.locator('h1')).toContainText('Reset Password')
  await expect(page.locator('input[type="password"]').first()).toBeVisible()
})

test('Reset password page shows error without token', async ({ page }) => {
  await page.goto('/en/reset-password')
  const submitBtn = page.getByRole('button', { name: /reset password/i })
  if (await submitBtn.isVisible()) {
    // Fill valid-length passwords so native minLength doesn't interfere
    await page.locator('input[type="password"]').first().fill('ValidPass123!')
    await page.locator('input[type="password"]').nth(1).fill('ValidPass123!')
    await submitBtn.click()
    // Token is missing → React shows "Invalid or missing reset token"
    await expect(page.locator('text=Invalid or missing reset token')).toBeVisible({ timeout: 5_000 })
  }
})

test('Admin panel accessible', async ({ page }) => {
  const response = await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  expect([200, 302, 307]).toContain(response?.status())
  // Should end up at login or admin dashboard
  await expect(page.locator('body')).not.toContainText('Application error')
})

test('Maintenance page accessible', async ({ page }) => {
  const response = await page.goto('/maintenance', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBeLessThan(500)
})
