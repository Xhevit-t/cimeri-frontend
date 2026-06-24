import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property } from '../../../shared/models/property.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent implements OnInit, OnDestroy {
  private propertySvc = inject(PropertyService);
  auth = inject(AuthService);
  private destroy$ = new Subject<void>();

  properties: Property[] = [];
  filtered: Property[] = [];
  loading = true;
  errorMessage = '';

  searchCity = '';
  filterType = '';
  filterMaxPrice?: number;
  filterRooms?: number;

  types = ['APARTMENT', 'PRIVATE_ROOM', 'STUDIO'];

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    // GET /properties — returns PagedResponse<Property>
    this.propertySvc.getProperties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.properties = data ?? [];
          this.filtered = [...this.properties];
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err?.displayMessage || 'Could not load properties';
          this.properties = [];
          this.filtered = [];
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.filtered = this.properties.filter((p) => {
      const city = p.city ?? '';
      if (this.searchCity && !city.toLowerCase().includes(this.searchCity.toLowerCase())) return false;
      const type = p.accommodationType ?? p.type ?? '';
      if (this.filterType && type !== this.filterType) return false;
      const price = p.monthlyPrice ?? p.price ?? 0;
      if (this.filterMaxPrice && price > this.filterMaxPrice) return false;
      const rooms = p.numberOfRooms ?? p.rooms ?? 0;
      if (this.filterRooms && rooms < this.filterRooms) return false;
      return true;
    });
  }

  clear(): void {
    this.searchCity = '';
    this.filterType = '';
    this.filterMaxPrice = undefined;
    this.filterRooms = undefined;
    this.filtered = [...this.properties];
  }
}
