import { AuthGuard } from '@nestjs/passport';

export class RTGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
