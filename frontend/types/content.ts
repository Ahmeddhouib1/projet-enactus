export interface SiteContent {
  enactusDescription: string;
  enactusEnsiDescription: string;
  mission: string;
  vision: string;
  mainConcept: string;
}

export interface Value {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
}

export interface AdminValue extends Value {
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ValueInput {
  title: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  active: boolean;
}
