import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'example@site.com', })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345', })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: '123 456', })
  @IsOptional()
  @IsString()
  twoFACode: string;
}