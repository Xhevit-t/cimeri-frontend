export type AccommodationType = 'APARTMENT' | 'PRIVATE_ROOM' | 'STUDIO';
export type Lifestyle = 'QUIET' | 'SOCIAL' | 'STUDIOUS' | 'BALANCED';

/** Legacy aliases kept for existing components */
export type HousingType = AccommodationType;

export interface Profile {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  city: string;
  minBudget: number;
  maxBudget: number;
  accommodationType: AccommodationType;
  lifestyle: Lifestyle;
  earlyRiser: boolean;
  clean: boolean;
  studiesAtHome: boolean;
  smoker?: boolean;
  petFriendly?: boolean;
  moveInDate?: string;
  bio?: string;
  publicProfile?: boolean;
  visibleInRecommendations?: boolean;
  compatibilityScore?: number;

  /** Legacy field aliases used by existing components */
  budgetMin?: number;
  budgetMax?: number;
  housingType?: HousingType;
  cleanliness?: boolean;
  studyAtHome?: boolean;
  movingDate?: string;
  isLooking?: boolean;
}

export interface ProfileUpsertRequest {
  city: string;
  minBudget?: number;
  maxBudget?: number;
  accommodationType?: AccommodationType;
  lifestyle?: Lifestyle;
  earlyRiser?: boolean;
  clean?: boolean;
  studiesAtHome?: boolean;
  smoker?: boolean;
  petFriendly?: boolean;
  moveInDate?: string;
  bio?: string;
  publicProfile?: boolean;
  visibleInRecommendations?: boolean;
}

/** Legacy alias kept for existing components */
export type ProfileCreateRequest = ProfileUpsertRequest & {
  budgetMin?: number;
  budgetMax?: number;
  housingType?: HousingType;
  cleanliness?: boolean;
  studyAtHome?: boolean;
  movingDate?: string;
};

export interface ProfileFilter {
  city?: string;
  lifestyle?: Lifestyle;
  accommodationType?: AccommodationType;
  minBudget?: number;
  maxBudget?: number;
  page?: number;
  size?: number;
}
