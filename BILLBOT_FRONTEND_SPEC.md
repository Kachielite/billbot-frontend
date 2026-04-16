# BillBot Frontend — Scaffold Specification

## Purpose of This Document

This document instructs Claude Code on exactly what to build in the `billbot-frontend` React Native project. The AGENTS.md file in the repository is the structural enforcement policy and must be followed at all times.

**What to build:** All feature scaffolding — services, interfaces, DTOs (with Zod schemas), mappers, state, hooks, navigation types, core network layer, constants, and utils. Create empty `screens/` and `components/` folders inside each feature but do not create any files inside them.

**What not to build:** No screen files, no UI components, no JSX anywhere. The developer will implement those separately.

---

## Constraints from AGENTS.md (Non-Negotiable)

- Follow the existing folder structure exactly — no new top-level architecture folders
- All new feature folders live under `src/features/<feature-name>/`
- All cross-folder imports use `@/` alias (maps to `src/`)
- Same-folder or direct child imports may use relative paths
- File naming: `<feature>.<role>.ts` for feature files, `use-<action>.ts` for hooks
- `core/` must not depend on `features/`
- After all changes: run `npm run lint`, `npm run format:check`, `npx tsc --noEmit`

---

## Dependencies to Install

Install these before scaffolding. Do not install anything not listed here.

```bash
# HTTP client
npm install axios

# Server state — queries and mutations
npm install @tanstack/react-query

# Client state management
npm install zustand

# Async storage (session token persistence)
npm install @react-native-async-storage/async-storage

# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# Google + Apple auth
npm install @react-native-google-signin/google-signin
npm install @invertase/react-native-apple-authentication

# Image picker (for receipt + proof uploads)
npm install react-native-image-picker

# Form handling + validation
npm install react-hook-form
npm install zod
npm install @hookform/resolvers

# Toast notifications (used in mutation onSuccess / onError)
npm install react-native-toast-message

# Date utility
npm install date-fns
```

---

## Hook Patterns — Read This Before Writing Any Hook

There are two hook patterns used throughout the codebase. Apply the correct one based on whether the hook reads data or mutates it.

### GET hooks — use `useQuery`

```typescript
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { GroupsService } from '../groups.service';

const useGroups = () => {
  const { data, isLoading, error, refetch } = useQuery([QUERY_KEYS.GROUPS], () =>
    GroupsService.listGroups(),
  );

  return { groups: data ?? [], isLoading, error, refetch };
};

export default useGroups;
```

### POST / PUT / DELETE hooks — use `useForm` + `useMutation`

Every mutation hook that takes user input **must** use `useForm` with a Zod schema sourced from the feature's `.dto.ts` file. Follow this pattern exactly:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error/app-error';
import { createGroupSchema, type CreateGroupSchemaType } from '../groups.dto';
import { GroupsService } from '../groups.service';

const useCreateGroup = () => {
  const queryClient = useQueryClient();

  const form = useForm<CreateGroupSchemaType>({
    resolver: zodResolver(createGroupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { isLoading: isCreating, mutateAsync: createGroup } = useMutation(
    ['create-group'],
    async (data: CreateGroupSchemaType) => {
      return GroupsService.createGroup({ name: data.name, description: data.description });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUPS]);
        Toast.show({ type: 'success', text1: 'Group created successfully' });
        form.reset();
      },
      onError: (error: AppError) => {
        const message = error.message ?? 'An error occurred';
        Toast.show({ type: 'error', text1: message });
      },
    },
  );

  return { form, isCreating, createGroup };
};

export default useCreateGroup;
```

**Rules for mutation hooks:**

- The Zod schema and its inferred type are always defined in the `.dto.ts` file, not in the hook
- Schema naming: `<action><Feature>Schema` e.g. `createGroupSchema`, `logExpenseSchema`, `disputeSettlementSchema`
- Type naming: `<Action><Feature>SchemaType` e.g. `CreateGroupSchemaType`
- Always call `queryClient.invalidateQueries` with the relevant `QUERY_KEYS` on success
- Always show a `Toast` on both success and error
- Always `form.reset()` on success
- Action-only mutations (confirm, delete, mark-read) with no user input fields do not use `useForm` — they use `useMutation` only

---

## DTO File Pattern — Zod Schemas Live Here

Every `.dto.ts` file exports two things for each request shape:

1. A Zod schema (the validation rule)
2. An inferred TypeScript type from that schema (via `z.infer`)

Raw API response shapes remain as plain TypeScript interfaces (not Zod — they are outputs not inputs).

**Example pattern for `groups.dto.ts`:**

```typescript
import { z } from 'zod';

// ── Request schemas (Zod) ─────────────────────────────────────────────────
export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().max(500).optional(),
});
export type CreateGroupSchemaType = z.infer<typeof createGroupSchema>;

// ── Response DTOs (plain interfaces — API outputs, not user inputs) ────────
export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface GroupMemberDto {
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface GroupDetailDto extends GroupDto {
  members: GroupMemberDto[];
}
```

Apply this pattern to every `.dto.ts` file — Zod schema + inferred type for every request body, plain interface for every response shape.

---

## Final Folder Structure to Produce

```text
src/
  App.tsx                          ← update: wire navigation root + QueryClientProvider
  core/
    assets/                        ← leave as-is
    common/
      constants/
        theme.ts                   ← new
        env.ts                     ← new
        storage-keys.ts            ← new
        query-keys.ts              ← new
      error/
        app-error.ts               ← new
      interface/
        api-response.interface.ts  ← new
        pagination.interface.ts    ← new
      network/
        api-client.ts              ← new
        api-endpoints.ts           ← new
      utils/
        currency.ts                ← new
        date.ts                    ← new
        storage.ts                 ← new
  features/
    auth/                          ← exists
      hooks/                       ← exists
        use-google-sign-in.ts      ← new
        use-apple-sign-in.ts       ← new
      auth.dto.ts                  ← new
      auth.interface.ts            ← new
      auth.mapper.ts               ← new
      auth.service.ts              ← new
      auth.state.ts                ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    user/                          ← exists
      hooks/
        use-profile.ts             ← new (GET)
        use-update-profile.ts      ← new (PUT — useForm + useMutation)
        use-search-user.ts         ← new (GET with query param)
      user.dto.ts                  ← new
      user.interface.ts            ← new
      user.mapper.ts               ← new
      user.service.ts              ← new
      user.state.ts                ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    groups/
      hooks/
        use-groups.ts              ← new (GET)
        use-group-detail.ts        ← new (GET)
        use-create-group.ts        ← new (POST — useForm + useMutation)
        use-delete-group.ts        ← new (DELETE — useMutation only, no form)
        use-remove-member.ts       ← new (DELETE — useMutation only, no form)
      groups.dto.ts                ← new
      groups.interface.ts          ← new
      groups.mapper.ts             ← new
      groups.service.ts            ← new
      groups.state.ts              ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    invites/
      hooks/
        use-create-invite.ts       ← new (POST — useForm + useMutation)
        use-list-invites.ts        ← new (GET)
        use-cancel-invite.ts       ← new (DELETE — useMutation only, no form)
        use-join-group.ts          ← new (POST — useForm + useMutation)
      invites.dto.ts               ← new
      invites.interface.ts         ← new
      invites.mapper.ts            ← new
      invites.service.ts           ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    pools/
      hooks/
        use-group-pools.ts         ← new (GET)
        use-pool-detail.ts         ← new (GET)
        use-create-pool.ts         ← new (POST — useForm + useMutation)
        use-update-pool.ts         ← new (PUT — useForm + useMutation)
        use-pool-members.ts        ← new (POST/DELETE — useMutation only, no form)
      pools.dto.ts                 ← new
      pools.interface.ts           ← new
      pools.mapper.ts              ← new
      pools.service.ts             ← new
      pools.state.ts               ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    expenses/
      hooks/
        use-pool-expenses.ts       ← new (GET paginated)
        use-expense-detail.ts      ← new (GET)
        use-log-expense.ts         ← new (POST — useForm + useMutation)
        use-parse-receipt.ts       ← new (POST — useMutation only, file action not form)
        use-delete-expense.ts      ← new (DELETE — useMutation only, no form)
        use-cancel-recurrence.ts   ← new (DELETE — useMutation only, no form)
      expenses.dto.ts              ← new
      expenses.interface.ts        ← new
      expenses.mapper.ts           ← new
      expenses.service.ts          ← new
      expenses.state.ts            ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    balances/
      hooks/
        use-pool-balances.ts       ← new (GET)
      balances.dto.ts              ← new
      balances.interface.ts        ← new
      balances.mapper.ts           ← new
      balances.service.ts          ← new
    settlements/
      hooks/
        use-pool-settlements.ts    ← new (GET)
        use-settlement-detail.ts   ← new (GET)
        use-submit-settlement.ts   ← new (POST — useForm + useMutation)
        use-confirm-settlement.ts  ← new (POST — useMutation only, action not form)
        use-dispute-settlement.ts  ← new (POST — useForm + useMutation)
      settlements.dto.ts           ← new
      settlements.interface.ts     ← new
      settlements.mapper.ts        ← new
      settlements.service.ts       ← new
      settlements.state.ts         ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    notifications/
      hooks/
        use-notifications.ts       ← new (GET paginated)
        use-mark-read.ts           ← new (PATCH — useMutation only, action not form)
        use-mark-all-read.ts       ← new (PATCH — useMutation only, action not form)
      notifications.dto.ts         ← new
      notifications.interface.ts   ← new
      notifications.mapper.ts      ← new
      notifications.service.ts     ← new
      notifications.state.ts       ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
    categories/
      hooks/
        use-categories.ts          ← new (GET)
      categories.dto.ts            ← new
      categories.interface.ts      ← new
      categories.mapper.ts         ← new
      categories.service.ts        ← new
      categories.state.ts          ← new
    webhooks/
      hooks/
        use-group-webhooks.ts      ← new (GET)
        use-register-webhook.ts    ← new (POST — useForm + useMutation)
        use-delete-webhook.ts      ← new (DELETE — useMutation only, no form)
      webhooks.dto.ts              ← new
      webhooks.interface.ts        ← new
      webhooks.mapper.ts           ← new
      webhooks.service.ts          ← new
      components/                  ← create empty folder only
      screens/                     ← create empty folder only
  navigation/
    navigation.types.ts            ← new
    RootNavigator.tsx              ← new
    AuthNavigator.tsx              ← new
    MainNavigator.tsx              ← new
```

---

## Core Layer

### `src/core/common/constants/theme.ts`

Re-export the theme object from `billbot.theme.json` as a typed TypeScript constant covering light/dark color tokens, typography scale, spacing, radius, and elevation.

```typescript
export const theme = { ... } as const;
export type Theme = typeof theme;
export type ColorScheme = 'light' | 'dark';
```

### `src/core/common/constants/env.ts`

```typescript
export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.billbot.app/v1',
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  APPLE_BUNDLE_ID: process.env.EXPO_PUBLIC_APPLE_BUNDLE_ID ?? 'app.billbot',
} as const;
```

### `src/core/common/constants/storage-keys.ts`

```typescript
export const STORAGE_KEYS = {
  SESSION_TOKEN: '@billbot/session_token',
  USER_PROFILE: '@billbot/user_profile',
  COLOR_SCHEME: '@billbot/color_scheme',
} as const;
```

### `src/core/common/constants/query-keys.ts`

```typescript
export const QUERY_KEYS = {
  ME: 'me',
  GROUPS: 'groups',
  GROUP_DETAIL: 'group-detail',
  GROUP_POOLS: 'group-pools',
  POOL_DETAIL: 'pool-detail',
  POOL_EXPENSES: 'pool-expenses',
  POOL_BALANCES: 'pool-balances',
  POOL_SETTLEMENTS: 'pool-settlements',
  EXPENSE_DETAIL: 'expense-detail',
  SETTLEMENT_DETAIL: 'settlement-detail',
  NOTIFICATIONS: 'notifications',
  CATEGORIES: 'categories',
  GROUP_INVITES: 'group-invites',
  GROUP_WEBHOOKS: 'group-webhooks',
} as const;
```

### `src/core/common/interface/api-response.interface.ts`

```typescript
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

### `src/core/common/interface/pagination.interface.ts`

```typescript
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
```

### `src/core/common/error/app-error.ts`

```typescript
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('Session expired. Please sign in again.', 401, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found.`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

### `src/core/common/network/api-endpoints.ts`

```typescript
export const API_ENDPOINTS = {
  AUTH_GOOGLE: '/auth/google',
  AUTH_APPLE: '/auth/apple',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  USERS_ME: '/users/me',
  USERS_SEARCH: '/users/search',
  GROUPS: '/groups',
  GROUP_DETAIL: (groupId: string) => `/groups/${groupId}`,
  GROUP_REMOVE_MEMBER: (groupId: string, userId: string) => `/groups/${groupId}/members/${userId}`,
  GROUP_INVITES: (groupId: string) => `/groups/${groupId}/invites`,
  GROUP_INVITE_CANCEL: (groupId: string, inviteId: string) =>
    `/groups/${groupId}/invites/${inviteId}`,
  GROUP_JOIN: (token: string) => `/groups/join/${token}`,
  GROUP_POOLS: (groupId: string) => `/groups/${groupId}/pools`,
  POOL_DETAIL: (poolId: string) => `/pools/${poolId}`,
  POOL_MEMBERS: (poolId: string) => `/pools/${poolId}/members`,
  POOL_REMOVE_MEMBER: (poolId: string, userId: string) => `/pools/${poolId}/members/${userId}`,
  POOL_EXPENSES: (poolId: string) => `/pools/${poolId}/expenses`,
  POOL_PARSE_RECEIPT: (poolId: string) => `/pools/${poolId}/expenses/parse-receipt`,
  EXPENSE_DETAIL: (expenseId: string) => `/expenses/${expenseId}`,
  EXPENSE_RECURRENCE: (poolId: string, expenseId: string) =>
    `/pools/${poolId}/expenses/${expenseId}/recurrence`,
  POOL_BALANCES: (poolId: string) => `/pools/${poolId}/balances`,
  POOL_SETTLEMENTS: (poolId: string) => `/pools/${poolId}/settlements`,
  SETTLEMENT_DETAIL: (settlementId: string) => `/settlements/${settlementId}`,
  SETTLEMENT_CONFIRM: (settlementId: string) => `/settlements/${settlementId}/confirm`,
  SETTLEMENT_DISPUTE: (settlementId: string) => `/settlements/${settlementId}/dispute`,
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: '/notifications/read-all',
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (categoryId: string) => `/categories/${categoryId}`,
  GROUP_WEBHOOKS: (groupId: string) => `/groups/${groupId}/webhooks`,
  GROUP_WEBHOOK_DELETE: (groupId: string, webhookId: string) =>
    `/groups/${groupId}/webhooks/${webhookId}`,
} as const;
```

### `src/core/common/network/api-client.ts`

Axios instance with:

- Base URL from `ENV.API_BASE_URL`
- Request interceptor: reads session token from AsyncStorage, attaches `Authorization: Bearer <token>`
- Response interceptor: on 401, clears token from storage and throws `UnauthorizedError`; on other non-2xx, throws `AppError` with `statusCode` and `message` extracted from the response body

```typescript
// export const apiClient: AxiosInstance
// export async function setAuthToken(token: string | null): Promise<void>
// export async function getAuthToken(): Promise<string | null>
```

### `src/core/common/utils/storage.ts`

```typescript
// Typed AsyncStorage wrapper
// export async function saveItem(key: string, value: unknown): Promise<void>
// export async function getItem<T>(key: string): Promise<T | null>
// export async function removeItem(key: string): Promise<void>
// export async function clearAll(): Promise<void>
```

### `src/core/common/utils/currency.ts`

```typescript
// export function formatCurrency(amount: number | string, currency?: string): string
// NGN → ₦, KES → KSh, GHS → GH₵, ZAR → R
// export function parseCurrency(value: string): number
```

### `src/core/common/utils/date.ts`

```typescript
// Thin wrappers around date-fns
// export function formatDate(date: string | Date): string       → 'Apr 13, 2025'
// export function formatRelative(date: string | Date): string   → '2 hours ago'
// export function formatShort(date: string | Date): string      → 'Apr 13'
// export function isToday(date: string | Date): boolean
// export function isFuture(date: string | Date): boolean
```

---

## Navigation

### `src/navigation/navigation.types.ts`

```typescript
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  Onboarding: undefined;
};

export type GroupsStackParamList = {
  GroupsList: undefined;
  GroupDetail: { groupId: string };
  GroupSettings: { groupId: string };
  PoolDetail: { poolId: string; groupId: string };
  PoolSettings: { poolId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Activity: undefined;
  Groups: NavigatorScreenParams<GroupsStackParamList>;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Notifications: undefined;
  AddExpense: { poolId?: string } | undefined;
  CreateGroup: undefined;
  JoinGroup: undefined;
  CreatePool: { groupId: string };
  SettleUp: { poolId: string; toUserId: string; toUserName: string; amount: number };
  SettlementDetail: { settlementId: string };
  ExpenseDetail: { expenseId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

### `src/navigation/RootNavigator.tsx`

Root stack navigator. Reads `isAuthenticated` from `auth.state`. Renders `AuthNavigator` when signed out, `MainNavigator` when signed in. Modal screens registered at root level. Use `const PlaceholderScreen = () => null` for all screen references.

### `src/navigation/AuthNavigator.tsx`

Stack navigator for `SignIn` and `Onboarding`. Placeholder screens.

### `src/navigation/MainNavigator.tsx`

Bottom tab navigator — 4 tabs: Home, Activity, Groups, Profile. Active tint from `theme.light.primary`. Groups tab uses its own nested stack navigator (defined in this file). Notification bell rendered as header right button on Home and Activity tabs.

---

## Feature Scaffolding

**Rules:**

- **DTO file**: Zod schemas + inferred types for all request shapes. Plain TypeScript interfaces for all response shapes
- **Interface file**: Clean domain models (camelCase, `number` for amounts, `Date` for timestamps)
- **Mapper file**: Pure functions `fromDto → interface`
- **Service file**: Async functions calling `apiClient`, returning mapped interfaces, throwing `AppError`
- **State file**: Zustand store for data that persists across screens (auth token, unread count, caches)
- **GET hooks**: use `useQuery` from `@tanstack/react-query`
- **POST/PUT/DELETE hooks with user input**: use `useForm` + `zodResolver` + `useMutation`
- **Action-only mutations** (confirm, delete, mark-read — no user input fields): use `useMutation` only

---

### Feature: `auth`

**`auth.dto.ts`**

```typescript
import { z } from 'zod';

// Request schemas
export const googleSignInSchema = z.object({
  idToken: z.string().min(1),
});
export type GoogleSignInSchemaType = z.infer<typeof googleSignInSchema>;

export const appleSignInSchema = z.object({
  identityToken: z.string().min(1),
  fullName: z
    .object({
      givenName: z.string().nullable().optional(),
      familyName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  email: z.string().email().nullable().optional(),
});
export type AppleSignInSchemaType = z.infer<typeof appleSignInSchema>;

// Response DTOs
export interface UserDto {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}
export interface AuthResponseDto {
  token: string;
  user: UserDto;
  isNewUser: boolean;
}
```

**`auth.interface.ts`**

```typescript
export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}
export interface AuthSession {
  token: string;
  user: AuthUser;
  isNewUser: boolean;
}
```

**`auth.mapper.ts`**

```typescript
// mapAuthUserFromDto(dto: UserDto): AuthUser
// mapAuthSessionFromDto(dto: AuthResponseDto): AuthSession
```

**`auth.service.ts`**

```typescript
// signInWithGoogle(idToken: string): Promise<AuthSession>   POST /auth/google
// signInWithApple(payload: AppleSignInSchemaType): Promise<AuthSession>  POST /auth/apple
// logout(): Promise<void>   POST /auth/logout — then clear token from apiClient
// getMe(): Promise<AuthUser>  GET /auth/me
```

**`auth.state.ts`** — Zustand

```typescript
// user: AuthUser | null
// token: string | null
// isAuthenticated: boolean
// isLoading: boolean
// setSession(session: AuthSession): void
// clearSession(): void
// initSession(): Promise<void>  — reads token from storage, calls getMe, populates user
// updateUser(user: Partial<AuthUser>): void
```

**`hooks/use-google-sign-in.ts`** — `useMutation` only (OAuth flow, not a form)

```typescript
// Calls GoogleSignin.signIn() → idToken → auth.service.signInWithGoogle → auth.state.setSession
// Returns { signIn, isLoading, error }
```

**`hooks/use-apple-sign-in.ts`** — `useMutation` only (OAuth flow, not a form)

```typescript
// Calls appleAuth.performRequest() → identityToken + fullName + email
// Calls auth.service.signInWithApple → auth.state.setSession
// Returns { signIn, isLoading, error }
```

---

### Feature: `user`

**`user.dto.ts`**

```typescript
import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  email: z.string().email('Invalid email').nullable().optional(),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Enter a valid international phone number e.g. +2348012345678')
    .nullable()
    .optional(),
  avatar_url: z.string().url().nullable().optional(),
});
export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;

// Response DTOs
export interface UserProfileDto {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}
export interface UserSummaryDto {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}
```

**`user.interface.ts`**

```typescript
export interface UserProfile {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}
export interface UserSummary {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
}
```

**`user.mapper.ts`** — `mapUserProfileFromDto`, `mapUserSummaryFromDto`

**`user.service.ts`**

```typescript
// getProfile(): Promise<UserProfile>                           GET /users/me
// updateProfile(data: UpdateProfileSchemaType): Promise<UserProfile>  PUT /users/me
// searchByPhone(phone: string): Promise<UserSummary>           GET /users/search?phone=
```

**`user.state.ts`** — profile: `UserProfile | null`, actions: `setProfile`, `clearProfile`

**Hooks:**

- `use-profile.ts` — `useQuery` → `{ profile, isLoading, error, refetch }`
- `use-update-profile.ts` — `useForm<UpdateProfileSchemaType>` + `useMutation` → `{ form, isUpdating, updateProfile }`
- `use-search-user.ts` — `useQuery` (enabled when phone.length > 6) → `{ search, result, isLoading, error }`

---

### Feature: `groups`

**`groups.dto.ts`**

```typescript
import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().max(500).optional(),
});
export type CreateGroupSchemaType = z.infer<typeof createGroupSchema>;

// Response DTOs
export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}
export interface GroupMemberDto {
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  role: 'admin' | 'member';
  joined_at: string;
}
export interface GroupDetailDto extends GroupDto {
  members: GroupMemberDto[];
}
```

**`groups.interface.ts`**

```typescript
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
```

**`groups.mapper.ts`** — `mapGroupFromDto`, `mapGroupMemberFromDto`, `mapGroupDetailFromDto`

**`groups.service.ts`**

```typescript
// listGroups(): Promise<Group[]>                                     GET /groups
// getGroupDetail(groupId: string): Promise<GroupDetail>              GET /groups/:groupId
// createGroup(data: CreateGroupSchemaType): Promise<Group>           POST /groups
// deleteGroup(groupId: string): Promise<void>                        DELETE /groups/:groupId
// removeMember(groupId: string, userId: string): Promise<void>       DELETE /groups/:groupId/members/:userId
```

**`groups.state.ts`** — `groups: Group[]`, actions: `setGroups`, `addGroup`, `removeGroup`, `updateGroup`

**Hooks:**

- `use-groups.ts` — `useQuery` → `{ groups, isLoading, error, refetch }`
- `use-group-detail.ts` — `useQuery([QUERY_KEYS.GROUP_DETAIL, groupId], ...)` → `{ group, isLoading, error, refetch }`
- `use-create-group.ts` — `useForm<CreateGroupSchemaType>` + `useMutation`, invalidates `QUERY_KEYS.GROUPS` on success → `{ form, isCreating, createGroup }`
- `use-delete-group.ts` — `useMutation` only → `{ deleteGroup, isDeleting }`
- `use-remove-member.ts` — `useMutation` only → `{ removeMember, isRemoving }`

---

### Feature: `invites`

**`invites.dto.ts`**

```typescript
import { z } from 'zod';

export const createInviteSchema = z
  .object({
    phone: z
      .string()
      .regex(/^\+[1-9]\d{1,14}$/, 'Enter a valid international phone number')
      .optional(),
    email: z.string().email('Invalid email').optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: 'Provide either a phone number or email address',
  });
export type CreateInviteSchemaType = z.infer<typeof createInviteSchema>;

export const joinGroupSchema = z.object({
  token: z.string().min(1, 'Invite code is required'),
});
export type JoinGroupSchemaType = z.infer<typeof joinGroupSchema>;

// Response DTOs
export interface InviteDto {
  id: string;
  group_id: string;
  invited_by: string | null;
  phone: string | null;
  email: string | null;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
}
```

**`invites.interface.ts`**

```typescript
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
```

**`invites.mapper.ts`** — `mapInviteFromDto`

**`invites.service.ts`**

```typescript
// createInvite(groupId: string, data: CreateInviteSchemaType): Promise<Invite>   POST /groups/:groupId/invites
// listInvites(groupId: string): Promise<Invite[]>                                GET /groups/:groupId/invites
// cancelInvite(groupId: string, inviteId: string): Promise<void>                 DELETE /groups/:groupId/invites/:inviteId
// joinGroup(token: string): Promise<void>                                         POST /groups/join/:token
```

**Hooks:**

- `use-list-invites.ts` — `useQuery` → `{ invites, isLoading, error, refetch }`
- `use-create-invite.ts` — `useForm<CreateInviteSchemaType>` + `useMutation`, invalidates `GROUP_INVITES` → `{ form, isInviting, createInvite }`
- `use-join-group.ts` — `useForm<JoinGroupSchemaType>` + `useMutation`, invalidates `GROUPS` on success → `{ form, isJoining, joinGroup }`
- `use-cancel-invite.ts` — `useMutation` only → `{ cancelInvite, isCancelling }`

---

### Feature: `pools`

**`pools.dto.ts`**

```typescript
import { z } from 'zod';

export const createPoolSchema = z.object({
  name: z.string().min(1, 'Pool name is required').max(100),
  description: z.string().max(500).optional(),
  memberIds: z.array(z.string().uuid()).min(1, 'Select at least one member'),
});
export type CreatePoolSchemaType = z.infer<typeof createPoolSchema>;

export const updatePoolSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  status: z.enum(['active', 'settled', 'closed']).optional(),
});
export type UpdatePoolSchemaType = z.infer<typeof updatePoolSchema>;

// Response DTOs
export interface PoolDto {
  id: string;
  group_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'settled' | 'closed';
  split_type: string;
  created_by: string | null;
  created_at: string;
}
export interface PoolMemberDto {
  pool_id: string;
  user_id: string;
  joined_at: string;
}
export interface PoolDetailDto extends PoolDto {
  members: PoolMemberDto[];
}
```

**`pools.interface.ts`**

```typescript
export interface Pool {
  id: string;
  groupId: string;
  name: string;
  description: string | null;
  status: 'active' | 'settled' | 'closed';
  splitType: string;
  createdBy: string | null;
  createdAt: Date;
}
export interface PoolMember {
  poolId: string;
  userId: string;
  joinedAt: Date;
}
export interface PoolDetail extends Pool {
  members: PoolMember[];
}
```

**`pools.mapper.ts`** — `mapPoolFromDto`, `mapPoolMemberFromDto`, `mapPoolDetailFromDto`

**`pools.service.ts`**

```typescript
// listGroupPools(groupId: string): Promise<Pool[]>                              GET /groups/:groupId/pools
// getPoolDetail(poolId: string): Promise<PoolDetail>                            GET /pools/:poolId
// createPool(groupId: string, data: CreatePoolSchemaType): Promise<Pool>        POST /groups/:groupId/pools
// updatePool(poolId: string, data: UpdatePoolSchemaType): Promise<Pool>         PUT /pools/:poolId
// addMember(poolId: string, userId: string): Promise<void>                      POST /pools/:poolId/members
// removeMember(poolId: string, userId: string): Promise<void>                   DELETE /pools/:poolId/members/:userId
```

**`pools.state.ts`** — `poolsByGroup: Record<string, Pool[]>`, actions: `setGroupPools`, `addPool`, `updatePool`

**Hooks:**

- `use-group-pools.ts` — `useQuery` → `{ pools, isLoading, error, refetch }`
- `use-pool-detail.ts` — `useQuery` → `{ pool, isLoading, error, refetch }`
- `use-create-pool.ts` — `useForm<CreatePoolSchemaType>` + `useMutation`, invalidates `GROUP_POOLS` → `{ form, isCreating, createPool }`
- `use-update-pool.ts` — `useForm<UpdatePoolSchemaType>` + `useMutation`, invalidates `POOL_DETAIL` → `{ form, isUpdating, updatePool }`
- `use-pool-members.ts` — `useMutation` only for both add and remove → `{ addMember, removeMember, isLoading }`

---

### Feature: `expenses`

**`expenses.dto.ts`**

```typescript
import { z } from 'zod';

export const logExpenseSchema = z
  .object({
    amount: z
      .number({ invalid_type_error: 'Amount must be a number' })
      .positive('Amount must be greater than 0'),
    description: z.string().max(255).optional(),
    categoryId: z.string().uuid().optional(),
    currency: z.enum(['NGN', 'KES', 'GHS', 'ZAR']).default('NGN'),
    isRecurring: z.boolean().default(false),
    recurrenceFrequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).optional(),
    recurrenceEndDate: z.string().datetime().optional(),
  })
  .refine((data) => !data.isRecurring || data.recurrenceFrequency, {
    message: 'Recurrence frequency is required for recurring expenses',
    path: ['recurrenceFrequency'],
  });
export type LogExpenseSchemaType = z.infer<typeof logExpenseSchema>;

// Response DTOs
export interface SplitDto {
  id: string;
  expense_id: string;
  owed_by: string | null;
  amount: string;
  settled: boolean;
  settled_at: string | null;
}
export interface ExpenseDto {
  id: string;
  pool_id: string;
  paid_by: string | null;
  amount: string;
  currency: string;
  description: string | null;
  category_id: string | null;
  receipt_url: string | null;
  created_at: string;
  is_recurring: boolean;
  recurrence_frequency: string | null;
  recurrence_end_date: string | null;
  next_occurrence_at: string | null;
  splits: SplitDto[];
}
export interface ParsedReceiptDto {
  amount: number | null;
  currency: string | null;
  merchant: string | null;
  description: string | null;
  category: string | null;
  date: string | null;
}
export interface ParseReceiptResponseDto {
  parsed: ParsedReceiptDto | null;
  receipt_url: string;
}
```

**`expenses.interface.ts`**

```typescript
export interface Split {
  id: string;
  expenseId: string;
  owedBy: string | null;
  amount: number;
  settled: boolean;
  settledAt: Date | null;
}
export interface Expense {
  id: string;
  poolId: string;
  paidBy: string | null;
  amount: number;
  currency: string;
  description: string | null;
  categoryId: string | null;
  receiptUrl: string | null;
  createdAt: Date;
  isRecurring: boolean;
  recurrenceFrequency: string | null;
  recurrenceEndDate: Date | null;
  nextOccurrenceAt: Date | null;
  splits: Split[];
}
export interface ParsedReceipt {
  amount: number | null;
  currency: string | null;
  merchant: string | null;
  description: string | null;
  category: string | null;
  date: string | null;
}
export interface ParseReceiptResult {
  parsed: ParsedReceipt | null;
  receiptUrl: string;
}
```

**`expenses.mapper.ts`** — `mapSplitFromDto`, `mapExpenseFromDto`, `mapParsedReceiptFromDto`

**`expenses.service.ts`**

```typescript
// listExpenses(poolId: string, params?: PaginationParams): Promise<PaginatedResponse<Expense>>
//   GET /pools/:poolId/expenses
// getExpense(expenseId: string): Promise<Expense>
//   GET /expenses/:expenseId
// logExpense(poolId: string, data: LogExpenseSchemaType, receipt?: Asset): Promise<Expense>
//   POST /pools/:poolId/expenses — multipart/form-data, build FormData from data + file
// parseReceipt(poolId: string, image: Asset): Promise<ParseReceiptResult>
//   POST /pools/:poolId/expenses/parse-receipt — multipart/form-data
// deleteExpense(expenseId: string): Promise<void>
//   DELETE /expenses/:expenseId
// cancelRecurrence(poolId: string, expenseId: string): Promise<void>
//   DELETE /pools/:poolId/expenses/:expenseId/recurrence
// Note: Asset is from react-native-image-picker
```

**`expenses.state.ts`** — Zustand

```typescript
// draftExpense: Partial<LogExpenseSchemaType> & { receiptUrl?: string; parsedReceipt?: ParsedReceipt }
// setDraftExpense(patch): void
// clearDraftExpense(): void
```

**Hooks:**

- `use-pool-expenses.ts` — `useQuery` paginated → `{ expenses, isLoading, error, refetch }`
- `use-expense-detail.ts` — `useQuery` → `{ expense, isLoading, error }`
- `use-log-expense.ts` — `useForm<LogExpenseSchemaType>` + `useMutation`, invalidates `POOL_EXPENSES` and `POOL_BALANCES` → `{ form, isLogging, logExpense }`. The mutation receives the form data and any staged receipt image separately
- `use-parse-receipt.ts` — `useMutation` only (user picks an image, not a form field) → `{ parseReceipt, result, isParsing }`. On success, calls `expenses.state.setDraftExpense({ parsedReceipt, receiptUrl })`
- `use-delete-expense.ts` — `useMutation` only → `{ deleteExpense, isDeleting }`
- `use-cancel-recurrence.ts` — `useMutation` only → `{ cancelRecurrence, isCancelling }`

---

### Feature: `balances`

**`balances.dto.ts`**

```typescript
export interface BalanceEntryDto {
  from: { id: string; name: string };
  to: { id: string; name: string };
  amount: number;
  currency: string;
}
export interface MemberSummaryDto {
  user: { id: string; name: string };
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}
export interface PoolBalancesDto {
  balances: BalanceEntryDto[];
  memberSummary: MemberSummaryDto[];
}
```

No Zod schemas needed — balances has no user input, it is read-only.

**`balances.interface.ts`**

```typescript
import type { UserSummary } from '@/features/user/user.interface';
export interface BalanceEntry {
  from: UserSummary;
  to: UserSummary;
  amount: number;
  currency: string;
}
export interface MemberSummary {
  user: UserSummary;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}
export interface PoolBalances {
  balances: BalanceEntry[];
  memberSummary: MemberSummary[];
}
```

**`balances.mapper.ts`** — `mapPoolBalancesFromDto`

**`balances.service.ts`** — `getPoolBalances(poolId): Promise<PoolBalances>` — GET /pools/:poolId/balances

**`hooks/use-pool-balances.ts`** — `useQuery` → `{ balances, memberSummary, myNetBalance, myDebts, isLoading, error, refetch }`
Derives `myNetBalance` and `myDebts` from the current user id (read from `auth.state`).

---

### Feature: `settlements`

**`settlements.dto.ts`**

```typescript
import { z } from 'zod';

export const submitSettlementSchema = z.object({
  toUserId: z.string().uuid('Invalid user'),
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(500).optional(),
});
export type SubmitSettlementSchemaType = z.infer<typeof submitSettlementSchema>;

export const disputeSettlementSchema = z.object({
  reason: z.string().min(1, 'Please describe why you are disputing').max(500),
});
export type DisputeSettlementSchemaType = z.infer<typeof disputeSettlementSchema>;

// Response DTOs
export interface SettlementDto {
  id: string;
  pool_id: string | null;
  from_user: string | null;
  to_user: string | null;
  amount: string;
  currency: string;
  proof_url: string | null;
  note: string | null;
  status: 'pending_verification' | 'settled' | 'disputed';
  disputed_reason: string | null;
  confirmed_at: string | null;
  created_at: string;
}
```

**`settlements.interface.ts`**

```typescript
export type SettlementStatus = 'pending_verification' | 'settled' | 'disputed';
export interface Settlement {
  id: string;
  poolId: string | null;
  fromUser: string | null;
  toUser: string | null;
  amount: number;
  currency: string;
  proofUrl: string | null;
  note: string | null;
  status: SettlementStatus;
  disputedReason: string | null;
  confirmedAt: Date | null;
  createdAt: Date;
}
```

**`settlements.mapper.ts`** — `mapSettlementFromDto`

**`settlements.service.ts`**

```typescript
// listSettlements(poolId: string): Promise<Settlement[]>                       GET /pools/:poolId/settlements
// getSettlement(settlementId: string): Promise<Settlement>                     GET /settlements/:settlementId
// submitSettlement(poolId, data: SubmitSettlementSchemaType, proof: Asset): Promise<Settlement>
//   POST /pools/:poolId/settlements — multipart/form-data
// confirmSettlement(settlementId: string): Promise<void>                       POST /settlements/:settlementId/confirm
// disputeSettlement(settlementId: string, reason: string): Promise<void>       POST /settlements/:settlementId/dispute
```

**`settlements.state.ts`** — `pendingSettlements: Settlement[]`, actions: `setPendingSettlements`, `removeSettlement`

**Hooks:**

- `use-pool-settlements.ts` — `useQuery` → `{ settlements, isLoading, error, refetch }`
- `use-settlement-detail.ts` — `useQuery` → `{ settlement, isLoading, error }`
- `use-submit-settlement.ts` — `useForm<SubmitSettlementSchemaType>` + `useMutation`, invalidates `POOL_SETTLEMENTS` and `POOL_BALANCES` → `{ form, isSubmitting, submitSettlement }`. Proof image is passed separately into the mutation alongside form data
- `use-confirm-settlement.ts` — `useMutation` only → `{ confirmSettlement, isConfirming }`
- `use-dispute-settlement.ts` — `useForm<DisputeSettlementSchemaType>` + `useMutation` → `{ form, isDisputing, disputeSettlement }`

---

### Feature: `notifications`

**`notifications.dto.ts`**

No Zod schemas needed — notifications has no user input request bodies.

```typescript
export interface NotificationDto {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
export interface NotificationsResponseDto {
  items: NotificationDto[];
  total_items: number;
  page: number;
  limit: number;
  pages: number;
  unread: number;
}
```

**`notifications.interface.ts`**

```typescript
export type NotificationType =
  | 'invite.received'
  | 'expense.created'
  | 'settlement.submitted'
  | 'settlement.confirmed'
  | 'settlement.disputed'
  | 'member.joined'
  | string;
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}
```

**`notifications.mapper.ts`** — `mapNotificationFromDto`

**`notifications.service.ts`**

```typescript
// listNotifications(params?: PaginationParams): Promise<{ items: Notification[]; unread: number } & PaginatedResponse<Notification>>
// markRead(id: string): Promise<void>      PATCH /notifications/:id/read
// markAllRead(): Promise<void>             PATCH /notifications/read-all
```

**`notifications.state.ts`** — `unreadCount: number`, actions: `setUnreadCount`, `decrementUnread`, `clearUnread`

**Hooks:**

- `use-notifications.ts` — `useQuery` → `{ notifications, unreadCount, isLoading, error, refetch }`
- `use-mark-read.ts` — `useMutation` only, decrements `notifications.state.unreadCount` on success → `{ markRead, isMarking }`
- `use-mark-all-read.ts` — `useMutation` only, clears `notifications.state.unreadCount` on success → `{ markAllRead, isMarking }`

---

### Feature: `categories`

**`categories.dto.ts`**

No Zod schemas — read-only feature.

```typescript
export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  emoji: string;
  group: string;
  is_active: boolean;
}
```

**`categories.interface.ts`**

```typescript
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  emoji: string;
  group: string;
  isActive: boolean;
}
```

**`categories.mapper.ts`** — `mapCategoryFromDto`

**`categories.service.ts`**

```typescript
// listCategories(): Promise<Category[]>                GET /categories
// getCategory(categoryId: string): Promise<Category>  GET /categories/:categoryId
```

**`categories.state.ts`** — `categories: Category[]`, actions: `setCategories`

**`hooks/use-categories.ts`** — `useQuery`, fetches once and caches → `{ categories, isLoading, error }`

---

### Feature: `webhooks`

**`webhooks.dto.ts`**

```typescript
import { z } from 'zod';

export const webhookEventTypes = [
  'group.created',
  'member.invited',
  'member.joined',
  'member.removed',
  'pool.created',
  'pool.settled',
  'pool.member_added',
  'expense.created',
  'expense.deleted',
  'settlement.submitted',
  'settlement.confirmed',
  'settlement.disputed',
] as const;
export type WebhookEventType = (typeof webhookEventTypes)[number];

export const registerWebhookSchema = z.object({
  url: z.string().url('Enter a valid HTTPS URL'),
  events: z.array(z.enum(webhookEventTypes)).min(1, 'Select at least one event'),
});
export type RegisterWebhookSchemaType = z.infer<typeof registerWebhookSchema>;

// Response DTOs
export interface WebhookDto {
  id: string;
  group_id: string;
  url: string;
  events: WebhookEventType[];
  created_by: string | null;
  created_at: string;
  secret?: string;
}
```

**`webhooks.interface.ts`**

```typescript
export interface Webhook {
  id: string;
  groupId: string;
  url: string;
  events: WebhookEventType[];
  createdBy: string | null;
  createdAt: Date;
  secret?: string;
}
```

**`webhooks.mapper.ts`** — `mapWebhookFromDto`

**`webhooks.service.ts`**

```typescript
// listWebhooks(groupId: string): Promise<Webhook[]>                              GET /groups/:groupId/webhooks
// registerWebhook(groupId: string, data: RegisterWebhookSchemaType): Promise<Webhook>  POST /groups/:groupId/webhooks
// deleteWebhook(groupId: string, webhookId: string): Promise<void>               DELETE /groups/:groupId/webhooks/:webhookId
```

**Hooks:**

- `use-group-webhooks.ts` — `useQuery` → `{ webhooks, isLoading, error, refetch }`
- `use-register-webhook.ts` — `useForm<RegisterWebhookSchemaType>` + `useMutation`, invalidates `GROUP_WEBHOOKS` → `{ form, isRegistering, registerWebhook }`
- `use-delete-webhook.ts` — `useMutation` only → `{ deleteWebhook, isDeleting }`

---

## What Claude Code Must NOT Do

- Do not create any files inside `components/` or `screens/` folders — only create the empty folders
- Do not write any JSX in service, state, mapper, dto, or hook files
- Do not install packages not listed in the dependencies section
- Do not create new top-level folders outside `src/core/`, `src/features/`, and `src/navigation/`
- Do not modify `app.json`, `ios/`, or `android/`
- Do not add screen files to the navigation files — use `const PlaceholderScreen = () => null` for all screen references
- Do not define Zod schemas inside hook files — schemas belong in `.dto.ts` files only

## Post-Scaffold Checklist

After creating all files:

1. `npm run lint`
2. `npm run format:check`
3. `npx tsc --noEmit`
4. Report all created files with their exact paths
