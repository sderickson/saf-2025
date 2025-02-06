// Extend Express.User
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      createdAt: Date;
      lastLoginAt: Date | null;
    }
  }
}

export type User = Express.User;
