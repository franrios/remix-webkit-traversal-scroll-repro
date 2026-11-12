import type { Page } from 'playwright'
import * as assert from 'remix/assert'
import { createTestServer } from 'remix/node-fetch-server/test'
import { describe, it, type TestContext } from 'remix/test'

import { router } from '../router.ts'
import { routes } from '../routes.ts'

// Each test scrolls a 60-row list to 800 px, opens another page and goes Back. The list answers
// navigations 500 ms late, as a slow server would, so Back always takes longer than 300 ms.
describe('Back to a scrolled list', () => {
  it('restores the list after scrolling the detail page', async (t) => {
    let page = await openList(t)
    await openPage(page, 'Open detail', 'Detail')
    await page.evaluate(() => window.scrollTo(0, 300))

    await page.goBack()

    assert.equal(await readListScroll(page), 800)
  })

  it('restores the list when going back right after opening the detail page', async (t) => {
    let page = await openList(t)
    await openPage(page, 'Open detail', 'Detail')

    await page.goBack()

    assert.equal(await readListScroll(page), 800)
  })

  it('restores the list when going back from a page shorter than its position', async (t) => {
    let page = await openList(t)
    await openPage(page, 'Open short detail', 'Short detail')
    // Out of WebKit's 300 ms window after the last scroll, so only Firefox's clamping shows.
    await page.waitForTimeout(500)

    await page.goBack()

    assert.equal(await readListScroll(page), 800)
  })
})

async function openList(t: TestContext): Promise<Page> {
  let page = await t.serve(await createTestServer(router.fetch))
  await page.setViewportSize({ width: 800, height: 600 })
  await page.goto(routes.list.href())
  await page.evaluate(() => window.scrollTo(0, 800))
  return page
}

async function openPage(page: Page, link: string, heading: string) {
  await page.getByRole('link', { name: link }).click()
  await page.getByRole('heading', { name: heading, exact: true }).waitFor()
  await page.waitForFunction(() => window.navigation.transition === null)
}

async function readListScroll(page: Page): Promise<number> {
  await page.getByRole('heading', { name: 'List', exact: true }).waitFor()
  await page.waitForFunction(() => window.navigation.transition === null)
  // Remix keeps scroll anchoring off until two frames after a traversal finishes.
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  )
  return page.evaluate(() => window.scrollY)
}
