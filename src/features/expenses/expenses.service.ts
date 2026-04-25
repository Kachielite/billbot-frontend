import { Asset } from 'react-native-image-picker';
import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { PaginatedResponse } from '@/core/common/interface/pagination.interface';
import { Expense, ParseReceiptResult, UpcomingExpense } from './expenses.interface';
import {
  mapExpenseFromDto,
  mapParsedReceiptFromDto,
  mapUpcomingExpenseFromDto,
} from './expenses.mapper';
import {
  ExpenseDto,
  ExpenseListParams,
  LogExpenseSchemaType,
  ParseReceiptResponseDto,
  UpcomingExpenseDto,
} from './expenses.dto';

export const ExpensesService = {
  listExpenses: async (
    poolId: string,
    params?: ExpenseListParams,
  ): Promise<PaginatedResponse<Expense>> => {
    try {
      const response = await customAxios.get<{
        page: number;
        limit: number;
        total_items: number;
        pages: number;
        items: ExpenseDto[];
      }>(API_ENDPOINTS.POOL_EXPENSES(poolId), { params });
      return {
        ...response.data,
        items: response.data.items.map(mapExpenseFromDto),
      };
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getExpense: async (expenseId: string): Promise<Expense> => {
    try {
      const response = await customAxios.get<ExpenseDto>(API_ENDPOINTS.EXPENSE_DETAIL(expenseId));
      return mapExpenseFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  logExpense: async (poolId: string, data: LogExpenseSchemaType): Promise<Expense> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || key === 'receipt') return;
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
      });
      if (data.receipt?.uri) {
        formData.append('receipt', {
          uri: data.receipt.uri,
          type: data.receipt.type ?? 'image/jpeg',
          name: data.receipt.fileName ?? 'receipt.jpg',
        } as unknown as Blob);
      }
      const response = await customAxios.post<ExpenseDto>(
        API_ENDPOINTS.POOL_EXPENSES(poolId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return mapExpenseFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  parseReceipt: async (poolId: string, image: Asset): Promise<ParseReceiptResult> => {
    try {
      const formData = new FormData();
      formData.append('receipt', {
        uri: image.uri,
        type: image.type ?? 'image/jpeg',
        name: image.fileName ?? 'receipt.jpg',
      } as unknown as Blob);
      const response = await customAxios.post<ParseReceiptResponseDto>(
        API_ENDPOINTS.POOL_PARSE_RECEIPT(poolId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return mapParsedReceiptFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  deleteExpense: async (expenseId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.EXPENSE_DETAIL(expenseId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  cancelRecurrence: async (poolId: string, expenseId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.EXPENSE_RECURRENCE(poolId, expenseId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  listGroupExpenses: async (
    groupId: string,
    params?: ExpenseListParams,
  ): Promise<PaginatedResponse<Expense>> => {
    try {
      const response = await customAxios.get<{
        page: number;
        limit: number;
        total_items: number;
        pages: number;
        items: ExpenseDto[];
      }>(API_ENDPOINTS.GROUP_EXPENSES(groupId), { params });
      return {
        ...response.data,
        items: response.data.items.map(mapExpenseFromDto),
      };
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  logGroupExpense: async (groupId: string, data: LogExpenseSchemaType): Promise<Expense> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || key === 'receipt') return;
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
      });
      if (data.receipt?.uri) {
        formData.append('receipt', {
          uri: data.receipt.uri,
          type: data.receipt.type ?? 'image/jpeg',
          name: data.receipt.fileName ?? 'receipt.jpg',
        } as unknown as Blob);
      }
      const response = await customAxios.post<ExpenseDto>(
        API_ENDPOINTS.GROUP_EXPENSES(groupId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return mapExpenseFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getUpcomingExpenses: async (
    params?: ExpenseListParams,
  ): Promise<PaginatedResponse<UpcomingExpense>> => {
    try {
      const response = await customAxios.get<{
        page: number;
        limit: number;
        total_items: number;
        pages: number;
        items: UpcomingExpenseDto[];
      }>(API_ENDPOINTS.UPCOMING_EXPENSES, { params });
      return {
        ...response.data,
        items: response.data.items.map(mapUpcomingExpenseFromDto),
      };
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};
