import '@storage/global';

export interface user {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  mobile_phone?: string;
};

export function userToString(user: user): string {
  if (!user)
    return 'System';
  return user.full_name;
}

function stringEqualsIgnoreCase(a: string, b: string): boolean {
  return a.localeCompare(b, 'en', { sensitivity: 'accent' }) === 0;
}

export function isUserSelf(user: user): boolean {
  if (!user)
    return false;

  if (global.currentCredentials) {
    // console.log(global.currentCredentials, user);
    if (global.currentCredentials.username) {
      return stringEqualsIgnoreCase(global.currentCredentials.username, user.username);
    }
  }

  return false;
}
