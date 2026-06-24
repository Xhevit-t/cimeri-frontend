import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Profile, ProfileUpsertRequest, ProfileFilter, ProfileCreateRequest } from '../../shared/models/profile.model';
import { PagedResponse } from '../../shared/models/user.model';

/**
 * Facade over ApiService for roommate profile operations.
 * Maps legacy method signatures used by existing components to the real backend API.
 *
 * Backend paths:
 *   GET    /profiles/me
 *   PUT    /profiles/me        (upsert)
 *   DELETE /profiles/me
 *   GET    /profiles/user/{userId}
 *   GET    /profiles/recommendations
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = inject(ApiService);

  /** GET /profiles/me */
  getMyProfile(): Observable<Profile> {
    return this.api.getMyProfile();
  }

  /**
   * Legacy method: getProfile(userId) used by ProfileViewComponent and RoommateDetailComponent.
   * Routes to GET /profiles/user/{userId}.
   */
  getProfile(userId: number): Observable<Profile> {
    return this.api.getProfileByUserId(userId);
  }

  /** GET /profiles/user/{userId} */
  getProfileByUserId(userId: number): Observable<Profile> {
    return this.api.getProfileByUserId(userId);
  }

  /**
   * Legacy method: createProfile() used by ProfileEditComponent.
   * The real backend uses PUT /profiles/me as an upsert — there is no separate create.
   */
  createProfile(data: ProfileCreateRequest): Observable<Profile> {
    return this.api.upsertMyProfile(this.mapLegacyFields(data));
  }

  /**
   * Legacy method: updateProfile(profileId, data) used by ProfileEditComponent.
   * profileId is ignored — the backend identifies the profile by the bearer token.
   */
  updateProfile(_profileId: number, data: Partial<ProfileCreateRequest>): Observable<Profile> {
    return this.api.upsertMyProfile(this.mapLegacyFields(data));
  }

  /** PUT /profiles/me */
  upsertProfile(data: ProfileUpsertRequest): Observable<Profile> {
    return this.api.upsertMyProfile(data);
  }

  /**
   * Legacy method: deleteProfile(profileId) used by ProfileViewComponent.
   * profileId is ignored — the backend identifies the profile by the bearer token.
   */
  deleteProfile(_profileId: number): Observable<void> {
    return this.api.deleteMyProfile();
  }

  /** DELETE /profiles/me */
  deleteMyProfile(): Observable<void> {
    return this.api.deleteMyProfile();
  }

  /** GET /profiles/recommendations */
  getRecommendations(filter: ProfileFilter = {}): Observable<PagedResponse<Profile>> {
    return this.api.getRecommendations(filter);
  }

  /**
   * Maps legacy ProfileCreateRequest fields (budgetMin/Max, housingType, cleanliness,
   * studyAtHome, movingDate) to the backend's ProfileUpsertRequest shape.
   */
  private mapLegacyFields(data: Partial<ProfileCreateRequest>): ProfileUpsertRequest {
    const mapped: ProfileUpsertRequest = {
      city: data.city ?? '',
      minBudget: data.minBudget ?? (data as any).budgetMin,
      maxBudget: data.maxBudget ?? (data as any).budgetMax,
      accommodationType: data.accommodationType ?? (data as any).housingType,
      lifestyle: data.lifestyle,
      earlyRiser: data.earlyRiser,
      clean: data.clean ?? (data as any).cleanliness,
      studiesAtHome: data.studiesAtHome ?? (data as any).studyAtHome,
      smoker: data.smoker,
      petFriendly: data.petFriendly,
      moveInDate: data.moveInDate ?? (data as any).movingDate,
      bio: data.bio,
      publicProfile: data.publicProfile,
      visibleInRecommendations: data.visibleInRecommendations
    };
    // Remove undefined keys so they don't overwrite existing backend values
    Object.keys(mapped).forEach((k) => {
      if ((mapped as any)[k] === undefined) delete (mapped as any)[k];
    });
    return mapped;
  }
}
