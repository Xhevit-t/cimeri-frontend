import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForumPost, ForumPostCreate, ForumReply, ForumReplyCreate } from '../../shared/models/forum.model';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/forum`;

  getPosts(): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.base}/posts`);
  }

  getPost(id: number): Observable<ForumPost> {
    return this.http.get<ForumPost>(`${this.base}/posts/${id}`);
  }

  createPost(payload: ForumPostCreate): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.base}/posts`, payload);
  }

  getReplies(postId: number): Observable<ForumReply[]> {
    return this.http.get<ForumReply[]>(`${this.base}/posts/${postId}/replies`);
  }

  addReply(payload: ForumReplyCreate): Observable<ForumReply> {
    return this.http.post<ForumReply>(`${this.base}/posts/${payload.postId}/replies`, payload);
  }
}
