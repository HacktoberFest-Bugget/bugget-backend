import { Module } from '@nestjs/common';
import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { SimpleGitModule } from '../simple-git/simple-git.module';
import { OpenaiModule } from '../openai/openai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    SimpleGitModule,
    OpenaiModule,
  ],
  controllers: [DocumentationController],
  providers: [DocumentationService],
})
export class DocumentationModule {}
