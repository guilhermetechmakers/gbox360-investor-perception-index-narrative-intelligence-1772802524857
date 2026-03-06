/**
 * AuditArtifactExporter for Gbox360 Historical Comparison.
 * Exports CSV, PDF (print dialog), and JSON with IPI, narratives, raw payload refs.
 * Safeguards: guard null data; produce empty artifacts gracefully.
 */
import type { ExportPayload, NarrativeEvent } from '@/types/historical-comparison'
import { serializeForAudit } from './narrativeEventModel'

const EMPTY_PAYLOAD: ExportPayload = {
  narratives: [],
  exportedAt: new Date().toISOString(),
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Export data as CSV. Handles missing data gracefully.
 */
export function exportCSV(data: ExportPayload | null | undefined): void {
  const payload: ExportPayload = data ?? EMPTY_PAYLOAD
  const narratives = Array.isArray(payload.narratives) ? payload.narratives : []
  const ipi = payload.ipi

  const rows: string[][] = []
  rows.push(['Historical Comparison Export', payload.exportedAt ?? new Date().toISOString()])
  rows.push(['Company', payload.companyName ?? payload.companyId ?? '—'])
  rows.push(['Window', payload.windowLabel ?? payload.windowId ?? '—'])
  rows.push(['Peer', payload.peerName ?? payload.peerId ?? '—'])
  rows.push([])

  if (ipi) {
    rows.push(['IPI Components', ''])
    rows.push(['Narrative (40%)', String(ipi.narrative)])
    rows.push(['Credibility (40%)', String(ipi.credibility)])
    rows.push(['Risk (20%)', String(ipi.risk)])
    rows.push(['Total', String(ipi.total)])
    rows.push(['Decay Factor', String(ipi.decayFactor)])
    rows.push([])
  }

  rows.push(['Narrative Events', 'Source', 'Speaker', 'Date', 'Topics', 'Payload Ref', 'Excerpt'])
  for (const item of narratives) {
    const event = item?.event
    if (!event) continue
    const excerpt = (event.rawText ?? '').slice(0, 80).replace(/"/g, '""')
    rows.push([
      event.id ?? '',
      event.sourcePlatform ?? '',
      event.speaker?.name ?? '',
      event.timestamps?.eventAt ?? event.timestamps?.createdAt ?? '',
      (event.topics ?? []).join('; '),
      event.payloadReference ?? '',
      `"${excerpt}"`,
    ])
  }

  const csv = rows.map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, `historical-comparison-${Date.now()}.csv`)
}

/**
 * Export as JSON. Handles missing data gracefully.
 */
export function exportJSON(data: ExportPayload | null | undefined): void {
  const payload: ExportPayload = data ?? EMPTY_PAYLOAD
  const narratives = Array.isArray(payload.narratives) ? payload.narratives : []
  const sanitized: Record<string, unknown> = {
    companyId: payload.companyId ?? null,
    companyName: payload.companyName ?? null,
    windowId: payload.windowId ?? null,
    windowLabel: payload.windowLabel ?? null,
    peerId: payload.peerId ?? null,
    peerName: payload.peerName ?? null,
    exportedAt: payload.exportedAt ?? new Date().toISOString(),
    ipi: payload.ipi ?? null,
    narratives: narratives.map((item) => ({
      event: item?.event ? serializeForAudit(item.event as NarrativeEvent) : null,
      impact: item?.impact ?? null,
    })),
    metadata: payload.metadata ?? {},
  }
  const json = JSON.stringify(sanitized, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  downloadBlob(blob, `historical-comparison-${Date.now()}.json`)
}

/**
 * Export as PDF via print dialog. Opens formatted HTML in new window for Print to PDF.
 */
export function exportPDF(data: ExportPayload | null | undefined): void {
  const payload: ExportPayload = data ?? EMPTY_PAYLOAD
  const narratives = Array.isArray(payload.narratives) ? payload.narratives : []
  const ipi = payload.ipi

  const lines: string[] = []
  lines.push('<h1>Historical Comparison Export</h1>')
  lines.push(`<p>Exported: ${payload.exportedAt ?? new Date().toISOString()}</p>`)
  lines.push(`<p>Company: ${payload.companyName ?? payload.companyId ?? '—'}</p>`)
  lines.push(`<p>Window: ${payload.windowLabel ?? payload.windowId ?? '—'}</p>`)
  lines.push(`<p>Peer: ${payload.peerName ?? payload.peerId ?? '—'}</p>`)

  if (ipi) {
    lines.push('<h2>IPI Components (Provisional Weights)</h2>')
    lines.push('<ul>')
    lines.push(`<li>Narrative (40%): ${ipi.narrative}</li>`)
    lines.push(`<li>Credibility (40%): ${ipi.credibility}</li>`)
    lines.push(`<li>Risk (20%): ${ipi.risk}</li>`)
    lines.push(`<li>Total: ${ipi.total}</li>`)
    lines.push(`<li>Decay Factor: ${ipi.decayFactor}</li>`)
    lines.push('</ul>')
  }

  lines.push('<h2>Narrative Events</h2>')
  lines.push('<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;width:100%">')
  lines.push('<tr><th>ID</th><th>Source</th><th>Speaker</th><th>Date</th><th>Topics</th><th>Payload Ref</th><th>Excerpt</th></tr>')
  for (const item of narratives) {
    const event = item?.event
    if (!event) continue
    const excerpt = (event.rawText ?? '').slice(0, 100).replace(/</g, '&lt;')
    lines.push(
      `<tr><td>${event.id ?? ''}</td><td>${event.sourcePlatform ?? ''}</td><td>${event.speaker?.name ?? ''}</td><td>${event.timestamps?.eventAt ?? event.timestamps?.createdAt ?? ''}</td><td>${(event.topics ?? []).join(', ')}</td><td>${event.payloadReference ?? ''}</td><td>${excerpt}</td></tr>`
    )
  }
  lines.push('</table>')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Historical Comparison Export</title></head><body>${lines.join('')}</body></html>`
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }
}
