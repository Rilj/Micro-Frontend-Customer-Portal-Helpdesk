import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || "super-secret-access-key",
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
    }),
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
