import { ConfigService } from '@nestjs/config';
import type { CookieOptions } from 'express';

export function jwtCookieOptions(config: ConfigService): CookieOptions {
  const isProd = config.get('NODE_ENV') === 'production';
  return {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProd,
    // Cross-origin frontend (Vercel) + API (Render) requires SameSite=None
    sameSite: isProd ? 'none' : 'lax',
  };
}
