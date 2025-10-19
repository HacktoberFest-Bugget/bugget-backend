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

  async getBranchDetails(): Promise<string> {
    try {
      const repository = path.resolve(__dirname);
      const git = simpleGit(repository);
      const branches = await git.branch();
      const currentBranch = branches.current;

      const log = await git.log({ n: 5 }); // last 5 commits
      const lastCommit = log.latest;

      const mergeBase = await git.raw(['rev-parse', 'HEAD']);

      return JSON.stringify({
        currentBranch,
        lastCommit,
        mergeBase,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not define difference');
    }
  }
}
