import { Module } from '@nestjs/common';
import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { SimpleGitModule } from '../simple-git/simple-git.module';
import { OpenaiModule } from '../openai/openai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, UserEntity]),
    SimpleGitModule,
    OpenaiModule,
  ],
  controllers: [DocumentationController],
  providers: [DocumentationService],
})
export class DocumentationModule {}
