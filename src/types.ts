export type MemberProfileLevel = 'basic' | 'extended';

export interface LocalizedText {
  uk: string;
  en: string;
}

export type EventType = 'training' | 'meeting' | 'conference';
export type EventFormat = 'online' | 'offline' | 'hybrid';

export interface AssociationEvent {
  id: string;
  published: boolean;

  title: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;

  type: EventType;
  format: EventFormat;

  startAt: string; // UTC ISO 8601
  endAt: string;   // UTC ISO 8601
  timeZone: string; // default Europe/Kyiv

  location?: LocalizedText;
  onlineUrl?: string;
  registrationUrl?: string;
  organizer?: LocalizedText;

  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberProduct {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  imageUrl?: string;
  price?: string;
}

export interface MemberCase {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl?: string;
}

export interface MemberCertificate {
  id: string;
  title: LocalizedText;
  documentUrl: string;
}

export interface AssociationMember {
  id: string;
  slug: string;
  order: number;
  published: boolean;
  profileLevel: MemberProfileLevel;
  name: LocalizedText;
  shortName: string;
  category: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;
  logoUrl: string;
  coverImageUrl: string;
  websiteUrl?: string;
  publicEmail?: string;
  publicPhone?: string;
  competencies?: LocalizedText[];
  services?: LocalizedText[];
  certificates?: MemberCertificate[];
  cases?: MemberCase[];
  products?: MemberProduct[];
  lastUpdated?: string;
  internalNotes?: string;
}

export interface DocumentItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  type: 'pdf' | 'doc' | 'link';
  size?: string;
  language: 'UA' | 'EN' | 'UA/EN';
  dateUpdated: string;
  fileUrl: string;
}

export interface JoinRequest {
  id: string;
  companyName: string;
  website: string;
  activityField: string;
  contactPerson: string;
  email: string;
  phone: string;
  message: string;
  edrpou?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read';
}
