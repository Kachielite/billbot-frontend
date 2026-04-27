export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Currency {
  id: number;
  code: string;
  symbol: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  currency: Currency;
  createdAt: Date;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
}
