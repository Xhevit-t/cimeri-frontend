export type ReportTargetType = 'USER' | 'POST' | 'COMMENT';
export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Report {
  id: number;
  reporterId?: number;
  reporterName?: string;
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  description?: string;
  status?: ReportStatus;
  moderatorNotes?: string;
  createdAt?: string;
  resolvedAt?: string;
}

export interface ReportCreate {
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  description?: string;
}

export interface ModeratorReportUpdate {
  status: ReportStatus;
  moderatorNotes?: string;
}
