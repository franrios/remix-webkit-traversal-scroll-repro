import { createController } from 'remix/router'

import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import { HomePage } from './home-page.tsx'
import { DetailPage, ListPage, ShortDetailPage } from './scroll-pages.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },
    home(context) {
      return context.render(<HomePage />)
    },
    async list(context) {
      // Navigations back to the list load like a slow server's page, longer than the 300 ms
      // WebKit waits after a scroll before it saves the window's position into the current
      // history entry.
      if (context.request.headers.get('X-Remix-Frame') === 'true') {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      return context.render(<ListPage />)
    },
    detail(context) {
      return context.render(<DetailPage />)
    },
    shortDetail(context) {
      return context.render(<ShortDetailPage />)
    },
  },
})
