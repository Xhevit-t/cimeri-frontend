import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, ProfileCreateRequest } from '../../shared/models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/profile`;

  getProfile(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.base}/${userId}`);
  }

  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.base}/me`);
  }

  createProfile(profile: ProfileCreateRequest): Observable<Profile> {
    return this.http.post<Profile>(`${this.base}/create`, profile);
  }

  updateProfile(profileId: number, profile: Partial<ProfileCreateRequest>): Observable<Profile> {
    return this.http.put<Profile>(`${this.base}/update/${profileId}`, profile);
  }

  deleteProfile(profileId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${profileId}`);
  }
}
