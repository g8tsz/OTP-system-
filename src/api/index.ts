import { env } from '@/config/env';
import { httpAuthService } from '@/api/httpAuthService';
import { mockAuthService } from '@/api/mockAuthService';
import type { AuthService } from '@/api/types';

export const authService: AuthService = env.useMockApi ? mockAuthService : httpAuthService;
