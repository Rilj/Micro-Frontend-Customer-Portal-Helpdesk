import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as JwtPassportStrategy, VerifyCallback } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../user/user.service";

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_SECRET") || "super-secret-access-key"
    });
  }

  async validate(payload: JwtPayload, done: VerifyCallback): Promise<any> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
