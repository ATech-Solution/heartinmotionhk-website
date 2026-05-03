import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Verify the dev server is reachable
  const browser = await chromium.launch()
  const page = await browser.newPage()
  try {
    const baseURL = config.projects[0].use.baseURL ?? 'http://localhost:3000'
    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    console.log(`\n✓ Dev server reachable at ${baseURL}`)
  } finally {
    await browser.close()
  }
}

export default globalSetup
