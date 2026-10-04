import { Controller, Post, Body, Get, Put, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("auth")
@Controller("auth")
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name
    );
  }

  @Post("refresh-token")
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Request() req) {
    const { passwordHash, ...user } = req.user;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: "Logged out successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(@Request() req, @Body() body: any) {
    return req.user;
  }
}
