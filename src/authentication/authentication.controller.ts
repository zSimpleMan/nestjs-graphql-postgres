import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { LocalAuth } from "./local-authentication.guard";

@Controller('auth')
export class AuthenticationController {
  constructor (
    private readonly authenticationService: AuthenticationService
  ) {}

  @UseGuards(LocalAuth)
  @Post('log-in')
  async logIn (@Req() req) {
    const token = await this.authenticationService.generateToken(req.user.email)

    return { token }
  }
}