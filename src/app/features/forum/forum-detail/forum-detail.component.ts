import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForumService } from '../../../core/services/forum.service';
import { AuthService } from '../../../core/services/auth.service';
import { ForumPost, ForumReply } from '../../../shared/models/forum.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './forum-detail.component.html',
  styleUrl: './forum-detail.component.css'
})
export class ForumDetailComponent implements OnInit {
  private forum = inject(ForumService);
  auth = inject(AuthService);
  private router = inject(Router);

  @Input() id!: string;

  post: ForumPost | null = null;
  replies: ForumReply[] = [];
  loading = true;
  errorMessage = '';

  newReply = '';
  posting = false;

  ngOnInit(): void {
    const postId = Number(this.id);
    this.forum.getPost(postId).subscribe({
      next: (p) => {
        this.post = p;
        this.loadReplies(postId);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.displayMessage || 'Could not load post';
      }
    });
  }

  private loadReplies(postId: number): void {
    this.forum.getReplies(postId).subscribe({
      next: (data) => {
        this.replies = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.replies = [];
        this.loading = false;
      }
    });
  }

  submitReply(): void {
    if (!this.post || !this.newReply.trim()) return;
    this.posting = true;
    this.forum.addReply({ postId: this.post.id, content: this.newReply }).subscribe({
      next: () => {
        this.posting = false;
        this.newReply = '';
        this.loadReplies(this.post!.id);
      },
      error: (err) => {
        this.posting = false;
        this.errorMessage = err?.displayMessage || 'Could not post reply';
      }
    });
  }

  back(): void {
    this.router.navigate(['/forum']);
  }
}
