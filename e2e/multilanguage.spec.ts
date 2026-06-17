import { test, expect } from '@playwright/test'

test.describe('Locale routing', () => {
  test('/ redirects to /en/', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })
    expect(page.url()).toMatch(/\/en(\/|$)/)
  })

  test('/en/ renders home page content', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).not.toContainText('Application error')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('/zh-HK/ renders page without error', async ({ page }) => {
    await page.goto('/zh-HK/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).not.toContainText('Application error')
  })

  test('language switcher is visible', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' })
    const switcher = page.locator('[aria-label="Language selector"]')
    await expect(switcher).toBeVisible()
  })

  test('switching to zh-HK navigates to /zh-HK/', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' })
    const switcher = page.locator('[aria-label="Language selector"]')
    await switcher.click()
    const zhOption = page.locator('[role="option"]').filter({ hasText: 'ZH-HK' })
    await zhOption.click()
    await page.waitForURL(/\/zh-HK\//)
    expect(page.url()).toMatch(/\/zh-HK\//)
  })
})
