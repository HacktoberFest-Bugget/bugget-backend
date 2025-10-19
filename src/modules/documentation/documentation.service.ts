import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { SimpleGitService } from '../simple-git/simple-git.service';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class DocumentationService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly simpleGitService: SimpleGitService,
    private readonly openaiService: OpenaiService,
  ) {}

  async create(dto: CreateDocumentationDto): Promise<void> {
    try {
      const filename = `${dto.fromBranch}.md`;
      const difference = this.simpleGitService.getDiff(dto);

      const result = await this.openaiService.prompt(
        `Write human readable changes for me. I want confluence like docs not just code difference docs. using this git difference: ${difference}`,
      );

      const existRecord = await this.fileRepository.findOneBy({ filename });

      await this.fileRepository.insert({
        id: existRecord?.id ?? undefined,
        repository: dto.repository,
        content: result,
        filename: filename,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not create document');
    }
  }

  async findAll(): Promise<Array<Partial<FileEntity>>> {
    try {
      return (await this.fileRepository
        .createQueryBuilder()
        .select('id, filename')
        .where('repository = :repository', { repository: 'bugget_backend' })
        .execute()) as Array<Partial<FileEntity>>;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not find documents');
    }
  }

  async findOne(id: string): Promise<FileEntity> {
    try {
      return await this.fileRepository.findOneByOrFail({ id });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not find documents');
    }
  }
}
