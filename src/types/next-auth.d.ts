import 'next-auth';

declare module 'next-auth' {
  export interface User extends UserDataType {
    id?: string;
    at?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: null;
    address?: string;
    balance?: number;
  }

  export interface Session {
    at?: string;
    user: User;
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    at?: string;
  }
}
