export interface EventImage {
  id: number;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
}

export interface EventEdition {
  id: number;
  editionName: string;
  year: number;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  coverImage: string | null;
  displayOrder: number;
  images: EventImage[];
}

export interface EventSummary {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  featured: boolean;
  editions: EventEdition[];
}

export interface AdminEvent extends EventSummary {
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  name: string;
  description?: string;
  coverImage?: string;
  featured: boolean;
}

export interface EventEditionInput {
  editionName: string;
  year: number;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string;
  coverImage?: string;
  displayOrder?: number;
}
