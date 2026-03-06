export interface RawPayload {
  id: string
  source: string
  ingestTimestamp: string
  jobId: string
  payload: string | Record<string, unknown>
  metadata: Record<string, unknown>
}
