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
    city: 'Skopje', minBudget: 250, maxBudget: 500, accommodationType: 'APARTMENT', lifestyle: 'BALANCED',
    earlyRiser: true, clean: true, studiesAtHome: false,
    moveInDate: '2026-06-01', bio: 'Friendly student looking for a quiet place to live and study.',
    // Legacy aliases for existing components
    budgetMin: 250, budgetMax: 500, housingType: 'APARTMENT', cleanliness: true, studyAtHome: false, movingDate: '2026-06-01', isLooking: true
  },
  {
    id: 2, userId: 2, firstName: 'Maja', lastName: 'Petrovska', email: 'maja@example.com',
    city: 'Skopje', minBudget: 200, maxBudget: 400, accommodationType: 'APARTMENT', lifestyle: 'QUIET',
    earlyRiser: true, clean: true, studiesAtHome: true,
    moveInDate: '2026-06-15', bio: 'Med student, very organized. Love cooking and reading on weekends.',
    compatibilityScore: 92,
    budgetMin: 200, budgetMax: 400, housingType: 'APARTMENT', cleanliness: true, studyAtHome: true, movingDate: '2026-06-15', isLooking: true
  },
  {
    id: 3, userId: 3, firstName: 'Nikola', lastName: 'Stojanovski', email: 'nikola@example.com',
    city: 'Skopje', minBudget: 300, maxBudget: 600, accommodationType: 'APARTMENT', lifestyle: 'SOCIAL',
    earlyRiser: false, clean: true, studiesAtHome: false,
    moveInDate: '2026-07-01', bio: 'Software engineer, work from office, enjoy gym and weekend trips.',
    compatibilityScore: 78,
    budgetMin: 300, budgetMax: 600, housingType: 'APARTMENT', cleanliness: true, studyAtHome: false, movingDate: '2026-07-01', isLooking: true
  },
  {
    id: 4, userId: 4, firstName: 'Elena', lastName: 'Trajkovska', email: 'elena@example.com',
    city: 'Bitola', minBudget: 150, maxBudget: 300, accommodationType: 'STUDIO', lifestyle: 'STUDIOUS',
    earlyRiser: true, clean: true, studiesAtHome: true,
    moveInDate: '2026-06-10', bio: 'Architecture student. Quiet, neat, mostly home in evenings.',
    compatibilityScore: 85,
    budgetMin: 150, budgetMax: 300, housingType: 'STUDIO', cleanliness: true, studyAtHome: true, movingDate: '2026-06-10', isLooking: true
  },
  {
    id: 5, userId: 5, firstName: 'Marko', lastName: 'Ilievski', email: 'marko@example.com',
    city: 'Tetovo', minBudget: 200, maxBudget: 450, accommodationType: 'PRIVATE_ROOM', lifestyle: 'BALANCED',
    earlyRiser: false, clean: false, studiesAtHome: false,
    moveInDate: '2026-08-01', bio: 'Easy-going, love music and cooking. Looking for friendly roommate.',
    compatibilityScore: 67,
    budgetMin: 200, budgetMax: 450, housingType: 'PRIVATE_ROOM', cleanliness: false, studyAtHome: false, movingDate: '2026-08-01', isLooking: true
  },
  {
    id: 6, userId: 6, firstName: 'Ana', lastName: 'Kostova', email: 'ana@example.com',
    city: 'Skopje', minBudget: 350, maxBudget: 700, accommodationType: 'APARTMENT', lifestyle: 'QUIET',
    earlyRiser: true, clean: true, studiesAtHome: true,
    moveInDate: '2026-07-15', bio: 'Working professional in marketing. Yoga in the mornings, calm evenings.',
    compatibilityScore: 88,
    budgetMin: 350, budgetMax: 700, housingType: 'APARTMENT', cleanliness: true, studyAtHome: true, movingDate: '2026-07-15', isLooking: true
  }
];

export const SEED_PROPERTIES: Property[] = [
  {
    id: 1, ownerId: 2, ownerName: 'Maja Petrovska',
    title: 'Bright 2BR near city park',
    description: 'Spacious sunny apartment with park view. Recently renovated kitchen, washing machine, balcony.',
    city: 'Skopje', address: 'Partizanska 25',
    monthlyPrice: 450, accommodationType: 'APARTMENT', numberOfRooms: 2, numberOfBathrooms: 1,
    furnished: true, internet: true, parking: false, petsAllowed: true,
    availableFrom: '2026-06-01', active: true, createdAt: '2026-05-01T10:00:00Z',
    // Legacy aliases
    price: 450, type: 'APARTMENT', rooms: 2, bathrooms: 1, wifi: true, petFriendly: true, isActive: true
  },
  {
    id: 2, ownerId: 3, ownerName: 'Nikola Stojanovski',
    title: 'Modern studio in center',
    description: 'Brand new studio, fully furnished, great for one person or couple.',
    city: 'Skopje', address: 'Macedonia Square 12',
    monthlyPrice: 380, accommodationType: 'STUDIO', numberOfRooms: 1, numberOfBathrooms: 1,
    furnished: true, internet: true, parking: true, petsAllowed: false,
    availableFrom: '2026-06-15', active: true, createdAt: '2026-05-05T10:00:00Z',
    price: 380, type: 'STUDIO', rooms: 1, bathrooms: 1, wifi: true, petFriendly: false, isActive: true
  },
  {
    id: 3, ownerId: 4, ownerName: 'Elena Trajkovska',
    title: 'Cozy 3BR house with garden',
    description: 'Quiet residential area, large living room, big garden.',
    city: 'Bitola', address: 'Sirok Sokak 88',
    monthlyPrice: 600, accommodationType: 'APARTMENT', numberOfRooms: 3, numberOfBathrooms: 2,
    furnished: false, internet: false, parking: true, petsAllowed: true,
    availableFrom: '2026-07-01', active: true, createdAt: '2026-05-08T10:00:00Z',
    price: 600, type: 'APARTMENT', rooms: 3, bathrooms: 2, wifi: false, petFriendly: true, isActive: true
  },
  {
    id: 4, ownerId: 5, ownerName: 'Marko Ilievski',
    title: 'Private room in shared apartment',
    description: 'Furnished private bedroom, shared kitchen and bath with one other roommate.',
    city: 'Tetovo', address: 'Ilindenska 14',
    monthlyPrice: 180, accommodationType: 'PRIVATE_ROOM', numberOfRooms: 1, numberOfBathrooms: 1,
    furnished: true, internet: true, parking: false, petsAllowed: false,
    availableFrom: '2026-06-20', active: true, createdAt: '2026-05-10T10:00:00Z',
    price: 180, type: 'ROOM', rooms: 1, bathrooms: 1, wifi: true, petFriendly: false, isActive: true
  },
  {
    id: 5, ownerId: 6, ownerName: 'Ana Kostova',
    title: 'Luxury 2BR with balcony view',
    description: 'High floor with stunning city view. Modern furniture, dishwasher, A/C in every room.',
    city: 'Skopje', address: 'Vodnjanska 7',
    monthlyPrice: 700, accommodationType: 'APARTMENT', numberOfRooms: 2, numberOfBathrooms: 2,
    furnished: true, internet: true, parking: true, petsAllowed: true,
    availableFrom: '2026-07-15', active: true, createdAt: '2026-05-12T10:00:00Z',
    price: 700, type: 'APARTMENT', rooms: 2, bathrooms: 2, wifi: true, petFriendly: true, isActive: true
  },
  {
    id: 6, ownerId: 2, ownerName: 'Maja Petrovska',
    title: 'Affordable studio for students',
    description: 'Small but comfortable studio. Walking distance to university. Includes water and heating.',
    city: 'Skopje', address: 'Studentski Dom 3',
    monthlyPrice: 220, accommodationType: 'STUDIO', numberOfRooms: 1, numberOfBathrooms: 1,
    furnished: true, internet: true, parking: false, petsAllowed: false,
    availableFrom: '2026-06-05', active: true, createdAt: '2026-05-14T10:00:00Z',
    price: 220, type: 'STUDIO', rooms: 1, bathrooms: 1, wifi: true, petFriendly: false, isActive: true
  }
];

export const SEED_REQUESTS: ContactRequest[] = [
  {
    id: 1, senderId: 2, senderName: 'Maja Petrovska', senderEmail: 'maja@example.com',
    recipientId: 1, targetType: 'USER', targetId: 1,
    description: 'Hi Alex! Your profile matches what I\'m looking for. Want to chat about being roommates?',
    status: 'PENDING', createdAt: '2026-05-20T14:00:00Z'
  },
  {
    id: 2, senderId: 4, senderName: 'Elena Trajkovska', senderEmail: 'elena@example.com',
    recipientId: 1, targetType: 'USER', targetId: 1,
    description: 'Hello! I saw we have similar lifestyles. Would love to discuss living together.',
    status: 'PENDING', createdAt: '2026-05-21T09:30:00Z'
  },
  {
    id: 3, senderId: 1, recipientId: 3, recipientName: 'Nikola Stojanovski',
    targetType: 'USER', targetId: 3,
    description: 'Hey Nikola, interested in your apartment. Are you still looking for a roommate?',
    status: 'ACCEPTED', createdAt: '2026-05-18T16:00:00Z', respondedAt: '2026-05-19T10:00:00Z'
  },
  {
    id: 4, senderId: 1, recipientId: 6, recipientName: 'Ana Kostova',
    targetType: 'USER', targetId: 6,
    description: 'Hi Ana, your place looks great. Could we talk about details?',
    status: 'REJECTED', createdAt: '2026-05-17T11:00:00Z', respondedAt: '2026-05-18T08:00:00Z'
  }
];

export const SEED_FORUM_POSTS: ForumPost[] = [
  {
    id: 1, authorId: 2, authorName: 'Maja Petrovska',
    title: 'Best neighborhoods in Skopje for students?',
    content: 'I\'m moving to Skopje in June and looking for advice. Which areas are safe, affordable, and close to universities?',
    category: 'QUESTIONS', createdAt: '2026-05-15T10:00:00Z', replyCount: 3
  },
  {
    id: 2, authorId: 3, authorName: 'Nikola Stojanovski',
    title: 'How to split bills fairly with roommates',
    content: 'After a few rough experiences, I learned that setting clear rules from day 1 saves so much drama.',
    category: 'ADVICE', createdAt: '2026-05-18T12:00:00Z', replyCount: 5
  },
  {
    id: 3, authorId: 4, authorName: 'Elena Trajkovska',
    title: 'Anyone else looking for a quiet roommate in Bitola?',
    content: 'I\'m an architecture student and need a peaceful environment to study.',
    category: 'GENERAL', createdAt: '2026-05-19T14:00:00Z', replyCount: 2
  },
  {
    id: 4, authorId: 6, authorName: 'Ana Kostova',
    title: 'Review: my FlatBuddy experience so far',
    content: 'Found a great match within 2 weeks of signing up. The compatibility score actually worked.',
    category: 'EXPERIENCES', createdAt: '2026-05-21T16:00:00Z', replyCount: 7
  }
];

export const SEED_FORUM_REPLIES: Record<number, ForumReply[]> = {
  1: [
    { id: 1, postId: 1, authorId: 3, authorName: 'Nikola Stojanovski', content: 'Karpoš and Aerodrom are great. Decent rent and good buses to center.', createdAt: '2026-05-15T11:00:00Z' },
    { id: 2, postId: 1, authorId: 6, authorName: 'Ana Kostova', content: 'I lived in Debar Maalo for years — quiet, walkable, lots of cafes.', createdAt: '2026-05-15T15:00:00Z' },
    { id: 3, postId: 1, authorId: 5, authorName: 'Marko Ilievski', content: 'Avoid Aerodrom if you don\'t have a car. Public transport gets sparse in evenings.', createdAt: '2026-05-16T09:00:00Z' }
  ],
  2: [
    { id: 4, postId: 2, authorId: 2, authorName: 'Maja Petrovska', content: 'Splitwise saved my friendship with my last roommate.', createdAt: '2026-05-18T13:00:00Z' },
    { id: 5, postId: 2, authorId: 4, authorName: 'Elena Trajkovska', content: 'We just do a shared Google Sheet. Works fine and free.', createdAt: '2026-05-18T17:00:00Z' }
  ],
  3: [
    { id: 6, postId: 3, authorId: 2, authorName: 'Maja Petrovska', content: 'I\'m looking for the same in Skopje. Hope you find someone good!', createdAt: '2026-05-19T15:00:00Z' }
  ],
  4: [
    { id: 7, postId: 4, authorId: 2, authorName: 'Maja Petrovska', content: 'Same here, found my match in 10 days.', createdAt: '2026-05-21T17:00:00Z' }
  ]
};
