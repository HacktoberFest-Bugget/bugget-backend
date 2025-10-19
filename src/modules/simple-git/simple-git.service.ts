import { BadRequestException, Injectable } from '@nestjs/common';
import simpleGit from 'simple-git';
import { GetDiffDto } from './dto/get-diff.dto';
import * as path from 'node:path';

@Injectable()
export class SimpleGitService {
  getDiff(dto: GetDiffDto): string {
    try {
      const repository = path.resolve(__dirname);
      const git = simpleGit(repository);

      const result = git.diff([dto.fromBranch, dto.toBranch]);

      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(result);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not define difference');
    }
  }
}
