import type { LocalizedText } from '../i18n'

export interface PrivacyStatementSection {
  id: string
  title: LocalizedText
  paragraphs?: LocalizedText[]
  list?: LocalizedText[]
  types?: {
    id: string
    label: LocalizedText
    text: LocalizedText
  }[]
  contactNote?: LocalizedText
  contactInfo?: {
    email: string
    phone: string
    phoneTel: string
    address: LocalizedText
  }
}
