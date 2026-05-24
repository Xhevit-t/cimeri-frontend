import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../core/services/request.service';
import { ContactInfo, ContactRequest } from '../../shared/models/request.model';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  private requests = inject(RequestService);
  private i18n = inject(TranslationService);

  incoming: ContactRequest[] = [];
  outgoing: ContactRequest[] = [];
  contactInfoMap: Record<number, ContactInfo> = {};
  loading = true;
  activeTab: 'incoming' | 'outgoing' = 'incoming';
  errorMessage = '';

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.requests.getIncoming().subscribe({
      next: (data) => {
        this.incoming = data ?? [];
        this.requests.getOutgoing().subscribe({
          next: (out) => {
            this.outgoing = out ?? [];
            this.loading = false;
          },
          error: () => {
            this.outgoing = [];
            this.loading = false;
          }
        });
      },
      error: () => {
        this.incoming = [];
        this.outgoing = [];
        this.loading = false;
      }
    });
  }

  accept(req: ContactRequest): void {
    this.requests.acceptRequest(req.id).subscribe({
      next: () => {
        req.status = 'ACCEPTED';
        this.fetchContactInfo(req.id);
      },
      error: (err) => (this.errorMessage = err?.displayMessage || 'Could not accept')
    });
  }

  reject(req: ContactRequest): void {
    this.requests.rejectRequest(req.id).subscribe({
      next: () => (req.status = 'REJECTED'),
      error: (err) => (this.errorMessage = err?.displayMessage || 'Could not reject')
    });
  }

  fetchContactInfo(id: number): void {
    this.requests.getContactInfo(id).subscribe({
      next: (info) => (this.contactInfoMap[id] = info),
      error: () => {}
    });
  }

  delete(req: ContactRequest): void {
    if (!confirm(this.i18n.t('rq.confirmDel'))) return;
    this.requests.deleteRequest(req.id).subscribe({
      next: () => {
        this.incoming = this.incoming.filter((r) => r.id !== req.id);
        this.outgoing = this.outgoing.filter((r) => r.id !== req.id);
      },
      error: (err) => (this.errorMessage = err?.displayMessage || 'Could not delete')
    });
  }

  setTab(tab: 'incoming' | 'outgoing'): void {
    this.activeTab = tab;
  }
}
