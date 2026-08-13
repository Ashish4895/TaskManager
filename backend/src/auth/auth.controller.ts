import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { GoogleAuthConfig } from './google-auth.config';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import type { AuthenticatedRequest } from './types/authenticated-request';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthConfig: GoogleAuthConfig,
  ) {}

  @Get('google/enabled')
  googleEnabled() {
    return { enabled: this.googleAuthConfig.isEnabled() };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    return this.authService.completeOAuthLogin(req.user.userId, res);
  }

  @Post('signup')
  signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signup(dto, res);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Post('guest')
  guest(@Res({ passthrough: true }) res: Response) {
    return this.authService.guestLogin(res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.userId);
  }
}
