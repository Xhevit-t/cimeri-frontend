// The backend may return ACCEPTED or, because it shares one DTO with reports,
// APPROVED for an accepted request. Both are treated as "accepted" in the UI.
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'APPROVED' | 'REJECTED';
export type ContactTargetType = 'USER' | 'PROPERTY';

export interface ContactRequest {
  id: number;
  senderId: number;
  senderName?: string;
  senderEmail?: string;
  recipientId: number;
  recipientName?: string;
  /**
   * Backend field names. The contact-request DTO is shared with reports, so the
   * sender of an inbox item may arrive as reporterId/reporterName instead of
   * senderId/senderName, and the recipient as targetId.
   */
  targetId?: number;
  targetType?: ContactTargetType;
  reporterId?: number;
  reporterName?: string;
  reason?: string;
  message?: string;
  description?: string;
  status: RequestStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface ContactRequestCreate {
  targetType: ContactTargetType;
  targetId: number;
  reason?: string;
  description?: string;

  /** Legacy fields used by existing components */
  recipientId?: number;
  message?: string;
}

export interface ContactInfo {
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
}

export interface RequestCounts {
  pending: number;
  accepted?: number;
  rejected?: number;
}
