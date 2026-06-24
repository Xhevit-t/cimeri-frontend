import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Property, PropertyCreateRequest, PropertyFilter } from '../../shared/models/property.model';
import { PagedResponse } from '../../shared/models/user.model';

export type { PropertyFilter };

/**
 * Facade over ApiService for property operations.
 * Maps legacy method signatures used by existing components to the real backend API.
 *
 * Backend paths:
 *   GET    /properties
 *   POST   /properties
 *   GET    /properties/{id}
 *   PUT    /properties/{id}
 *   DELETE /properties/{id}
 *   PATCH  /properties/{id}/active
 *   GET    /properties/owner/{ownerId}
 */
@Injectable({ providedIn: 'root' })
export class PropertyService {
  private api = inject(ApiService);

  /**
   * Legacy method: getProperties(filter) used by PropertyListComponent.
   * Returns the content array for backward compatibility.
   */
  getProperties(filter: PropertyFilter = {}): Observable<Property[]> {
    return this.api.getProperties(filter).pipe(
      map((res) => (Array.isArray(res) ? res : (res as PagedResponse<Property>).content ?? []))
    );
  }

  /** GET /properties — returns paged response */
  getPropertiesPaged(filter: PropertyFilter = {}): Observable<PagedResponse<Property>> {
    return this.api.getProperties(filter);
  }

  /**
   * Legacy method: getProperty(id) used by PropertyDetailComponent and PropertyFormComponent.
   */
  getProperty(id: number): Observable<Property> {
    return this.api.getPropertyById(id);
  }

  /** GET /properties/{id} */
  getPropertyById(id: number): Observable<Property> {
    return this.api.getPropertyById(id);
  }

  /**
   * Maps legacy PropertyCreateRequest fields to the real backend shape and
   * calls POST /properties.
   */
  createProperty(data: PropertyCreateRequest): Observable<Property> {
    return this.api.createProperty(this.mapLegacyFields(data) as PropertyCreateRequest);
  }

  /**
   * Maps legacy fields and calls PUT /properties/{id}.
   */
  updateProperty(id: number, data: Partial<PropertyCreateRequest>): Observable<Property> {
    return this.api.updateProperty(id, this.mapLegacyFields(data));
  }

  /** DELETE /properties/{id} */
  deleteProperty(id: number): Observable<void> {
    return this.api.deleteProperty(id);
  }

  /** PATCH /properties/{id}/active */
  setPropertyActive(id: number, value: boolean): Observable<Property> {
    return this.api.setPropertyActive(id, value);
  }

  /**
   * Legacy method: getMyProperties() used by DashboardComponent.
   * The backend uses GET /properties/owner/{ownerId}.
   * This method requires the current user — call getPropertiesByOwner(userId) instead
   * when you have the user id available.
   */
  getMyProperties(ownerId: number): Observable<Property[]> {
    return this.api.getPropertiesByOwner(ownerId);
  }

  /** GET /properties/owner/{ownerId} */
  getPropertiesByOwner(ownerId: number): Observable<Property[]> {
    return this.api.getPropertiesByOwner(ownerId);
  }

  /**
   * Maps legacy PropertyCreateRequest fields (price, type, rooms, bathrooms, wifi,
   * petFriendly) to the backend's shape (monthlyPrice, accommodationType, etc.).
   */
  private mapLegacyFields(data: Partial<PropertyCreateRequest>): Partial<PropertyCreateRequest> {
    const mapped: any = { ...data };

    // Map legacy price → monthlyPrice
    if (!mapped.monthlyPrice && mapped.price !== undefined) {
      mapped.monthlyPrice = mapped.price;
    }

    // Map legacy type → accommodationType (only if it's a valid backend value)
    if (!mapped.accommodationType && mapped.type) {
      // 'HOUSE' and 'ROOM' have no backend equivalent — use APARTMENT as fallback
      const typeMap: Record<string, string> = {
        APARTMENT: 'APARTMENT',
        STUDIO: 'STUDIO',
        PRIVATE_ROOM: 'PRIVATE_ROOM',
        HOUSE: 'APARTMENT',
        ROOM: 'PRIVATE_ROOM'
      };
      mapped.accommodationType = typeMap[mapped.type] ?? 'APARTMENT';
    }

    // Map legacy rooms → numberOfRooms
    if (!mapped.numberOfRooms && mapped.rooms !== undefined) {
      mapped.numberOfRooms = mapped.rooms;
    }

    // Map legacy bathrooms → numberOfBathrooms
    if (!mapped.numberOfBathrooms && mapped.bathrooms !== undefined) {
      mapped.numberOfBathrooms = mapped.bathrooms;
    }

    // Map legacy wifi → internet
    if (!mapped.internet && mapped.wifi !== undefined) {
      mapped.internet = mapped.wifi;
    }

    // Map legacy petFriendly → petsAllowed
    if (!mapped.petsAllowed && mapped.petFriendly !== undefined) {
      mapped.petsAllowed = mapped.petFriendly;
    }

    return mapped;
  }
}
