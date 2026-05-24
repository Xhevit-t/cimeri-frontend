import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Lang, TRANSLATIONS } from './translations';

const LANG_KEY = 'flatbuddy_lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly current = signal<Lang>(this.loadLang());

  setLang(lang: Lang): void {
    this.current.set(lang);
    if (this.isBrowser) {
      try { localStorage.setItem(LANG_KEY, lang); } catch {}
      document.documentElement.setAttribute('lang', lang);
    }
  }

  t(key: string): string {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[this.current()] ?? entry.mk ?? key;
  }

  private loadLang(): Lang {
    if (!this.isBrowser) return 'mk';
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved === 'mk' || saved === 'en' || saved === 'sq') return saved;
    } catch {}
    return 'mk';
  }
}
