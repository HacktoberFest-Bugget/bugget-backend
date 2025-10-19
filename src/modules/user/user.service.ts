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

  async getKey(dto: MeDto) {
    try {
      const result = await this.userRepository.findOneBy({
        email: dto.email,
      });

      // @ts-ignore
      return result?.api_key ?? null;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Key not found');
    }
  }

  async generateKey(dto: GenerateKeyDto): Promise<void> {
    try {
      const existKey = await this.userRepository.findOneBy({
        email: dto.email,
      });

      const hash = crypto.createHash('sha256').update(dto.email).digest('hex');

      if (existKey) {
        await this.userRepository.delete({ id: existKey.id });
      }

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
