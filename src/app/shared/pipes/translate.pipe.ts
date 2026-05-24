import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/i18n/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(TranslationService);

  transform(key: string): string {
    // touch the signal so the pipe re-runs when language changes
    this.i18n.current();
    return this.i18n.t(key);
  }
}
