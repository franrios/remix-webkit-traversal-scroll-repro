# Remix WebKit traversal scroll repro

Back restores the wrong scroll position in WebKit when going back takes longer than 300 ms, and in Firefox when the destination is taller than the page being left. Made with `npx remix@3.2.0 new` (`@remix-run/component` 1.2.0); the second commit adds the repro:

- `/list`: 60 rows, with fixed links to `/detail` (3000 px tall) and `/short-detail` (one screen). Navigations back to the list answer 500 ms late, as a slow server would (`app/actions/controller.tsx`).
- `app/actions/scroll-restoration.test.e2e.ts`: scrolls the list to 800 px, opens a page and goes Back, in WebKit, Chromium and Firefox.

## Run it

```sh
npm i
npx playwright install webkit chromium firefox
npm test
```

| Test | WebKit 26.6 | Chromium 153 | Firefox 155 |
| --- | --- | --- | --- |
| Scroll the detail page 300 px, then Back | **300** | 800 | 800 |
| Back right after the detail page opens | **0** | 800 | 800 |
| Back from the short page, 500 ms after it opens | 800 | 800 | **600** |

The list should come back at 800 every time.

In Safari: `npm start`, open http://localhost:44100/list, scroll down and click **Open detail**. Scroll the detail page a little and press Back within 300 ms of the scroll stopping: the list comes back where the detail page was. Press Back right after the detail page opens instead, and it comes back at the top.
