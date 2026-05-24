export type PropertyType = 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'ROOM';

export interface Property {
  id: number;
  ownerId: number;
  ownerName?: string;
  title: string;
  description: string;
  city: string;
  address: string;
  price: number;
  type: PropertyType;
  rooms: number;
  bathrooms: number;
  furnished: boolean;
  wifi: boolean;
  parking: boolean;
  petFriendly: boolean;
  availableFrom: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: string;
}

export interface PropertyCreateRequest {
  title: string;
  description: string;
  city: string;
  address: string;
  price: number;
  type: PropertyType;
  rooms: number;
  bathrooms: number;
  furnished: boolean;
  wifi: boolean;
  parking: boolean;
  petFriendly: boolean;
  availableFrom: string;
}
