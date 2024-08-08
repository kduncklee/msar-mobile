export interface phone {
  id: number;
  number: string;
  type: string;
  position: number;
}

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
  phone_numbers: phone[];
}

export function userToString(user: user): string {
  if (!user)
    return 'System';
  return user.full_name;
}

function stringEqualsIgnoreCase(a: string, b: string): boolean {
  return a.localeCompare(b, 'en', { sensitivity: 'accent' }) === 0;
}

export function isUserSelf(user: user, self_username: string): boolean {
  if (!user)
    return false;

  if (self_username) {
    return stringEqualsIgnoreCase(self_username, user.username);
  }

  return false;
}

function phoneFromResponse(response) {
  return {
    ...response,
    number: response.display_number,
  };
}

export function userDetailsFromResponse(memberResponse: any): user_detail {
  return {
    ...memberResponse,
    mobile_phone: memberResponse.display_phone,
    first_name: memberResponse.short_name,
    phone_numbers: memberResponse.phone_set?.map(phoneFromResponse),
  };
}
