import type { LocalizedText } from '../i18n'

export interface AboutUsContentItem {
  type: string
  ar: string
  en: string
}

export interface AboutUsSection {
  id: string
  title: LocalizedText
  content?: AboutUsContentItem[]
  lead?: LocalizedText
  timeline?: LocalizedText[]
}
