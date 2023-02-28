import puppeteer, { Browser, Page } from 'puppeteer'
import { extraWindow } from '../../e2e/outerCore/outer'
import { port } from './testVars';

type CurrentWindow = ReturnType<typeof extraWindow['content']>

export function describeE2E(
  name: string,
  callback: (props: {
    page(): Page;
    browser(): Browser;
    window: CurrentWindow;
  }) => void,
): ReturnType<jest.Describe> {
  return describe(name, () => {
    let browser: Browser
    let page: Page

    beforeAll(async () => {
      browser = await puppeteer.launch({
        args: ['--window-size=1920,500'],
        defaultViewport: { width: 1920, height: 500 },
        headless: false,
      })
      page = await browser.newPage()
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 WAIT_UNTIL=load',
      )
      await page.goto(`http://127.0.0.1:${port}`)
    })

    afterAll(() => browser.close())

    beforeEach(async () => {
      await page.reload()
    })

    callback({
      page: () => page,
      browser: () => browser,
      window: extraWindow.content(),
    })
  })
}
