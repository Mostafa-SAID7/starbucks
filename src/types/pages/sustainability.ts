import type { LocalizedText } from '../common'

export interface SustainabilityContentItem {
  ar: string
  en: string
}

export interface SustainabilitySection {
  id: string
  title: LocalizedText
  subtitle?: LocalizedText
  image: string
  fallbackImage?: string
  content?: SustainabilityContentItem | SustainabilityContentItem[]
  subHeading?: LocalizedText
  subContent?: LocalizedText
  cta?: LocalizedText
  ctaLink?: string
  tipsTitle?: LocalizedText
  tips?: LocalizedText[]
  note?: LocalizedText
  link?: string
}
