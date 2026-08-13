import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthConfig } from './google-auth.config';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleAuthConfig,
    GoogleAuthGuard,
    {
      provide: GoogleStrategy,
      useFactory: (config: ConfigService, authService: AuthService) => {
        const id = config.get<string>('GOOGLE_CLIENT_ID');
        const secret = config.get<string>('GOOGLE_CLIENT_SECRET');
        if (!id?.trim() || !secret?.trim()) return null;
        return new GoogleStrategy(config, authService);
      },
      inject: [ConfigService, AuthService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
