import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Property, PropertyCreateRequest } from '../../shared/models/property.model';

export interface PropertyFilter {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  rooms?: number;
  furnished?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/properties`;

  getProperties(filter: PropertyFilter = {}): Observable<Property[]> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<Property[]>(this.base, { params });
  }

  getProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.base}/${id}`);
  }

  createProperty(payload: PropertyCreateRequest): Observable<Property> {
    return this.http.post<Property>(this.base, payload);
  }

  updateProperty(id: number, payload: Partial<PropertyCreateRequest>): Observable<Property> {
    return this.http.put<Property>(`${this.base}/${id}`, payload);
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getMyProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.base}/mine`);
  }
}
