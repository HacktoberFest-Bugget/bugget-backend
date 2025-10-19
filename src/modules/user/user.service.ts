import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { GenerateKeyDto } from './dto/generate-key.dto';
import * as crypto from 'node:crypto';
import { MeDto } from './dto/me.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getKey(dto: MeDto): Promise<string> {
    try {
      const result = await this.userRepository.findOneByOrFail({
        email: dto.email,
      });

      return result.api_key;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Key not found');
    }
  }

  async generateKey(dto: GenerateKeyDto): Promise<void> {
    try {
      const hash = crypto.createHash('sha256').update(dto.email).digest('hex');

      await this.userRepository.insert({
        email: dto.email,
        api_key: hash,
        repositories: ['bugget-backend', 'bugget-frontend'],
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not generate key');
    }
  }
}
