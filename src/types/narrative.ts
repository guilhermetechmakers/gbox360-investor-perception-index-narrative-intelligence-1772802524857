export interface NarrativeEvent {
  eventId: string
  source: string
  platform: string
  speakerEntity?: string
  speakerRole?: string
  audienceClass?: string
  rawText: string
  publishedAt: string
  ingestedAt: string
  canonicalTopics: string[]
  ingestionMetadata?: Record<string, unknown>
}

export interface Narrative {
  id: string
  summary: string
  contributionPercent: number
  persistenceScore: number
  topic: string
  events: NarrativeEvent[]
}
