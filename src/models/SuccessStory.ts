export interface SuccessStoryMetric {
  value: string
  label: string
}

export interface SuccessStory {
  /** Optional short expansion of the portfolio acronym / name. */
  fullName?: string | null
  /** Optional one-to-two sentence editorial description of the portfolio. */
  description?: string | null
  /** Optional list of capability/value items shown in "What X Enables". */
  capabilities?: string[]
  summary: string
  challenge: string | null
  solution: string | null
  impact: string | null
  metrics?: SuccessStoryMetric[]
}
