import type { LocalizedText } from '../common'

export interface CookieContentSection {
  id: string
  title: LocalizedText
  paragraphs?: LocalizedText[]
  definitions?: { term: LocalizedText; definition: LocalizedText }[]
  groups?: { title: LocalizedText; paragraphs: LocalizedText[] }[]
  list?: (LocalizedText & { link?: string })[]
}
