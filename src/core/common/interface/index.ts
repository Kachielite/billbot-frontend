export interface IGeneralResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface IPaginationMeta<T> {
  total: number;
  page: number;
  limit: number;
  items: T[];
}
