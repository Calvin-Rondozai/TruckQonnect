import { AUTH_API_PREFIX } from '@/lib/api-config';
import type { UserRole } from '@/lib/owner-types';

export type AuthUser = {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: UserRole;
  role_label: string;
  city: string;
  company: string;
  avatar_url: string | null;
  is_verified: boolean;
  truck?: {
    plate_number: string;
    brand: string;
    size_capacity: string;
    truck_type: string;
  };
};

export type OtpPendingResponse = {
  message: string;
  email: string;
  email_masked: string;
  role: UserRole;
  requires_otp: boolean;
  otp_delivery?: 'console' | 'email';
  dev_otp?: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
  tokens: { access: string; refresh: string };
};

export type VerifyOtpResponse = LoginResponse;

export class ApiError extends Error {
  fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.fieldErrors = fieldErrors;
  }
}

function parseErrorBody(body: unknown): { message: string; fieldErrors: Record<string, string> } {
  if (!body || typeof body !== 'object') {
    return { message: 'Something went wrong. Please try again.', fieldErrors: {} };
  }
  const record = body as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};

  for (const [key, value] of Object.entries(record)) {
    if (key === 'detail' || key === 'message') continue;
    if (Array.isArray(value) && typeof value[0] === 'string') {
      fieldErrors[key] = value[0];
    } else if (typeof value === 'string') {
      fieldErrors[key] = value;
    }
  }

  const detail = record.detail;
  let message = 'Something went wrong. Please try again.';
  if (typeof detail === 'string') {
    message = detail;
  } else if (Array.isArray(detail) && typeof detail[0] === 'string') {
    message = detail[0];
  } else if (typeof record.message === 'string') {
    message = record.message;
  } else if (Object.keys(fieldErrors).length > 0) {
    message = Object.values(fieldErrors)[0];
  }

  return { message, fieldErrors };
}

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${AUTH_API_PREFIX}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const { message, fieldErrors } = parseErrorBody(body);
    throw new ApiError(message, fieldErrors);
  }
  return body as T;
}

export type RegisterInput = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
  role: UserRole;
  company?: string;
  truck?: {
    plate_number: string;
    brand: string;
    size_capacity: string;
    truck_type: string;
  };
};

export function registerAccount(payload: RegisterInput): Promise<OtpPendingResponse> {
  return authFetch<OtpPendingResponse>('/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginAccount(
  email: string,
  password: string,
  role: UserRole
): Promise<LoginResponse> {
  return authFetch<LoginResponse>('/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
}

export function verifyOtp(email: string, code: string): Promise<VerifyOtpResponse> {
  return authFetch<VerifyOtpResponse>('/otp/verify/', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export function resendOtp(
  email: string
): Promise<{ message: string; email_masked?: string; dev_otp?: string }> {
  return authFetch('/otp/resend/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export type PasswordResetOtpResponse = {
  message: string;
  email: string;
  reset_token: string;
};

export function requestPasswordReset(
  email: string
): Promise<{ message: string; email_masked?: string; otp_delivery?: 'console' | 'email'; dev_otp?: string }> {
  return authFetch('/password/forgot/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function verifyPasswordResetOtp(
  email: string,
  code: string
): Promise<PasswordResetOtpResponse> {
  return authFetch<PasswordResetOtpResponse>('/password/verify-otp/', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export function resendPasswordResetOtp(
  email: string
): Promise<{ message: string; email_masked?: string; otp_delivery?: 'console' | 'email'; dev_otp?: string }> {
  return authFetch('/password/resend-otp/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(
  email: string,
  resetToken: string,
  password: string,
  passwordConfirm: string
): Promise<{ message: string }> {
  return authFetch('/password/reset/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      reset_token: resetToken,
      password,
      password_confirm: passwordConfirm,
    }),
  });
}

export function fetchMe(): Promise<AuthUser> {
  return authFetch<AuthUser>('/me/');
}
