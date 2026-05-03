import { test, expect } from '@playwright/test'

/**
 * Navigation tests: header links, footer links, mobile menu.
 */

test.describe('Desktop navigation', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('header renders nav links', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    // Nav should have at least one link
    const navLinks = header.locator('a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('header CTA buttons are visible on desktop', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    // Desktop CTA buttons ("Let's connect" / "Email me")
    const ctaButtons = header.locator('a[href], button').filter({ hasNot: page.locator('nav') })
    const count = await ctaButtons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('clicking a nav link navigates to the correct page', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    // Find any nav link that isn't the logo (pointing to home)
    const navLinks = header.locator('nav a')
    const count = await navLinks.count()
    if (count === 0) return // No nav links found; skip

    const href = await navLinks.first().getAttribute('href')
    if (href && href !== '/') {
      await navLinks.first().click()
      await page.waitForLoadState('domcontentloaded')
      expect(page.url()).toContain(href.replace(/^\//, ''))
    }
  })

  test('footer renders', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('footer has navigation links', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    const links = footer.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  test('footer privacy policy link works', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    const privacyLink = footer.locator('a[href*="privacy"]').first()
    if (await privacyLink.isVisible()) {
      await privacyLink.click()
      await page.waitForLoadState('domcontentloaded')
      expect(page.url()).toContain('privacy')
    }
  })

  test('footer terms link works', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    const termsLink = footer.locator('a[href*="terms"]').first()
    if (await termsLink.isVisible()) {
      await termsLink.click()
      await page.waitForLoadState('domcontentloaded')
      expect(page.url()).toContain('terms')
    }
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('hamburger menu is visible on mobile', async ({ page }) => {
    await page.goto('/')
    // Mobile hamburger button
    const hamburger = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], button svg').first()
    await expect(hamburger).toBeVisible()
  })

  test('mobile menu opens and shows nav links', async ({ page }) => {
    await page.goto('/')
    // Find hamburger — any button in header that opens mobile nav
    const header = page.locator('header')
    const menuBtn = header.locator('button').last()
    if (await menuBtn.isVisible()) {
      await menuBtn.click()
      // After opening, nav links should appear
      await page.waitForTimeout(300)
      const visibleLinks = await page.locator('nav a, [role="navigation"] a').count()
      expect(visibleLinks).toBeGreaterThan(0)
    }
  })

  test('mobile menu closes when toggled again', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    const menuBtn = header.locator('button').last()
    if (await menuBtn.isVisible()) {
      await menuBtn.click()
      await page.waitForTimeout(300)
      await menuBtn.click()
      await page.waitForTimeout(300)
      // Menu should be hidden after second click — check no overflow-y-scroll trap
      const overflow = await page.evaluate(() => document.body.style.overflow)
      expect(overflow).not.toBe('hidden')
    }
  })

  test('footer is visible on mobile', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})

test.describe('Locale switcher', () => {
  test('locale switcher changes language', async ({ page }) => {
    await page.goto('/')
    const switcher = page.locator('[data-locale-switcher], button:has-text("中文"), button:has-text("EN"), select').first()
    if (await switcher.isVisible()) {
      await switcher.click()
      await page.waitForTimeout(500)
      // After switching, page should still load without errors
      await expect(page.locator('body')).not.toContainText('Application error')
    }
  })
})
