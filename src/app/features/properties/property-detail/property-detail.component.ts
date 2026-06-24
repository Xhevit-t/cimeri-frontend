import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class PropertyDetailComponent implements OnInit, OnDestroy {
  private propertySvc = inject(PropertyService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(TranslationService);
  private destroy$ = new Subject<void>();

  @Input() id!: string;

  property: Property | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.propertySvc.getProperty(Number(this.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p) => {
          this.property = this.normalize(p);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.displayMessage || 'Could not load property';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  delete(): void {
    if (!this.property) return;
    if (!confirm(this.i18n.t('pd.confirmDel'))) return;
    this.propertySvc.deleteProperty(this.property.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  /** Normalize backend field names to legacy aliases used by the template */
  private normalize(p: Property): Property {
    return {
      ...p,
      price: p.price ?? p.monthlyPrice,
      rooms: p.rooms ?? p.numberOfRooms,
      bathrooms: p.bathrooms ?? p.numberOfBathrooms,
      type: p.type ?? (p.accommodationType as any),
      wifi: p.wifi ?? p.internet,
      petFriendly: p.petFriendly ?? p.petsAllowed,
      isActive: p.isActive ?? p.active
    };
  }
}
