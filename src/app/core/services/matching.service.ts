import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Profile, ProfileFilter } from '../../shared/models/profile.model';
import { Property } from '../../shared/models/property.model';
import { PagedResponse } from '../../shared/models/user.model';

export interface CompatibilityScore {
  userId1: number;
  userId2: number;
  score: number;
  details?: Record<string, number>;
}

/**
 * Facade over ApiService for roommate matching/discovery.
 *
 * The previous /matches/* endpoints do not exist in the real backend.
 * This service maps the old method signatures to the real backend endpoints:
 *   - getRoommateMatches() → GET /profiles/recommendations
 *   - getPropertyMatches() → GET /properties
 *   - getCompatibilityScore() → not available; returns a placeholder
 */
@Injectable({ providedIn: 'root' })
export class MatchingService {
  private api = inject(ApiService);

  /**
   * Legacy method: getRoommateMatches(userId) used by RoommatesListComponent and DashboardComponent.
   * Maps to GET /profiles/recommendations (userId param is kept for API compatibility but ignored).
   */
  getRoommateMatches(_userId: number, filter: ProfileFilter = {}): Observable<Profile[]> {
    return this.api.getRecommendations({ ...filter, size: 50 }).pipe(
      map((res) => (Array.isArray(res) ? res : (res as PagedResponse<Profile>).content ?? []))
    );
  }

  /** GET /profiles/recommendations — paged */
  getRecommendations(filter: ProfileFilter = {}): Observable<PagedResponse<Profile>> {
    return this.api.getRecommendations(filter);
  }

  /**
   * Legacy method: getPropertyMatches(userId) used by DashboardComponent.
   * Maps to GET /properties.
   */
  getPropertyMatches(_userId: number): Observable<Property[]> {
    return this.api.getProperties({ size: 50 }).pipe(
      map((res) => (Array.isArray(res) ? res : (res as PagedResponse<Property>).content ?? []))
    );
  }

  /**
   * Legacy method: getCompatibilityScore(userId1, userId2) used by RoommateDetailComponent.
   * The real backend does not expose this endpoint.
   * Returns an Observable that errors immediately — callers should handle gracefully.
   */
  getCompatibilityScore(_userId1: number, _userId2: number): Observable<CompatibilityScore> {
    return new Observable<CompatibilityScore>((subscriber) => {
      subscriber.error({ status: 404, displayMessage: 'Compatibility score not available' });
    });
  }
}
