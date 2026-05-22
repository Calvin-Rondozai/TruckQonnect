/** Auth screens — matches login/sign-up mockup palette */
export const AUTH = {
  yellow: '#F5C518',
  yellowDeep: '#E6A800',
  yellowLight: '#FFF8DC',
  black: '#1A1A1A',
  white: '#FFFFFF',
  gray100: '#F7F7F7',
  gray200: '#EBEBEB',
  gray400: '#BBBBBB',
  gray500: '#888888',
  gray700: '#444444',
  ink: '#1F1F1F',
  inputBg: '#F2F2F2',
  red: '#E53935',
  redLight: '#FFEBEE',
} as const;

/** Mask phone for OTP subtitle, e.g. +263 77 *** **** */
export function maskPhoneNumber(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return '+263 78 *** ****';
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length <= 4) return trimmed;
  const prefix = trimmed.startsWith('+') ? trimmed.slice(0, Math.min(8, trimmed.length)) : trimmed.slice(0, 6);
  return `${prefix} *** ****`;
}
