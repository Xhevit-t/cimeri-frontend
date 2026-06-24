import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.css'
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private propertySvc = inject(PropertyService);
  private router = inject(Router);

  @Input() id?: string;

  isCreate = false;
  loading = false;
  saving = false;
  errorMessage = '';

  // All cities of North Macedonia (Latin, diacritic-free), alphabetical.
  cities = [
    'Berovo', 'Bitola', 'Bogdanci', 'Debar', 'Delcevo', 'Demir Hisar', 'Demir Kapija',
    'Gevgelija', 'Gostivar', 'Kavadarci', 'Kicevo', 'Kocani', 'Kratovo', 'Kriva Palanka',
    'Krusevo', 'Kumanovo', 'Makedonska Kamenica', 'Makedonski Brod', 'Negotino', 'Ohrid',
    'Pehcevo', 'Prilep', 'Probistip', 'Radovis', 'Resen', 'Skopje', 'Struga', 'Strumica',
    'Sveti Nikole', 'Tetovo', 'Valandovo', 'Veles', 'Vinica', 'Stip'
  ];
  // Backend accommodation enum — 'HOUSE'/'ROOM' don't exist server-side and
  // would be silently coerced, so only the real values are offered here.
  types = ['APARTMENT', 'PRIVATE_ROOM', 'STUDIO'];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', Validators.required],
    address: ['', Validators.required],
    price: [300, [Validators.required, Validators.min(0)]],
    type: ['APARTMENT', Validators.required],
    rooms: [1, [Validators.required, Validators.min(1)]],
    bathrooms: [1, [Validators.required, Validators.min(1)]],
    furnished: [false],
    wifi: [true],
    parking: [false],
    petFriendly: [false],
    availableFrom: ['', Validators.required]
  });

  ngOnInit(): void {
    this.isCreate = !this.id || this.id === 'new';
    if (this.isCreate) return;

    this.loading = true;
    this.propertySvc.getProperty(Number(this.id)).subscribe({
      next: (p) => {
        // The backend returns monthlyPrice/accommodationType/numberOfRooms/etc.;
        // fall back to those so editing pre-fills correctly (?? mirrors
        // PropertyDetailComponent.normalize).
        this.form.patchValue({
          title: p.title,
          description: p.description,
          city: p.city,
          address: p.address,
          price: p.price ?? p.monthlyPrice,
          type: p.type ?? p.accommodationType,
          rooms: p.rooms ?? p.numberOfRooms,
          bathrooms: p.bathrooms ?? p.numberOfBathrooms,
          furnished: p.furnished,
          wifi: p.wifi ?? p.internet,
          parking: p.parking,
          petFriendly: p.petFriendly ?? p.petsAllowed,
          availableFrom: p.availableFrom
        });
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.errorMessage = '';
    const data: any = this.form.getRawValue();

    const obs = this.isCreate
      ? this.propertySvc.createProperty(data)
      : this.propertySvc.updateProperty(Number(this.id), data);

    obs.subscribe({
      next: (p) => {
        this.saving = false;
        this.router.navigate(['/property', p.id]);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.displayMessage || 'Save failed';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/properties']);
  }

  hasError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.touched && c.hasError(error));
  }
}
