export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ContactRequest {
  id: number;
  senderId: number;
  senderName?: string;
  senderEmail?: string;
  recipientId: number;
  recipientName?: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface ContactRequestCreate {
  recipientId: number;
  message: string;
}

export interface ContactInfo {
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
}
