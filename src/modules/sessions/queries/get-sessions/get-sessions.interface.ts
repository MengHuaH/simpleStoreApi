import { UserSession } from '@/entities/userSession.entity';

export interface GetSessionsResult {
  sessions: UserSession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}