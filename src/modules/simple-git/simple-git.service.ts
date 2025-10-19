import { BadRequestException, Injectable } from '@nestjs/common';
import simpleGit from 'simple-git';
import { GetDiffDto } from './dto/get-diff.dto';
import * as path from 'node:path';

@Injectable()
export class SimpleGitService {
  async getDiff(dto: GetDiffDto) {
    try {
      const repository = path.resolve(__dirname, '../../..');
      const git = simpleGit(repository);
      await git.branch();

      return git.diff([`origin/${dto.fromBranch}`, `origin/${dto.toBranch}`]);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not define difference');
    }
  }
}
