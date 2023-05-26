import { AuthGuard } from '@nestjs/passport';

// custom guard, because using string is error prone
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
