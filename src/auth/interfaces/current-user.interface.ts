export interface CurrentUser {
  id: string;
  email: string;
  sessiontoken?: string;
  memberid?: string;
  userType?: string;
  role?: string;
  isAdmin?: boolean;
}
