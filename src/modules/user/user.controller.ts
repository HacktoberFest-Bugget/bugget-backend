import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GenerateKeyDto } from './dto/generate-key.dto';
import { MeDto } from './dto/me.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@Query() dto: MeDto) {
    return {
      key: await this.userService.getKey(dto),
    };
  }

  @Post('generate-key')
  async generateKey(@Body() dto: GenerateKeyDto) {
    await this.userService.generateKey(dto);
  }
}
