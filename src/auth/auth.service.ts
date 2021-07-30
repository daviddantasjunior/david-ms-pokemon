import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(input: AuthInput): Promise<AuthType> {
    const user = await this.userService.findByLoginUser(input.nickname);

    const validPassword = this.validateCredentials(input.password, user);

    if (!validPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    const token = await this.jwtToken(user);

    return {
      user,
      token,
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = { name: user.nickname, sub: user._id };

    return this.jwtService.signAsync(payload);
  }

  private async validateCredentials(
    password: string,
    user: User,
  ): Promise<boolean> {
    return await compareSync(password, user.password);
  }
}
