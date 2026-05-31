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

/** Mask email for OTP subtitle, e.g. j***e@example.com */
export function maskEmailAddress(email: string): string {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes('@')) return 'your email';
  const [local, domain] = trimmed.split('@');
  if (!local || !domain) return trimmed;
  const maskedLocal =
    local.length <= 2 ? `${local[0] ?? ''}***` : `${local[0]}***${local[local.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}
