import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "customer" | "agent" | "admin";
  avatarUrl?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(private readonly configService: ConfigService) {}

  async create(data: Partial<User>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email!,
      passwordHash: data.passwordHash!,
      name: data.name!,
      role: data.role || "customer",
      avatarUrl: data.avatarUrl,
      phone: data.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);
    return { ...user };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async updateLastLogin(userId: string): Promise<void> {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.lastLoginAt = new Date();
    }
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    console.log(`[UsersService] Refresh token stored for user ${userId}`);
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    return true;
  }

  async invalidateRefreshTokens(userId: string): Promise<void> {
    console.log(`[UsersService] Refresh tokens invalidated for user ${userId}`);
  }

  async findOneWithProfile(id: string): Promise<Partial<User>> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return {};
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
