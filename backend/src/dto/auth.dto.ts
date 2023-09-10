import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthDto {
  id: string;

  @ApiProperty({ example: 'Elise007' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ example: 'example@site.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  image: string;

  @ApiProperty({ description: 'password', example: '12345' })
  @IsNotEmpty()
  @IsString()
  // @MinLength(8)
	// Commented for testing:
	// @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message:
  //     'password too weak. Need at least one uppercase letter, one lowercase letter and one digit.',
  // })
  password: string;

  @ApiProperty({ description: 'optional', example: '123456' })
  @IsOptional()
  @IsString()
  twoFACode: string;
}
