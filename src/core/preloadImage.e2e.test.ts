import puppeteer, { Browser, Page } from 'puppeteer'
import { port } from '../../e2e/test-vars'

describe('preloadImage', () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--window-size=1920,100'],
      defaultViewport: { width: 1920, height: 100 },
    })
    page = await browser.newPage()
  })

  afterAll(() => browser.close())

  it('deep default image with src set is not set yet', async () => {
    await page.goto(`http://127.0.0.1:${port}`)
    await page.waitForSelector('#default-with-src-set')

    const html = await page.$eval('#default-with-src-set', (element) => element.outerHTML)

    console.log(await page.$eval('html', (element) => element.clientHeight))

    expect(html).toContain('bor')
  }, 10_000)

  it('deep background is not set yet', async () => {
    await page.goto(`http://127.0.0.1:${port}`)
    await page.waitForSelector('#background-with-src-set')

    const html = await page.$eval('#background-with-src-set', (element) => element.outerHTML)

    expect(html).toContain('bor')
  }, 10_000)
})
