import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../user/user.service";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export interface TokenResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    createdAt: string;
  };
  token: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.usersService.updateLastLogin(user.id);
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const user = await this.validateUser(email, password);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "7d"
    });

    await this.usersService.storeRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatarUrl,
        createdAt: user.createdAt.toISOString()
      },
      token,
      refreshToken
    };
  }

  async register(email: string, password: string, name: string): Promise<TokenResponse> {
    const bcryptRounds = this.configService.get<string>("BCRYPT_ROUNDS") || "12";
    const hashedPassword = await bcrypt.hash(password, parseInt(bcryptRounds));

    const user = await this.usersService.create({
      email,
      passwordHash: hashedPassword,
      name
    });

    return this.login(email, password);
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET")
    });

    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const isValid = await this.usersService.validateRefreshToken(user.id, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const newPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = await this.jwtService.signAsync(newPayload);
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "7d"
    });

    await this.usersService.storeRefreshToken(user.id, newRefreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatarUrl,
        createdAt: user.createdAt.toISOString()
      },
      token,
      refreshToken: newRefreshToken
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.invalidateRefreshTokens(userId);
  }
}
