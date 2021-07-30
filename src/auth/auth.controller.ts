import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @EventPattern('auth-login')
  public async login(@Payload() input: AuthInput): Promise<AuthType> {
    const { user, token } = await this.authService.validateUser(input);

    return { user, token };
  }
}
