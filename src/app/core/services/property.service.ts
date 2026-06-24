import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Property, PropertyCreateRequest, PropertyFilter, PropertyType } from '../../shared/models/property.model';
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
   * Builds a clean backend payload from a mix of legacy and backend field names.
   *
   * Critically, this strips legacy-only keys (price, type, rooms, bathrooms, wifi,
   * petFriendly) and guarantees `accommodationType` is one of the backend enum
   * values. The backend returns HTTP 500 (not 400) for an unknown enum value, so
   * a stray 'HOUSE'/'ROOM' leaking through would surface to the user as
   * "Server error — please try again later". Only fields that are actually present
   * are included, so partial updates stay partial.
   */
  private mapLegacyFields(data: Partial<PropertyCreateRequest>): Partial<PropertyCreateRequest> {
    const src = data as any;
    const out: any = {};

    // Already-correct backend fields — pass through when present.
    for (const key of ['title', 'description', 'city', 'address', 'furnished', 'parking', 'availableFrom', 'imageUrls']) {
      if (src[key] !== undefined) out[key] = src[key];
    }

    // monthlyPrice ← monthlyPrice | legacy price
    const price = src.monthlyPrice ?? src.price;
    if (price !== undefined) out.monthlyPrice = price;

    // accommodationType ← accommodationType | legacy type, coerced to a valid enum.
    // 'HOUSE' and 'ROOM' have no backend equivalent — map them; anything else
    // unknown falls back to APARTMENT so we never POST an invalid enum (→ 500).
    const rawType = src.accommodationType ?? src.type;
    if (rawType !== undefined) {
      const typeMap: Record<string, PropertyType> = {
        APARTMENT: 'APARTMENT',
        STUDIO: 'STUDIO',
        PRIVATE_ROOM: 'PRIVATE_ROOM',
        HOUSE: 'APARTMENT',
        ROOM: 'PRIVATE_ROOM'
      };
      out.accommodationType = typeMap[rawType] ?? 'APARTMENT';
    }

    // numberOfRooms ← numberOfRooms | legacy rooms
    const rooms = src.numberOfRooms ?? src.rooms;
    if (rooms !== undefined) out.numberOfRooms = rooms;

    // numberOfBathrooms ← numberOfBathrooms | legacy bathrooms
    const bathrooms = src.numberOfBathrooms ?? src.bathrooms;
    if (bathrooms !== undefined) out.numberOfBathrooms = bathrooms;

    // internet ← internet | legacy wifi
    const internet = src.internet ?? src.wifi;
    if (internet !== undefined) out.internet = internet;

    // petsAllowed ← petsAllowed | legacy petFriendly
    const petsAllowed = src.petsAllowed ?? src.petFriendly;
    if (petsAllowed !== undefined) out.petsAllowed = petsAllowed;

    return out;
  }
}
