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

  private readonly prompt = `You are an expert technical writer and software analyst. INPUT: You will receive a git diff. TASK: Analyze the git diff and produce a Markdown (.md) document that summarizes ONLY the MAJOR NEW FEATURES or SIGNIFICANT FUNCTIONAL ADDITIONS. Completely ignore and exclude minor edits such as: - Small UI changes - Bug fixes - Refactors or code cleanup - Comment, indentation, or formatting changes OUTPUT FORMAT (Markdown): # CHANGE SUMMARY A short overview (2–3 sentences) summarizing the main purpose and scope of the major updates. --- ## New Feature: [Feature or Module Name] A clear and concise explanation (3–6 sentences) describing: - What this feature or addition does - Why it was introduced - How it impacts the system or functionality If helpful for understanding, include ONE short representative code snippet in fenced code blocks showing the most important part of the new feature. Only include it if absolutely necessary. Repeat this section for EACH major new feature or addition. --- RULES: - Focus only on meaningful, functional, or architectural changes. - Use Markdown syntax properly (#, ##, code blocks, etc.). - Be objective, technical, and concise. - The final output should be a complete Markdown document ready for documentation or changelog usage. - do not focus on changes made in terms of documentation, if so just give a small indicator at the top that docs were updated`;

  async create(dto: CreateDocumentationDto): Promise<void> {
    try {
      const filename = `${dto.fromBranch}.md`;
      const difference = await this.simpleGitService.getDiff(dto);
      const result = await this.openaiService.prompt(
        `This is my expected output from you: ${this.prompt}.\n
        this is git difference: ${JSON.stringify(difference)}`,
      );
      console.log(result);

      const existRecord = await this.fileRepository.findOneBy({ filename });

      const repositoryName = dto.repository.split('/')[1];

      await this.fileRepository.insert({
        id: existRecord?.id ?? undefined,
        repository: repositoryName,
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
        .where('repository = :repository', { repository: 'bugget-backend' })
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
