import type { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
      customerId: number;
      tenantId?: number;
      userId?: string;
      email?: string;
    };
  }
}
