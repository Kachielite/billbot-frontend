export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  currency: string;
  createdAt: Date;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
}
