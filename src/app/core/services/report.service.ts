import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Report, ReportCreate, ModeratorReportUpdate, ReportStatus } from '../../shared/models/report.model';
import { PagedResponse } from '../../shared/models/user.model';

/**
 * Report and moderation operations.
 *
 * Backend paths:
 *   POST  /reports
 *   GET   /moderator/reports
 *   PATCH /moderator/reports/{id}
 */
@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = inject(ApiService);

  /** POST /reports */
  createReport(data: ReportCreate): Observable<Report> {
    return this.api.createReport(data);
  }

  /** GET /moderator/reports (MODERATOR or ADMIN only) */
  getModeratorReports(status?: ReportStatus, page = 0, size = 10): Observable<PagedResponse<Report>> {
    return this.api.getModeratorReports(status, page, size);
  }

  /** PATCH /moderator/reports/{id} (MODERATOR or ADMIN only) */
  updateReportStatus(id: number, data: ModeratorReportUpdate): Observable<Report> {
    return this.api.updateReportStatus(id, data);
  }
}
