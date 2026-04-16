export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total_items: number;
  pages: number;
  items: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
