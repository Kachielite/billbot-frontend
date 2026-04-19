export interface Pool {
  id: string;
  groupId: string;
  name: string;
  description: string | null;
  status: 'active' | 'settled' | 'closed';
  activityStatus: 'empty' | 'ongoing' | 'settled';
  expenseCount: number;
  splitType: string;
  createdBy: string | null;
  createdAt: Date;
}

export interface PaginatedPools {
  page: number;
  limit: number;
  totalItems: number;
  pages: number;
  pools: Pool[];
}

export interface PoolMember {
  poolId: string;
  userId: string;
  joinedAt: Date;
}

export interface PoolDetail extends Pool {
  members: PoolMember[];
}
