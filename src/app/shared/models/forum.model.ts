export type ForumCategory = 'ADVICE' | 'EXPERIENCES' | 'QUESTIONS' | 'CITIES' | 'GENERAL';

export interface ForumPost {
  id: number;
  authorId: number;
  authorName?: string;
  title: string;
  content: string;
  category?: ForumCategory | string;
  createdAt: string;
  updatedAt?: string;
  replyCount?: number;
  commentCount?: number;
}

export interface ForumComment {
  id: number;
  postId: number;
  authorId: number;
  authorName?: string;
  content: string;
  createdAt: string;
}

/** Legacy alias for existing components */
export type ForumReply = ForumComment;

export interface ForumPostCreate {
  title: string;
  content: string;
  category?: ForumCategory | string;
}

export interface ForumReplyCreate {
  postId: number;
  content: string;
}
