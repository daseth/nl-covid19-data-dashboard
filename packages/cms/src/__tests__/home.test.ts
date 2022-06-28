import 'expect-puppeteer'

describe(
  '/ (Home Page)',
  () => {
    beforeAll(async () => {
      await page.goto('http://localhost:3333')
    })


    it('should have the correct title', async () => {
      const title = await page.title();
      expect(title).toContain('Coronavirus Dashboard CMS – Sanity')
    })
  },
)
