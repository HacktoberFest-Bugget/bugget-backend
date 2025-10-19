import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';
import ReasoningEffort = OpenAI.ReasoningEffort;

@Injectable()
export class OpenaiService {
  private client: OpenAI;
  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_KEY'),
    });
  }

  async prompt(prompt: string): Promise<string> {
    try {
      const result = await this.client.responses.create({
        model: this.configService.get<string>('OPENAI_MODEL'),
        input: prompt,
        reasoning: {
          effort: this.configService.get<ReasoningEffort>('OPENAI_EFFORT'),
        },
        text: {
          verbosity: this.configService.get<'low' | 'medium' | 'high' | null>(
            'OPENAI_EFFORT',
          ),
        },
      });

      return result.output_text;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Could not call prompt');
    }
  }
}
