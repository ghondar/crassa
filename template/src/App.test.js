const puppeteer = require('puppeteer')

let browser
let page

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    slowMo  : 250,
    devtools: true
  }

  return process.env.NODE_ENV === 'debug' ? debugging_mode : {}
}

beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging())
  page = await browser.newPage()
  await page.goto('http://localhost:3000')
  page.setViewport({ width: 500, height: 2400 })
})

test(
  'First render',
  async () => {
    await page.waitForSelector('h1')

    const html = await page.$eval('h1', e => e.innerText)
    expect(html).toBe('Hola Mundo')
  },
  16000
)

afterAll(() => {
  if(isDebugging()) browser.close()
})
