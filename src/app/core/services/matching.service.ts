import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile } from '../../shared/models/profile.model';
import { Property } from '../../shared/models/property.model';

export interface CompatibilityScore {
  userId1: number;
  userId2: number;
  score: number;
  details?: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/matches`;

  getRoommateMatches(userId: number): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.base}/roommates`, { params: { userId } });
  }

  getPropertyMatches(userId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.base}/properties`, { params: { userId } });
  }

  getCompatibilityScore(userId1: number, userId2: number): Observable<CompatibilityScore> {
    return this.http.get<CompatibilityScore>(`${this.base}/compatibility/${userId1}/${userId2}`);
  }
}
