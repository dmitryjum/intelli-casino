import { Role } from '@prisma/client';

export interface UserContextType {
  userRole: Role;
  setUserRole: (role: Role) => void;
  userId: string;
}