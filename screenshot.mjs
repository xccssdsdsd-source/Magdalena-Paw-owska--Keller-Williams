import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const url = process.argv[2] || 'http://localhost:3000'
const dir = path.join(__dirname, 'temporary screenshots')

if (!fs.existsSync(dir)) fs.mkdirSync(dir)

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
const next = existing.length + 1

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
  document.querySelectorAll('.hero-item').forEach(el => {
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })
})

await page.waitForTimeout(300)

const file = path.join(dir, `screenshot-${next}.png`)
await page.screenshot({ path: file, fullPage: true })
console.log(`Saved: ${file}`)

await browser.close()
