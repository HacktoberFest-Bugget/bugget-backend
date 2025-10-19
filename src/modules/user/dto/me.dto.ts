import { IsEmail, IsNotEmpty } from 'class-validator';

export class MeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
