import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RequestService } from '../../core/services/request.service';
import { ContactRequest } from '../../shared/models/request.model';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit, OnDestroy {
  private requestSvc = inject(RequestService);
  private destroy$ = new Subject<void>();

  incoming: ContactRequest[] = [];
  outgoing: ContactRequest[] = [];

  incomingLoading = true;
  outgoingLoading = true;
  incomingError = '';
  outgoingError = '';

  activeTab: 'incoming' | 'outgoing' = 'incoming';

  /** Convenience getter used by the template */
  get loading(): boolean {
    return this.incomingLoading && this.outgoingLoading;
  }

  /** Convenience getter used by the template */
  get errorMessage(): string {
    return this.incomingError || this.outgoingError;
  }

  ngOnInit(): void {
    this.loadIncoming();
    this.loadOutgoing();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load inbox independently so an outbox failure does not kill it.
   * GET /contact-requests/inbox
   */
  private loadIncoming(): void {
    this.incomingLoading = true;
    this.incomingError = '';
    this.requestSvc.getIncoming()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.incoming = data ?? [];
          this.incomingLoading = false;
        },
        error: (err) => {
          this.incomingError = err?.displayMessage || 'Could not load incoming requests';
          this.incoming = [];
          this.incomingLoading = false;
        }
      });
  }

  /**
   * Load outbox independently so an inbox failure does not kill it.
   * GET /contact-requests/outbox
   */
  private loadOutgoing(): void {
    this.outgoingLoading = true;
    this.outgoingError = '';
    this.requestSvc.getOutgoing()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.outgoing = data ?? [];
          this.outgoingLoading = false;
        },
        error: (err) => {
          this.outgoingError = err?.displayMessage || 'Could not load outgoing requests';
          this.outgoing = [];
          this.outgoingLoading = false;
        }
      });
  }

  accept(req: ContactRequest): void {
    this.requestSvc.acceptRequest(req.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          req.status = updated?.status ?? 'ACCEPTED';
        },
        error: (err) => (this.incomingError = err?.displayMessage || 'Could not accept')
      });
  }

  reject(req: ContactRequest): void {
    this.requestSvc.rejectRequest(req.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          req.status = updated?.status ?? 'REJECTED';
        },
        error: (err) => (this.incomingError = err?.displayMessage || 'Could not reject')
      });
  }

  setTab(tab: 'incoming' | 'outgoing'): void {
    this.activeTab = tab;
  }

  getSenderName(req: ContactRequest): string {
    return req.senderName
      ?? req.reporterName
      ?? req.senderEmail
      ?? `User #${req.senderId ?? req.reporterId ?? '?'}`;
  }

  getRecipientName(req: ContactRequest): string {
    return req.recipientName ?? `User #${req.recipientId ?? req.targetId ?? '?'}`;
  }

  /** Collapse the backend's APPROVED (shared report DTO) onto ACCEPTED for display. */
  displayStatus(req: ContactRequest): 'PENDING' | 'ACCEPTED' | 'REJECTED' {
    return req.status === 'APPROVED' ? 'ACCEPTED' : (req.status as 'PENDING' | 'ACCEPTED' | 'REJECTED');
  }
}
