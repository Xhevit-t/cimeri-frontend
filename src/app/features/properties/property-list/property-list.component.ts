import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../shared/models/property.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent implements OnInit {
  private propertySvc = inject(PropertyService);

  properties: Property[] = [];
  filtered: Property[] = [];
  loading = true;

  searchCity = '';
  filterType = '';
  filterMaxPrice?: number;
  filterRooms?: number;

  types = ['APARTMENT', 'HOUSE', 'STUDIO', 'ROOM'];

  ngOnInit(): void {
    this.propertySvc.getProperties().subscribe({
      next: (data) => {
        this.properties = data ?? [];
        this.filtered = [...this.properties];
        this.loading = false;
      },
      error: () => {
        this.properties = [];
        this.filtered = [];
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filtered = this.properties.filter((p) => {
      if (this.searchCity && !p.city?.toLowerCase().includes(this.searchCity.toLowerCase())) return false;
      if (this.filterType && p.type !== this.filterType) return false;
      if (this.filterMaxPrice && p.price > this.filterMaxPrice) return false;
      if (this.filterRooms && p.rooms < this.filterRooms) return false;
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
