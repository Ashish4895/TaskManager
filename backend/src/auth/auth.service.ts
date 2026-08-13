import type { Profile } from 'passport-google-oauth20';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import type { Response } from 'express';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { jwtCookieOptions } from './jwt-cookie.options';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private setTokenCookie(res: Response, userId: string) {
    const token = this.jwtService.sign({ userId });
    res.cookie('jwt', token, jwtCookieOptions(this.configService));
  }

  private sanitizeUser(user: UserDocument) {
    return {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isGuest: user.isGuest,
    };
  }

  async signup(dto: SignupDto, res: Response) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
    });

    this.setTokenCookie(res, user.id);
    return this.sanitizeUser(user);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.setTokenCookie(res, user.id);
    return this.sanitizeUser(user);
  }

  async guestLogin(res: Response) {
    const id = randomUUID().slice(0, 8);
    const password = randomUUID();
    const user = await this.userModel.create({
      fullName: `Guest ${id}`,
      email: `guest-${id}@guest.local`,
      password: await bcrypt.hash(password, 10),
      isGuest: true,
    });

    this.setTokenCookie(res, user.id);
    return this.sanitizeUser(user);
  }

  logout(res: Response) {
    res.clearCookie('jwt', jwtCookieOptions(this.configService));
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async findOrCreateGoogleUser(profile: Profile) {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    const googleId = profile.id;
    const photo = profile.photos?.[0]?.value ?? '';
    const fullName = profile.displayName?.trim() || email.split('@')[0];

    let user = await this.userModel.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      if (!user.googleId) user.googleId = googleId;
      if (photo && !user.profilePic) user.profilePic = photo;
      if (user.isModified()) await user.save();
      return user;
    }

    try {
      return await this.userModel.create({
        email,
        fullName,
        password: await bcrypt.hash(randomUUID(), 10),
        googleId,
        profilePic: photo,
      });
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw err;
    }
  }

  completeOAuthLogin(userId: string, res: Response) {
    this.setTokenCookie(res, userId);
    const redirect =
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    res.redirect(`${redirect}/tasks`);
  }
}
