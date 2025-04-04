export interface cert {
  id: number;
  expires_on?: Date;
  description: string;
  comment: string;
  link: string;
  is_expired: boolean;
  color: string;
  type_name?: string;
  subtype_name?: string;
  cert_name?: string;
};

export interface display_cert {
  type: string;
  description: string;
  color: string;
  count: number;
};

export interface member_cert_summary {
  id: number;
  full_name: string;
  status: string;
  status_order: number;
  certs: display_cert[];
};

export function certFromResponse(response: any): cert {
  return {
    ...response,
    expires_on: response.expires_on ? new Date(response.expires_on) : null,
  };
}

export function displayCertFromResponse(response: any): display_cert {
  return {
    ...response,
  };
}

export function memberCertSummaryFromResponse(response: any): member_cert_summary {
  return {
    ...response,
    certs: response.certs?.map(displayCertFromResponse),
  };
}
