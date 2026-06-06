import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Translation Service for Dashboard
 * 
 * Manages i18n for the Dashboard using @ngx-translate/core.
 * Provides language switching, current language state, and RTL support.
 * 
 * Supported languages: English (en), Arabic (ar)
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<'en' | 'ar'>('en');
  private readonly STORAGE_KEY = 'dashboard_language';
  private readonly SUPPORTED_LANGUAGES = ['en', 'ar'];

  constructor(private translate: TranslateService) {
    this.initializeTranslations();
  }

  /**
   * Initialize translations and set default language
   */
  private initializeTranslations(): void {
    // Set default language
    this.translate.setDefaultLanguage('en');
    
    // Add supported languages
    this.translate.addLanguages(this.SUPPORTED_LANGUAGES);

    // Load saved language from localStorage or use browser language
    const savedLanguage = this.getSavedLanguage();
    const browserLanguage = this.getBrowserLanguage();
    const initialLanguage = (savedLanguage || browserLanguage) as 'en' | 'ar';

    this.setLanguage(initialLanguage);
  }

  /**
   * Get saved language from localStorage
   */
  private getSavedLanguage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.STORAGE_KEY);
    }
    return null;
  }

  /**
   * Get browser default language
   */
  private getBrowserLanguage(): 'en' | 'ar' {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.toLowerCase() || 'en';
      return browserLang.startsWith('ar') ? 'ar' : 'en';
    }
    return 'en';
  }

  /**
   * Set the active language
   */
  setLanguage(language: 'en' | 'ar'): void {
    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      console.warn(`Language ${language} is not supported`);
      return;
    }

    this.translate.use(language);
    this.currentLanguage$.next(language);

    // Save language preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, language);
    }

    // Update HTML dir attribute for RTL support
    this.updateDocumentDirection(language);
  }

  /**
   * Get current language as Observable
   */
  getCurrentLanguage$(): Observable<'en' | 'ar'> {
    return this.currentLanguage$.asObservable();
  }

  /**
   * Get current language (synchronous)
   */
  getCurrentLanguage(): 'en' | 'ar' {
    return this.currentLanguage$.value;
  }

  /**
   * Check if current language is RTL (Arabic)
   */
  isRTL(): boolean {
    return this.currentLanguage$.value === 'ar';
  }

  /**
   * Get direction for language (ltr or rtl)
   */
  getDirection(): 'ltr' | 'rtl' {
    return this.isRTL() ? 'rtl' : 'ltr';
  }

  /**
   * Toggle between English and Arabic
   */
  toggleLanguage(): void {
    const nextLanguage = this.isRTL() ? 'en' : 'ar';
    this.setLanguage(nextLanguage);
  }

  /**
   * Update HTML document direction attribute
   */
  private updateDocumentDirection(language: 'en' | 'ar'): void {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      htmlElement.setAttribute('dir', dir);
      htmlElement.setAttribute('lang', language);
    }
  }

  /**
   * Translate a key with parameters
   */
  translate(key: string, params?: any): Observable<string> {
    return this.translate.get(key, params);
  }

  /**
   * Instant translate a key (synchronous)
   */
  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }
}
