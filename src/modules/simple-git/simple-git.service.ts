import { BadRequestException, Injectable } from '@nestjs/common';
import simpleGit from 'simple-git';
import { GetDiffDto } from './dto/get-diff.dto';
import * as path from 'node:path';

@Injectable()
export class SimpleGitService {
  getDiff(dto: GetDiffDto) {
    try {
      const repository = path.resolve(__dirname);
      const git = simpleGit(repository);

      return git.diff([dto.fromBranch, dto.toBranch]);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not define difference');
    }
  }
}
