export interface GroupBalance {
  totalOwed: number;
  totalOwedToMe: number;
  netBalance: number;
  currency: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  inviteCode: string;
  createdBy: string | null;
  createdAt: Date;
  memberCount: number;
  activePoolCount: number;
  members?: GroupMember[];
  balance?: GroupBalance;
}

export interface GroupMember {
  userId: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface GroupDetail extends Group {
  members: GroupMember[];
}

export interface PaginatedGroups {
  page: number;
  limit: number;
  totalItems: number;
  pages: number;
  groups: Group[];
}
