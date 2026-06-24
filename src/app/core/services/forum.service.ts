import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  ForumPost,
  ForumComment,
  ForumReply,
  ForumPostCreate,
  ForumReplyCreate,
  ForumCategory
} from '../../shared/models/forum.model';
import { PagedResponse } from '../../shared/models/user.model';

/**
 * Facade over ApiService for forum operations.
 * Keeps legacy method signatures (getReplies / addReply) intact so
 * ForumDetailComponent needs no changes.
 *
 * Backend paths:
 *   GET    /forum/posts
 *   POST   /forum/posts
 *   GET    /forum/posts/{id}
 *   DELETE /forum/posts/{id}
 *   GET    /forum/posts/{id}/comments
 *   POST   /forum/posts/{id}/comments
 *   DELETE /forum/comments/{id}
 */
@Injectable({ providedIn: 'root' })
export class ForumService {
  private api = inject(ApiService);

  /**
   * Legacy method used by ForumListComponent.
   * Returns the content array for backward compatibility.
   */
  getPosts(category?: ForumCategory | string, keyword?: string): Observable<ForumPost[]> {
    return this.api.getForumPosts(category, keyword, 0, 50).pipe(
      map((res) => (Array.isArray(res) ? res : (res as PagedResponse<ForumPost>).content ?? []))
    );
  }

  /** GET /forum/posts — returns paged response */
  getPostsPaged(category?: ForumCategory | string, keyword?: string, page = 0, size = 10): Observable<PagedResponse<ForumPost>> {
    return this.api.getForumPosts(category, keyword, page, size);
  }

  /** GET /forum/posts/{id} — used by ForumDetailComponent */
  getPost(id: number): Observable<ForumPost> {
    return this.api.getForumPostById(id);
  }

  /** POST /forum/posts — used by ForumListComponent */
  createPost(payload: ForumPostCreate): Observable<ForumPost> {
    return this.api.createForumPost(payload);
  }

  /** DELETE /forum/posts/{id} */
  deletePost(id: number): Observable<void> {
    return this.api.deleteForumPost(id);
  }

  /**
   * Legacy method: getReplies(postId) used by ForumDetailComponent.
   * Maps to GET /forum/posts/{id}/comments.
   */
  getReplies(postId: number): Observable<ForumReply[]> {
    return this.api.getForumComments(postId);
  }

  /** GET /forum/posts/{id}/comments */
  getComments(postId: number): Observable<ForumComment[]> {
    return this.api.getForumComments(postId);
  }

  /**
   * Legacy method: addReply(payload) used by ForumDetailComponent.
   * Maps to POST /forum/posts/{postId}/comments.
   */
  addReply(payload: ForumReplyCreate): Observable<ForumReply> {
    return this.api.addForumComment(payload.postId, payload.content);
  }

  /** POST /forum/posts/{postId}/comments */
  addComment(postId: number, content: string): Observable<ForumComment> {
    return this.api.addForumComment(postId, content);
  }

  /** DELETE /forum/comments/{id} */
  deleteComment(commentId: number): Observable<void> {
    return this.api.deleteForumComment(commentId);
  }
}
