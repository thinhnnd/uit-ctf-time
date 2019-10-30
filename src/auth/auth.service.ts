import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    const user = await this.usersService.findOneByEmail(payload.email);
    if (user && user.password === payload.password) {
        const userRO = { username: user.email, role: user.role }
        return userRO;
    }
    return null;
  }

  async signPayload(payload: any) {
      return this.jwtService.sign(payload);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
