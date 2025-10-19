import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentationDto {
  @IsNotEmpty()
  @IsString()
  repository: string;

  @IsNotEmpty()
  @IsString()
  fromBranch: string;

  @IsOptional()
  @IsString()
  toBranch: string;
}
