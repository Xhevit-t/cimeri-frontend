import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ─── Public ───────────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'FlatBuddy - Find your roommate'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Login · FlatBuddy'
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Sign up · FlatBuddy'
  },
  // Properties and Forum are public (browsable without login)
  {
    path: 'properties',
    loadComponent: () =>
      import('./features/properties/property-list/property-list.component').then((m) => m.PropertyListComponent),
    title: 'Properties · FlatBuddy'
  },
  // NOTE: 'property/new' MUST be declared before 'property/:id'. Angular matches
  // routes top-to-bottom (first match wins), so a ':id' route placed first would
  // swallow '/property/new' (treating "new" as the id) and load the detail page —
  // which then fetches /properties/NaN and 500s — instead of the create form.
  {
    path: 'property/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/properties/property-form/property-form.component').then((m) => m.PropertyFormComponent),
    title: 'List property · FlatBuddy'
  },
  {
    path: 'property/:id',
    loadComponent: () =>
      import('./features/properties/property-detail/property-detail.component').then((m) => m.PropertyDetailComponent),
    title: 'Property · FlatBuddy'
  },
  {
    path: 'forum',
    loadComponent: () =>
      import('./features/forum/forum-list/forum-list.component').then((m) => m.ForumListComponent),
    title: 'Forum · FlatBuddy'
  },
  {
    path: 'forum/:id',
    loadComponent: () =>
      import('./features/forum/forum-detail/forum-detail.component').then((m) => m.ForumDetailComponent),
    title: 'Discussion · FlatBuddy'
  },

  // ─── Authenticated ────────────────────────────────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Dashboard · FlatBuddy'
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile-view/profile-view.component').then((m) => m.ProfileViewComponent),
    title: 'My profile · FlatBuddy'
  },
  {
    path: 'profile/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile-edit/profile-edit.component').then((m) => m.ProfileEditComponent),
    title: 'Edit profile · FlatBuddy'
  },
  {
    path: 'roommates',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/roommates/roommates-list/roommates-list.component').then((m) => m.RoommatesListComponent),
    title: 'Roommates · FlatBuddy'
  },
  {
    path: 'roommate/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/roommates/roommate-detail/roommate-detail.component').then((m) => m.RoommateDetailComponent),
    title: 'Roommate · FlatBuddy'
  },
  {
    path: 'property/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/properties/property-form/property-form.component').then((m) => m.PropertyFormComponent),
    title: 'Edit property · FlatBuddy'
  },
  {
    path: 'requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/requests/requests.component').then((m) => m.RequestsComponent),
    title: 'Requests · FlatBuddy'
  },

  // ─── Moderator / Admin ────────────────────────────────────────────────────
  {
    path: 'moderator',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MODERATOR', 'ADMIN'] },
    loadComponent: () =>
      import('./features/moderator/moderator.component').then((m) => m.ModeratorComponent),
    title: 'Moderation · FlatBuddy'
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
    title: 'Admin · FlatBuddy'
  },

  { path: '**', redirectTo: '' }
];
