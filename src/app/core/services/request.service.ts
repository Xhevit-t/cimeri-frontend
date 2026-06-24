import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  ContactRequest,
  ContactRequestCreate,
  ContactInfo,
  RequestCounts
} from '../../shared/models/request.model';
import { PagedResponse } from '../../shared/models/user.model';

/**
 * Facade over ApiService for contact request operations.
 * Maps legacy method signatures to the real backend API endpoints.
 *
 * Backend paths:
 *   POST /contact-requests
 *   POST /contact-requests/{id}/accept
 *   POST /contact-requests/{id}/reject
 *   GET  /contact-requests/inbox
 *   GET  /contact-requests/outbox
 *   GET  /contact-requests/counts
 *
 * NOTE: The old /requests/* paths do not exist in the backend.
 */
@Injectable({ providedIn: 'root' })
export class RequestService {
  private api = inject(ApiService);

  /**
   * Legacy method: sendRequest({ recipientId, message }) used by RoommateDetailComponent.
   * Maps to POST /contact-requests.
   */
  sendRequest(payload: { recipientId?: number; targetId?: number; targetType?: string; reason?: string; description?: string; message?: string }): Observable<ContactRequest> {
    const mapped: ContactRequestCreate = {
      targetType: (payload.targetType as 'USER' | 'PROPERTY') ?? 'USER',
      targetId: payload.targetId ?? payload.recipientId ?? 0,
      reason: payload.reason,
      description: payload.description ?? payload.message
    };
    return this.api.createContactRequest(mapped);
  }

  /** POST /contact-requests */
  createContactRequest(data: ContactRequestCreate): Observable<ContactRequest> {
    return this.api.createContactRequest(data);
  }

  /**
   * Legacy method: getIncoming() used by RequestsComponent and DashboardComponent.
   * Maps to GET /contact-requests/inbox (returns content array).
   */
  getIncoming(): Observable<ContactRequest[]> {
    return this.api.getContactRequestInbox(0, 50).pipe(
      map((res) => (Array.isArray(res) ? res : (res as PagedResponse<ContactRequest>).content ?? []))
    );
  }

  /** GET /contact-requests/inbox — returns paged response */
  getInbox(page = 0, size = 10): Observable<PagedResponse<ContactRequest>> {
    return this.api.getContactRequestInbox(page, size);
  }

  /**
   * Legacy method: getOutgoing() used by RequestsComponent.
   * Maps to GET /contact-requests/outbox (returns content array).
   */
  getOutgoing(): Observable<ContactRequest[]> {
    return this.api.getContactRequestOutbox(0, 50).pipe(
      map((res) => (Array.isArray(res) ? res : (res as PagedResponse<ContactRequest>).content ?? []))
    );
  }

  /** GET /contact-requests/outbox — returns paged response */
  getOutbox(page = 0, size = 10): Observable<PagedResponse<ContactRequest>> {
    return this.api.getContactRequestOutbox(page, size);
  }

  /**
   * GET /contact-requests/counts
   * The backend returns { pendingInbox, pendingOutbox }. The dashboard badge
   * tracks incoming requests awaiting my response → pendingInbox. Fallbacks keep
   * it working if the shape changes.
   */
  getCounts(): Observable<RequestCounts> {
    return this.api.getContactRequestCounts().pipe(
      map((raw) => {
        const r = (raw ?? {}) as Record<string, number>;
        return {
          pending: r['pendingInbox'] ?? r['PENDING'] ?? r['pending'] ?? 0,
          accepted: r['accepted'] ?? r['ACCEPTED'] ?? 0,
          rejected: r['rejected'] ?? r['REJECTED'] ?? 0
        };
      })
    );
  }

  /**
   * Legacy method: acceptRequest(id) used by RequestsComponent.
   * Maps to POST /contact-requests/{id}/accept.
   */
  acceptRequest(id: number): Observable<ContactRequest> {
    return this.api.acceptContactRequest(id);
  }

  /**
   * Legacy method: rejectRequest(id) used by RequestsComponent.
   * Maps to POST /contact-requests/{id}/reject.
   */
  rejectRequest(id: number): Observable<ContactRequest> {
    return this.api.rejectContactRequest(id);
  }

  /**
   * Legacy method: getContactInfo(id) used by RequestsComponent.
   * The new backend does not expose a /contact-info endpoint.
   * Returns an Observable that errors with 404 — callers should handle gracefully.
   */
  getContactInfo(_id: number): Observable<ContactInfo> {
    // The real backend does not have this endpoint.
    // Contact info is embedded in the ContactRequest itself via senderName/senderEmail.
    // Returning empty observable to avoid breaking the component.
    return new Observable<ContactInfo>((subscriber) => {
      subscriber.error({ status: 404, displayMessage: 'Contact info not available' });
    });
  }

  /**
   * Legacy method: deleteRequest(id) used by RequestsComponent.
   * The backend does not expose a delete endpoint for contact requests.
   * Returns an Observable that completes immediately — callers should handle gracefully.
   */
  deleteRequest(_id: number): Observable<void> {
    return new Observable<void>((subscriber) => {
      subscriber.error({ status: 404, displayMessage: 'Delete not supported by the server' });
    });
  }
}
