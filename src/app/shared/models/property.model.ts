export type PropertyType = 'APARTMENT' | 'PRIVATE_ROOM' | 'STUDIO';

/** Legacy alias kept for existing components */
export type PropertyTypeAlias = 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'ROOM';

export interface Property {
  id: number;
  ownerId: number;
  ownerName?: string;
  title: string;
  description: string;
  city: string;
  address?: string;
  monthlyPrice: number;
  accommodationType?: PropertyType;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  furnished?: boolean;
  internet?: boolean;
  parking?: boolean;
  petsAllowed?: boolean;
  availableFrom?: string;
  imageUrls?: string[];
  active?: boolean;
  createdAt?: string;

  /** Legacy field aliases used by existing components */
  price?: number;
  type?: PropertyTypeAlias;
  rooms?: number;
  bathrooms?: number;
  wifi?: boolean;
  petFriendly?: boolean;
  isActive?: boolean;
  imageUrl?: string;
}

export interface PropertyCreateRequest {
  title: string;
  city: string;
  monthlyPrice: number;
  description?: string;
  address?: string;
  accommodationType?: PropertyType;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  furnished?: boolean;
  internet?: boolean;
  parking?: boolean;
  petsAllowed?: boolean;
  availableFrom?: string;
  imageUrls?: string[];

  /** Legacy field aliases used by existing components */
  price?: number;
  type?: PropertyTypeAlias;
  rooms?: number;
  bathrooms?: number;
  wifi?: boolean;
  petFriendly?: boolean;
}

export interface PropertyFilter {
  city?: string;
  accommodationType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  furnished?: boolean;
  internet?: boolean;
  parking?: boolean;
  petsAllowed?: boolean;
  page?: number;
  size?: number;

  /** Legacy filter aliases */
  minPrice_?: number;
  type?: string;
}
