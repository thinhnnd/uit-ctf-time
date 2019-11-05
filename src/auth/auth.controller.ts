import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto, UserDto } from '../users/dto/user.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService, 
      private readonly usersService: UsersService) {}


  @Post('login')
  async login(@Body() userLogin: LoginDto) {
    const user = await this.usersService.findByLoginInput(userLogin);
    const payload = { email: user.email, role: user.role, id: user._id}
    const token = await this.authService.signPayload(payload);
    // console.log(token);
    return { ...user, token};
  }

  @Post('register')
  async register(@Body() userInfo: UserDto) {
    return await this.usersService.createUser(userInfo);
  }


}
