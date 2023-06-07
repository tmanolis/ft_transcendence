import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  id: string;

  @ApiProperty({ example: 'Elise007', })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ example: 'example@site.com', })  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  image: string;

  @ApiProperty({ description: 'password', example: '12345' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
