import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const apiKey: string = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('No api key provided!');
    }

    const validation = await this.userRepository.findOneBy({ api_key: apiKey });

    if (!validation) {
      throw new UnauthorizedException('Invalid api key!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.user = validation.email;

    return true;
  }
}
