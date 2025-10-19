import { Module } from '@nestjs/common';
import { SimpleGitService } from './simple-git.service';

@Module({
  providers: [SimpleGitService],
  exports: [SimpleGitService],
})
export class SimpleGitModule {}
