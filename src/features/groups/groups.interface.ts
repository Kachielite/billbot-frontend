export interface Group {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdBy: string | null;
  createdAt: Date;
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
