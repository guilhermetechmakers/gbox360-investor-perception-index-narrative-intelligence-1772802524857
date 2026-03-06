import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportCSV, exportJSON, exportPDF } from './auditExporter'
import type { ExportPayload } from '@/types/historical-comparison'

describe('auditExporter', () => {
  const minimalPayload: ExportPayload = {
    companyId: 'c1',
    ipi: { narrative: 10, credibility: 20, risk: 5, total: 35, decayFactor: 0.9 },
    narratives: [],
    exportedAt: '2025-03-06T12:00:00Z',
  }

  beforeEach(() => {
    const mockLink = { href: '', download: '', click: vi.fn() }
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    })
    vi.stubGlobal('document', {
      createElement: vi.fn(() => mockLink),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('exportCSV', () => {
    it('handles null/undefined without throwing', () => {
      expect(() => exportCSV(null)).not.toThrow()
      expect(() => exportCSV(undefined)).not.toThrow()
    })
  })

  describe('exportJSON', () => {
    it('handles null/undefined without throwing', () => {
      expect(() => exportJSON(null)).not.toThrow()
      expect(() => exportJSON(undefined)).not.toThrow()
    })
  })

  describe('exportPDF', () => {
    it('handles null/undefined without throwing', () => {
      const mockWin = {
        document: { write: vi.fn(), close: vi.fn() },
        focus: vi.fn(),
        print: vi.fn(),
        close: vi.fn(),
      }
      vi.stubGlobal('window', { ...global.window, open: vi.fn(() => mockWin) })
      expect(() => exportPDF(null)).not.toThrow()
      expect(() => exportPDF(undefined)).not.toThrow()
    })
  })
})
