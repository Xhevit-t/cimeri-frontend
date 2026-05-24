import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'profile/edit/:id', renderMode: RenderMode.Server },
  { path: 'roommate/:id', renderMode: RenderMode.Server },
  { path: 'property/edit/:id', renderMode: RenderMode.Server },
  { path: 'property/:id', renderMode: RenderMode.Server },
  { path: 'forum/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender }
];
