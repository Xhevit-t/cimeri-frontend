import { User } from '../../shared/models/user.model';
import { Profile } from '../../shared/models/profile.model';
import { Property } from '../../shared/models/property.model';
import { ContactRequest } from '../../shared/models/request.model';
import { ForumPost, ForumReply } from '../../shared/models/forum.model';

export const SEED_CURRENT_USER: User = {
  id: 1,
  email: 'demo@flatbuddy.com',
  firstName: 'Alex',
  lastName: 'Demo',
  phoneNumber: '+389 70 123 456',
  emailVerified: true,
  createdAt: '2026-01-15T10:00:00Z'
};

export const SEED_USERS: User[] = [
  SEED_CURRENT_USER,
  { id: 2, email: 'maja@example.com', firstName: 'Maja', lastName: 'Petrovska', emailVerified: true, createdAt: '2026-01-20T10:00:00Z' },
  { id: 3, email: 'nikola@example.com', firstName: 'Nikola', lastName: 'Stojanovski', emailVerified: true, createdAt: '2026-02-01T10:00:00Z' },
  { id: 4, email: 'elena@example.com', firstName: 'Elena', lastName: 'Trajkovska', emailVerified: true, createdAt: '2026-02-10T10:00:00Z' },
  { id: 5, email: 'marko@example.com', firstName: 'Marko', lastName: 'Ilievski', emailVerified: true, createdAt: '2026-02-15T10:00:00Z' },
  { id: 6, email: 'ana@example.com', firstName: 'Ana', lastName: 'Kostova', emailVerified: true, createdAt: '2026-03-01T10:00:00Z' }
];

export const SEED_PROFILES: Profile[] = [
  {
    id: 1, userId: 1, firstName: 'Alex', lastName: 'Demo', email: 'demo@flatbuddy.com',
    city: 'Skopje', budgetMin: 250, budgetMax: 500, housingType: 'APARTMENT', lifestyle: 'BALANCED',
    earlyRiser: true, cleanliness: true, studyAtHome: false,
    movingDate: '2026-06-01', bio: 'Friendly student looking for a quiet place to live and study.', isLooking: true
  },
  {
    id: 2, userId: 2, firstName: 'Maja', lastName: 'Petrovska', email: 'maja@example.com',
    city: 'Skopje', budgetMin: 200, budgetMax: 400, housingType: 'APARTMENT', lifestyle: 'QUIET',
    earlyRiser: true, cleanliness: true, studyAtHome: true,
    movingDate: '2026-06-15', bio: 'Med student, very organized. Love cooking and reading on weekends.',
    isLooking: true, compatibilityScore: 92
  },
  {
    id: 3, userId: 3, firstName: 'Nikola', lastName: 'Stojanovski', email: 'nikola@example.com',
    city: 'Skopje', budgetMin: 300, budgetMax: 600, housingType: 'APARTMENT', lifestyle: 'SOCIAL',
    earlyRiser: false, cleanliness: true, studyAtHome: false,
    movingDate: '2026-07-01', bio: 'Software engineer, work from office, enjoy gym and weekend trips.',
    isLooking: true, compatibilityScore: 78
  },
  {
    id: 4, userId: 4, firstName: 'Elena', lastName: 'Trajkovska', email: 'elena@example.com',
    city: 'Bitola', budgetMin: 150, budgetMax: 300, housingType: 'STUDIO', lifestyle: 'STUDIOUS',
    earlyRiser: true, cleanliness: true, studyAtHome: true,
    movingDate: '2026-06-10', bio: 'Architecture student. Quiet, neat, mostly home in evenings.',
    isLooking: true, compatibilityScore: 85
  },
  {
    id: 5, userId: 5, firstName: 'Marko', lastName: 'Ilievski', email: 'marko@example.com',
    city: 'Tetovo', budgetMin: 200, budgetMax: 450, housingType: 'HOUSE', lifestyle: 'BALANCED',
    earlyRiser: false, cleanliness: false, studyAtHome: false,
    movingDate: '2026-08-01', bio: 'Easy-going, love music and cooking. Looking for friendly roommate.',
    isLooking: true, compatibilityScore: 67
  },
  {
    id: 6, userId: 6, firstName: 'Ana', lastName: 'Kostova', email: 'ana@example.com',
    city: 'Skopje', budgetMin: 350, budgetMax: 700, housingType: 'APARTMENT', lifestyle: 'QUIET',
    earlyRiser: true, cleanliness: true, studyAtHome: true,
    movingDate: '2026-07-15', bio: 'Working professional in marketing. Yoga in the mornings, calm evenings.',
    isLooking: true, compatibilityScore: 88
  }
];

export const SEED_PROPERTIES: Property[] = [
  {
    id: 1, ownerId: 2, ownerName: 'Maja Petrovska',
    title: 'Bright 2BR near city park', description: 'Spacious sunny apartment with park view. Recently renovated kitchen, washing machine, balcony. 10 min walk to faculty.',
    city: 'Skopje', address: 'Partizanska 25', price: 450, type: 'APARTMENT',
    rooms: 2, bathrooms: 1, furnished: true, wifi: true, parking: false, petFriendly: true,
    availableFrom: '2026-06-01', isActive: true, createdAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 2, ownerId: 3, ownerName: 'Nikola Stojanovski',
    title: 'Modern studio in center', description: 'Brand new studio, fully furnished, great for one person or couple. Building has gym and underground parking.',
    city: 'Skopje', address: 'Macedonia Square 12', price: 380, type: 'STUDIO',
    rooms: 1, bathrooms: 1, furnished: true, wifi: true, parking: true, petFriendly: false,
    availableFrom: '2026-06-15', isActive: true, createdAt: '2026-05-05T10:00:00Z'
  },
  {
    id: 3, ownerId: 4, ownerName: 'Elena Trajkovska',
    title: 'Cozy 3BR house with garden', description: 'Quiet residential area, large living room, big garden. Perfect for 2-3 students sharing.',
    city: 'Bitola', address: 'Sirok Sokak 88', price: 600, type: 'HOUSE',
    rooms: 3, bathrooms: 2, furnished: false, wifi: false, parking: true, petFriendly: true,
    availableFrom: '2026-07-01', isActive: true, createdAt: '2026-05-08T10:00:00Z'
  },
  {
    id: 4, ownerId: 5, ownerName: 'Marko Ilievski',
    title: 'Private room in shared apartment', description: 'Furnished private bedroom, shared kitchen and bath with one other roommate. Quiet building.',
    city: 'Tetovo', address: 'Ilindenska 14', price: 180, type: 'ROOM',
    rooms: 1, bathrooms: 1, furnished: true, wifi: true, parking: false, petFriendly: false,
    availableFrom: '2026-06-20', isActive: true, createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 5, ownerId: 6, ownerName: 'Ana Kostova',
    title: 'Luxury 2BR with balcony view', description: 'High floor with stunning city view. Modern furniture, dishwasher, A/C in every room, elevator.',
    city: 'Skopje', address: 'Vodnjanska 7', price: 700, type: 'APARTMENT',
    rooms: 2, bathrooms: 2, furnished: true, wifi: true, parking: true, petFriendly: true,
    availableFrom: '2026-07-15', isActive: true, createdAt: '2026-05-12T10:00:00Z'
  },
  {
    id: 6, ownerId: 2, ownerName: 'Maja Petrovska',
    title: 'Affordable studio for students', description: 'Small but comfortable studio. Walking distance to university. Includes water and heating.',
    city: 'Skopje', address: 'Studentski Dom 3', price: 220, type: 'STUDIO',
    rooms: 1, bathrooms: 1, furnished: true, wifi: true, parking: false, petFriendly: false,
    availableFrom: '2026-06-05', isActive: true, createdAt: '2026-05-14T10:00:00Z'
  }
];

export const SEED_REQUESTS: ContactRequest[] = [
  {
    id: 1, senderId: 2, senderName: 'Maja Petrovska', senderEmail: 'maja@example.com',
    recipientId: 1, message: 'Hi Alex! Your profile matches what I\'m looking for. Want to chat about being roommates?',
    status: 'PENDING', createdAt: '2026-05-20T14:00:00Z'
  },
  {
    id: 2, senderId: 4, senderName: 'Elena Trajkovska', senderEmail: 'elena@example.com',
    recipientId: 1, message: 'Hello! I saw we have similar lifestyles. Would love to discuss living together.',
    status: 'PENDING', createdAt: '2026-05-21T09:30:00Z'
  },
  {
    id: 3, senderId: 1, recipientId: 3, recipientName: 'Nikola Stojanovski',
    message: 'Hey Nikola, interested in your apartment. Are you still looking for a roommate?',
    status: 'ACCEPTED', createdAt: '2026-05-18T16:00:00Z', respondedAt: '2026-05-19T10:00:00Z'
  },
  {
    id: 4, senderId: 1, recipientId: 6, recipientName: 'Ana Kostova',
    message: 'Hi Ana, your place looks great. Could we talk about details?',
    status: 'REJECTED', createdAt: '2026-05-17T11:00:00Z', respondedAt: '2026-05-18T08:00:00Z'
  }
];

export const SEED_FORUM_POSTS: ForumPost[] = [
  {
    id: 1, authorId: 2, authorName: 'Maja Petrovska',
    title: 'Best neighborhoods in Skopje for students?',
    content: 'I\'m moving to Skopje in June and looking for advice. Which areas are safe, affordable, and close to universities? Centar feels expensive but everywhere else seems far. Any tips?',
    category: 'Questions', createdAt: '2026-05-15T10:00:00Z', replyCount: 3
  },
  {
    id: 2, authorId: 3, authorName: 'Nikola Stojanovski',
    title: 'How to split bills fairly with roommates',
    content: 'After a few rough experiences, I learned that setting clear rules from day 1 saves so much drama. Here\'s what works for me: shared Splitwise account, monthly reset, photo every receipt.',
    category: 'Tips', createdAt: '2026-05-18T12:00:00Z', replyCount: 5
  },
  {
    id: 3, authorId: 4, authorName: 'Elena Trajkovska',
    title: 'Anyone else looking for a quiet roommate in Bitola?',
    content: 'I\'m an architecture student and need a peaceful environment to study. Looking for someone similar — clean, organized, respects quiet hours.',
    category: 'General', createdAt: '2026-05-19T14:00:00Z', replyCount: 2
  },
  {
    id: 4, authorId: 6, authorName: 'Ana Kostova',
    title: 'Review: my FlatBuddy experience so far',
    content: 'Found a great match within 2 weeks of signing up. The compatibility score actually worked — we matched on lifestyle and habits. Highly recommend completing your full profile.',
    category: 'Reviews', createdAt: '2026-05-21T16:00:00Z', replyCount: 7
  }
];

export const SEED_FORUM_REPLIES: Record<number, ForumReply[]> = {
  1: [
    { id: 1, postId: 1, authorId: 3, authorName: 'Nikola Stojanovski', content: 'Karpoš and Aerodrom are great. Decent rent and good buses to center.', createdAt: '2026-05-15T11:00:00Z' },
    { id: 2, postId: 1, authorId: 6, authorName: 'Ana Kostova', content: 'I lived in Debar Maalo for years — quiet, walkable, lots of cafes. A bit pricier but worth it.', createdAt: '2026-05-15T15:00:00Z' },
    { id: 3, postId: 1, authorId: 5, authorName: 'Marko Ilievski', content: 'Avoid Aerodrom if you don\'t have a car. Public transport gets sparse in evenings.', createdAt: '2026-05-16T09:00:00Z' }
  ],
  2: [
    { id: 4, postId: 2, authorId: 2, authorName: 'Maja Petrovska', content: 'Splitwise saved my friendship with my last roommate. Cannot recommend enough.', createdAt: '2026-05-18T13:00:00Z' },
    { id: 5, postId: 2, authorId: 4, authorName: 'Elena Trajkovska', content: 'We just do a shared Google Sheet. Works fine and free.', createdAt: '2026-05-18T17:00:00Z' }
  ],
  3: [
    { id: 6, postId: 3, authorId: 2, authorName: 'Maja Petrovska', content: 'I\'m looking for the same in Skopje. Hope you find someone good!', createdAt: '2026-05-19T15:00:00Z' }
  ],
  4: [
    { id: 7, postId: 4, authorId: 2, authorName: 'Maja Petrovska', content: 'Same here, found my match in 10 days. Worth filling out the habits section honestly.', createdAt: '2026-05-21T17:00:00Z' }
  ]
};
