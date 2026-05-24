import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  SEED_CURRENT_USER,
  SEED_FORUM_POSTS,
  SEED_FORUM_REPLIES,
  SEED_PROFILES,
  SEED_PROPERTIES,
  SEED_REQUESTS,
  SEED_USERS
} from './seed-data';

const ok = <T>(body: T, status = 200): Observable<HttpEvent<T>> =>
  of(new HttpResponse<T>({ status, body })).pipe(delay(40));

const err = (status: number, message: string) =>
  throwError(() => ({ status, error: { message }, displayMessage: message })).pipe(delay(30));

const profiles = [...SEED_PROFILES];
const properties = [...SEED_PROPERTIES];
const requests = [...SEED_REQUESTS];
const forumPosts = [...SEED_FORUM_POSTS];
const forumReplies: Record<number, any[]> = { ...SEED_FORUM_REPLIES };
let nextId = 1000;

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMockData) return next(req);
  if (!req.url.includes('/api/')) return next(req);

  const url = req.url.split('/api/')[1];
  const method = req.method;
  const body: any = req.body;

  // ---- AUTH ----
  if (method === 'POST' && url === 'auth/login') {
    return ok({
      token: 'mock-jwt-token-' + Date.now(),
      user: { ...SEED_CURRENT_USER, email: body?.email || SEED_CURRENT_USER.email }
    });
  }
  if (method === 'POST' && url === 'auth/register') {
    const newUser = {
      ...SEED_CURRENT_USER,
      id: nextId++,
      email: body?.email,
      firstName: body?.firstName,
      lastName: body?.lastName
    };
    return ok({ token: 'mock-jwt-token-' + Date.now(), user: newUser });
  }

  // ---- PROFILE ----
  if (method === 'GET' && url.startsWith('profile/me')) {
    return ok(profiles.find((p) => p.userId === SEED_CURRENT_USER.id) ?? profiles[0]);
  }
  if (method === 'GET' && url.startsWith('profile/')) {
    const userId = Number(url.split('/')[1]);
    const p = profiles.find((p) => p.userId === userId);
    return p ? ok(p) : err(404, 'Profile not found');
  }
  if (method === 'POST' && url === 'profile/create') {
    const newProfile = { ...body, id: nextId++, userId: SEED_CURRENT_USER.id, isLooking: true };
    profiles.push(newProfile);
    return ok(newProfile);
  }
  if (method === 'PUT' && url.startsWith('profile/update/')) {
    const id = Number(url.split('/')[2]);
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx === -1) return err(404, 'Profile not found');
    profiles[idx] = { ...profiles[idx], ...body };
    return ok(profiles[idx]);
  }
  if (method === 'DELETE' && url.startsWith('profile/')) {
    const id = Number(url.split('/')[1]);
    const idx = profiles.findIndex((p) => p.id === id);
    if (idx >= 0) profiles.splice(idx, 1);
    return ok(null);
  }

  // ---- MATCHES ----
  if (method === 'GET' && url.startsWith('matches/roommates')) {
    return ok(profiles.filter((p) => p.userId !== SEED_CURRENT_USER.id));
  }
  if (method === 'GET' && url.startsWith('matches/properties')) {
    return ok(properties);
  }
  if (method === 'GET' && url.startsWith('matches/compatibility/')) {
    const parts = url.split('/');
    const userId2 = Number(parts[3]);
    const p = profiles.find((p) => p.userId === userId2);
    return ok({ userId1: SEED_CURRENT_USER.id, userId2, score: p?.compatibilityScore ?? 70 });
  }

  // ---- PROPERTIES ----
  if (method === 'GET' && url === 'properties') {
    return ok(properties);
  }
  if (method === 'GET' && url.startsWith('properties/mine')) {
    return ok(properties.filter((p) => p.ownerId === SEED_CURRENT_USER.id));
  }
  if (method === 'GET' && url.startsWith('properties/')) {
    const id = Number(url.split('/')[1]);
    const p = properties.find((p) => p.id === id);
    return p ? ok(p) : err(404, 'Property not found');
  }
  if (method === 'POST' && url === 'properties') {
    const newProp = {
      ...body, id: nextId++, ownerId: SEED_CURRENT_USER.id,
      ownerName: `${SEED_CURRENT_USER.firstName} ${SEED_CURRENT_USER.lastName}`,
      isActive: true, createdAt: new Date().toISOString()
    };
    properties.unshift(newProp);
    return ok(newProp);
  }
  if (method === 'PUT' && url.startsWith('properties/')) {
    const id = Number(url.split('/')[1]);
    const idx = properties.findIndex((p) => p.id === id);
    if (idx === -1) return err(404, 'Property not found');
    properties[idx] = { ...properties[idx], ...body };
    return ok(properties[idx]);
  }
  if (method === 'DELETE' && url.startsWith('properties/')) {
    const id = Number(url.split('/')[1]);
    const idx = properties.findIndex((p) => p.id === id);
    if (idx >= 0) properties.splice(idx, 1);
    return ok(null);
  }

  // ---- REQUESTS ----
  if (method === 'POST' && url === 'requests/send') {
    const recipient = SEED_USERS.find((u) => u.id === body?.recipientId);
    const newReq = {
      id: nextId++, senderId: SEED_CURRENT_USER.id,
      recipientId: body?.recipientId,
      recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'User',
      message: body?.message, status: 'PENDING', createdAt: new Date().toISOString()
    };
    requests.push(newReq as any);
    return ok(newReq);
  }
  if (method === 'GET' && url === 'requests/incoming') {
    return ok(requests.filter((r) => r.recipientId === SEED_CURRENT_USER.id));
  }
  if (method === 'GET' && url === 'requests/outgoing') {
    return ok(requests.filter((r) => r.senderId === SEED_CURRENT_USER.id));
  }
  if (method === 'PUT' && /requests\/\d+\/accept/.test(url)) {
    const id = Number(url.split('/')[1]);
    const r = requests.find((r) => r.id === id);
    if (!r) return err(404, 'Request not found');
    r.status = 'ACCEPTED';
    r.respondedAt = new Date().toISOString();
    return ok(r);
  }
  if (method === 'PUT' && /requests\/\d+\/reject/.test(url)) {
    const id = Number(url.split('/')[1]);
    const r = requests.find((r) => r.id === id);
    if (!r) return err(404, 'Request not found');
    r.status = 'REJECTED';
    r.respondedAt = new Date().toISOString();
    return ok(r);
  }
  if (method === 'GET' && /requests\/\d+\/contact-info/.test(url)) {
    const id = Number(url.split('/')[1]);
    const r = requests.find((r) => r.id === id);
    if (!r) return err(404, 'Request not found');
    const otherId = r.senderId === SEED_CURRENT_USER.id ? r.recipientId : r.senderId;
    const user = SEED_USERS.find((u) => u.id === otherId);
    return ok({
      email: user?.email ?? 'unknown@example.com',
      phoneNumber: user?.phoneNumber ?? '+389 70 000 000',
      firstName: user?.firstName ?? 'User',
      lastName: user?.lastName ?? ''
    });
  }
  if (method === 'DELETE' && url.startsWith('requests/')) {
    const id = Number(url.split('/')[1]);
    const idx = requests.findIndex((r) => r.id === id);
    if (idx >= 0) requests.splice(idx, 1);
    return ok(null);
  }

  // ---- FORUM ----
  if (method === 'GET' && url === 'forum/posts') {
    return ok(forumPosts);
  }
  if (method === 'GET' && /forum\/posts\/\d+$/.test(url)) {
    const id = Number(url.split('/')[2]);
    const p = forumPosts.find((p) => p.id === id);
    return p ? ok(p) : err(404, 'Post not found');
  }
  if (method === 'POST' && url === 'forum/posts') {
    const post = {
      id: nextId++, authorId: SEED_CURRENT_USER.id,
      authorName: `${SEED_CURRENT_USER.firstName} ${SEED_CURRENT_USER.lastName}`,
      title: body?.title, content: body?.content, category: body?.category || 'General',
      createdAt: new Date().toISOString(), replyCount: 0
    };
    forumPosts.unshift(post);
    return ok(post);
  }
  if (method === 'GET' && /forum\/posts\/\d+\/replies/.test(url)) {
    const id = Number(url.split('/')[2]);
    return ok(forumReplies[id] ?? []);
  }
  if (method === 'POST' && /forum\/posts\/\d+\/replies/.test(url)) {
    const postId = Number(url.split('/')[2]);
    const reply = {
      id: nextId++, postId, authorId: SEED_CURRENT_USER.id,
      authorName: `${SEED_CURRENT_USER.firstName} ${SEED_CURRENT_USER.lastName}`,
      content: body?.content, createdAt: new Date().toISOString()
    };
    forumReplies[postId] = [...(forumReplies[postId] ?? []), reply];
    const post = forumPosts.find((p) => p.id === postId);
    if (post) post.replyCount = (post.replyCount ?? 0) + 1;
    return ok(reply);
  }

  // Fallback
  return next(req);
};
