export type HousingType = 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'ROOM';
export type Lifestyle = 'QUIET' | 'SOCIAL' | 'BALANCED' | 'STUDIOUS';

export interface Profile {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  housingType: HousingType;
  lifestyle: Lifestyle;
  earlyRiser: boolean;
  cleanliness: boolean;
  studyAtHome: boolean;
  movingDate: string;
  bio: string;
  isLooking: boolean;
  compatibilityScore?: number;
}

export interface ProfileCreateRequest {
  city: string;
  budgetMin: number;
  budgetMax: number;
  housingType: HousingType;
  lifestyle: Lifestyle;
  earlyRiser: boolean;
  cleanliness: boolean;
  studyAtHome: boolean;
  movingDate: string;
  bio: string;
}
