import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../core/services/report.service';
import { Report, ReportStatus } from '../../shared/models/report.model';
import { PagedResponse } from '../../shared/models/user.model';

@Component({
  selector: 'app-moderator',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './moderator.component.html',
  styleUrl: './moderator.component.css'
})
export class ModeratorComponent implements OnInit, OnDestroy {
  private reportSvc = inject(ReportService);
  private destroy$ = new Subject<void>();

  reports: Report[] = [];
  loading = true;
  errorMessage = '';
  actionMessage = '';

  filterStatus: ReportStatus | '' = 'PENDING';
  page = 0;
  pageSize = 10;
  totalReports = 0;

  moderatorNotes = '';
  processingId: number | null = null;

  ngOnInit(): void {
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReports(): void {
    this.loading = true;
    this.errorMessage = '';
    this.reportSvc.getModeratorReports(
      this.filterStatus || undefined,
      this.page,
      this.pageSize
    ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: PagedResponse<Report>) => {
          this.reports = res.content ?? [];
          this.totalReports = res.totalElements ?? 0;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err?.displayMessage || 'Could not load reports';
          this.loading = false;
        }
      });
  }

  approve(report: Report): void {
    this.process(report, 'APPROVED');
  }

  reject(report: Report): void {
    this.process(report, 'REJECTED');
  }

  private process(report: Report, status: ReportStatus): void {
    this.processingId = report.id;
    this.actionMessage = '';
    this.reportSvc.updateReportStatus(report.id, { status, moderatorNotes: this.moderatorNotes })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          report.status = updated.status;
          report.moderatorNotes = updated.moderatorNotes;
          this.processingId = null;
          this.moderatorNotes = '';
          this.actionMessage = `Report #${report.id} marked as ${status}.`;
        },
        error: (err) => {
          this.processingId = null;
          this.actionMessage = err?.displayMessage || 'Action failed';
        }
      });
  }

  onFilterChange(): void {
    this.page = 0;
    this.loadReports();
  }

  nextPage(): void {
    this.page++;
    this.loadReports();
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadReports();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalReports / this.pageSize);
  }
}
