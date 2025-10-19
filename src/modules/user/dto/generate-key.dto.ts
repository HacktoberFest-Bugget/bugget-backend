import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateKeyDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
