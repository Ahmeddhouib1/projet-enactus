export type PartnerType = "SPONSOR" | "ACADEMIC" | "INSTITUTIONAL" | "MEDIA" | "TECHNOLOGY" | "OTHER";

export interface Partner {
  id: number;
  name: string;
  logo: string;
  websiteUrl: string | null;
  description: string | null;
  partnerType: PartnerType;
  displayOrder: number;
}

export interface AdminPartner extends Partner {
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerInput {
  name: string;
  logo: string;
  websiteUrl?: string;
  description?: string;
  partnerType: PartnerType;
  displayOrder?: number;
  active: boolean;
}
