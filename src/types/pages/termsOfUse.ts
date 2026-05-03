import type { LocalizedText } from '../i18n'

export interface TermsOfUseSection {
  id: string
  title: LocalizedText
  paragraphs?: LocalizedText[]
  list?: LocalizedText[]
  contactInfo?: {
    email: string
    phone: string
    phoneTel: string
  }
}
