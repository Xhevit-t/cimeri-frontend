import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForumService } from '../../../core/services/forum.service';
import { AuthService } from '../../../core/services/auth.service';
import { ForumPost } from '../../../shared/models/forum.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-forum-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forum-list.component.html',
  styleUrl: './forum-list.component.css'
})
export class ForumListComponent implements OnInit {
  private forum = inject(ForumService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  posts: ForumPost[] = [];
  loading = true;
  showForm = false;
  posting = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    category: ['General']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.forum.getPosts().subscribe({
      next: (data) => {
        this.posts = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.posts = [];
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.posting = true;
    this.errorMessage = '';
    this.forum.createPost(this.form.getRawValue()).subscribe({
      next: () => {
        this.posting = false;
        this.form.reset({ title: '', content: '', category: 'General' });
        this.showForm = false;
        this.load();
      },
      error: (err) => {
        this.posting = false;
        this.errorMessage = err?.displayMessage || 'Could not post';
      }
    });
  }

  hasError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.touched && c.hasError(error));
  }
}
