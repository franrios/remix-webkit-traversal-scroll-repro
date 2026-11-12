import { css } from 'remix/component'

import { routes } from '../routes.ts'
import { Document } from './document.tsx'

const rows = Array.from({ length: 60 }, (_, index) => index + 1)

export function ListPage() {
  return () => (
    <Document title="List">
      <nav
        mix={css({ position: 'fixed', top: 0, right: 0, display: 'flex', gap: 12, padding: 12 })}
      >
        <a href={routes.detail.href()}>Open detail</a>
        <a href={routes.shortDetail.href()}>Open short detail</a>
      </nav>
      <h1>List</h1>
      <ol>
        {rows.map((row) => (
          <li key={row} mix={css({ height: 80 })}>
            Row {row}
          </li>
        ))}
      </ol>
    </Document>
  )
}

export function DetailPage() {
  return () => (
    <Document title="Detail">
      <main mix={css({ height: 3000 })}>
        <h1>Detail</h1>
      </main>
    </Document>
  )
}

export function ShortDetailPage() {
  return () => (
    <Document title="Short detail">
      <main>
        <h1>Short detail</h1>
      </main>
    </Document>
  )
}
