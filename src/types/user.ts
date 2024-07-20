import '@storage/global';

export interface user {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  mobile_phone?: string;
};

export interface user_detail extends user {
  status: string;
  status_order: number;
  is_current: boolean;
}

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

export function userDetailsFromResponse(memberResonse: any): user_detail {
  return {
    mobile_phone: memberResonse.display_phone,
    first_name: memberResonse.short_name,
    ...memberResonse,
  };
}
