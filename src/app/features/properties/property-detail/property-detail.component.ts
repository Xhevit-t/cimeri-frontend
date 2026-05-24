import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property } from '../../../shared/models/property.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent implements OnInit {
  private propertySvc = inject(PropertyService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(TranslationService);

  @Input() id!: string;

  property: Property | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.propertySvc.getProperty(Number(this.id)).subscribe({
      next: (p) => {
        this.property = p;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.displayMessage || 'Could not load property';
      }
    });
  }

  delete(): void {
    if (!this.property) return;
    if (!confirm(this.i18n.t('pd.confirmDel'))) return;
    this.propertySvc.deleteProperty(this.property.id).subscribe({
      next: () => this.router.navigate(['/properties']),
      error: (err) => (this.errorMessage = err?.displayMessage || 'Delete failed')
    });
  }

  back(): void {
    this.router.navigate(['/properties']);
  }

  get isOwner(): boolean {
    const me = this.auth.getCurrentUser();
    return !!me && !!this.property && me.id === this.property.ownerId;
  }
}
