import type { LocalizedText } from '../common'

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
