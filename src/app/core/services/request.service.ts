import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactInfo, ContactRequest, ContactRequestCreate } from '../../shared/models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/requests`;

  sendRequest(payload: ContactRequestCreate): Observable<ContactRequest> {
    return this.http.post<ContactRequest>(`${this.base}/send`, payload);
  }

  getIncoming(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(`${this.base}/incoming`);
  }

  getOutgoing(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(`${this.base}/outgoing`);
  }

  acceptRequest(id: number): Observable<ContactRequest> {
    return this.http.put<ContactRequest>(`${this.base}/${id}/accept`, {});
  }

  rejectRequest(id: number): Observable<ContactRequest> {
    return this.http.put<ContactRequest>(`${this.base}/${id}/reject`, {});
  }

  getContactInfo(id: number): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(`${this.base}/${id}/contact-info`);
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
