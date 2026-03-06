/**
 * Lightweight NarrativeTopicClassifier for Gbox360 MVP.
 * Rule-based keyword mapping. Optional embeddings fallback for future extension.
 * Safeguards: guard against null/undefined; always return [] if no data.
 */

/** Rule-based keyword → topic mapping */
const TOPIC_KEYWORDS: Record<string, string[]> = {
  earnings: ['revenue', 'earnings', 'profit', 'margin', 'guidance', 'quarterly', 'eps'],
  governance: ['board', 'ceo', 'cfo', 'executive', 'governance', 'compliance', 'audit'],
  risk: ['risk', 'litigation', 'lawsuit', 'regulatory', 'sec', 'investigation'],
  growth: ['growth', 'expansion', 'acquisition', 'merger', 'market share'],
  sustainability: ['esg', 'sustainability', 'carbon', 'climate', 'environment'],
  innovation: ['innovation', 'rd', 'research', 'product', 'technology'],
}

/**
 * Detect topics from text using rule-based keyword matching.
 * Returns empty array for null/undefined or empty text.
 */
export function detectTopicsRuleBased(text: string | null | undefined): string[] {
  if (text == null || typeof text !== 'string') return []
  const t = text.trim().toLowerCase()
  if (!t) return []

  const found = new Set<string>()
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => t.includes(kw.toLowerCase()))) {
      found.add(topic)
    }
  }
  return Array.from(found)
}

/**
 * Optional lightweight embeddings fallback. MVP: delegates to rule-based.
 * indexMap can map embedding indices to topic names for future use.
 */
export function applyLightweightEmbeddings(
  text: string | null | undefined,
  _indexMap?: Record<number, string>
): string[] {
  return detectTopicsRuleBased(text)
}

/**
 * Classify topics for a narrative event. Always returns array (possibly empty).
 */
export function classifyTopics(
  event: { rawText?: string | null } | null | undefined
): string[] {
  if (!event) return []
  const text = event?.rawText ?? ''
  return detectTopicsRuleBased(text)
}
