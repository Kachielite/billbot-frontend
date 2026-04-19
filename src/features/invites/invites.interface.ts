export interface Invite {
  id: string;
  groupId: string;
  invitedBy: string | null;
  phone: string | null;
  email: string | null;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export interface InviteEntry {
  id: string;
  email: string;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
