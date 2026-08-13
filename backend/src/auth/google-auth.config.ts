import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthConfig {
  constructor(private config: ConfigService) {}

  isEnabled() {
    return Boolean(
      this.config.get<string>('GOOGLE_CLIENT_ID') &&
        this.config.get<string>('GOOGLE_CLIENT_SECRET'),
    );
  }

  failureRedirect() {
    const base = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    return `${base}/login?error=google`;
  }

  successRedirect() {
    const base = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    return `${base}/tasks`;
  }
}
