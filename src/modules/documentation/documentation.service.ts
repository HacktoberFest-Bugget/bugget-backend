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

  private readonly prompt = `You are a documentation formatter AI.  
Your task is to analyze a given git diff or merge commit and output a structured Markdown document strictly following the format below.  

Do NOT include any extra commentary or explanations.  
Only output the formatted Markdown.  
Follow headings, indentation, and line breaks exactly as shown.

---

# CHANGE SUMMARY
Repository: <repository_name>  
Branch: <branch_name>  
Commits: <commit_hashes>  
Merged by: <username>  
Date: <date>

---

## OVERVIEW
<Provide a short, high-level summary (2–4 sentences) describing what changed and why.>

---

## FILES CHANGED
| File | Type of Change | Lines Added | Lines Removed |
|------|----------------|-------------|---------------|
| <path/to/file> | <Added/Modified/Deleted> | +<n> | -<n> |
| <path/to/file> | <Added/Modified/Deleted> | +<n> | -<n> |

---

## DETAILED ANALYSIS

### Functional Changes
- <List each significant functional or behavioral change detected.>

### Logic Impact
- <Describe how the changes affect existing logic, behavior, or flow.>

### Potential Risks
- <List possible bugs, regressions, or risks introduced.>

### Dependencies
- Added dependency: \`<name>@<version>\`  
- Removed dependency: \`<name>\`  

---

## CODE SNIPPETS (KEY DIFFS)
\`\`\`diff
<insert one or more representative code diff snippets showing key changes>`;

  async create(dto: CreateDocumentationDto): Promise<void> {
    try {
      const filename = `${dto.fromBranch}.md`;
      const difference = this.simpleGitService.getDiff(dto);

      const result = await this.openaiService.prompt(
        `This is my expected ouput from you: ${this.prompt}, this is git difference${difference}`,
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
