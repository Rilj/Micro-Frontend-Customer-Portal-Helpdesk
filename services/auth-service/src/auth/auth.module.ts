import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { UserModule } from "../user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Module({
    imports: [
     UserModule,
    JwtModule.register({})
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}
