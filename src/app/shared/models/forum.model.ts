export interface ForumPost {
  id: number;
  authorId: number;
  authorName?: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  replyCount?: number;
}

export interface ForumReply {
  id: number;
  postId: number;
  authorId: number;
  authorName?: string;
  content: string;
  createdAt: string;
}

export interface ForumPostCreate {
  title: string;
  content: string;
  category?: string;
}

export interface ForumReplyCreate {
  postId: number;
  content: string;
}
