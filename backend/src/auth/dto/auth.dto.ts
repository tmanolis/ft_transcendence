import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  image: string;

  @IsNotEmpty()
  @IsString()
  hash: string;
}
