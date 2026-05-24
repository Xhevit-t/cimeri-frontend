import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/i18n/translation.service';
import { Lang, LANGS } from '../../../core/i18n/translations';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.css'
})
export class LangSwitcherComponent {
  i18n = inject(TranslationService);
  private host = inject(ElementRef);

  open = false;
  readonly langs = LANGS;

  toggle(): void {
    this.open = !this.open;
  }

  select(lang: Lang): void {
    this.i18n.setLang(lang);
    this.open = false;
  }

  get currentLang() {
    const code = this.i18n.current();
    return this.langs.find((l) => l.code === code) ?? this.langs[0];
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.host.nativeElement.contains(e.target)) {
      this.open = false;
    }
  }
}
