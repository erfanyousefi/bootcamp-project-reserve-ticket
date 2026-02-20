import {Body, Controller, Post} from "@nestjs/common";
import AuthService from "./auth.service";
import SendOtpDto from "./dto/send-otp";

@Controller("/auth")
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/send-otp")
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }
}
