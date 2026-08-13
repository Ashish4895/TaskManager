import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthConfig } from '../google-auth.config';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private googleAuthConfig: GoogleAuthConfig) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (!this.googleAuthConfig.isEnabled()) {
      throw new ServiceUnavailableException('Google login is not configured');
    }
    return super.canActivate(context);
  }

  getAuthenticateOptions() {
    return { failureRedirect: this.googleAuthConfig.failureRedirect() };
  }
}
