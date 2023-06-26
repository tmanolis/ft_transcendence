import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateDto {
  @ApiProperty({ description: 'New username (optional)' })
  @IsString()
  @IsOptional()
  userName: string;

  @ApiProperty({ description: 'Old password (required when updating password)' })
  @IsString()
  @IsOptional()
  oldPassword: string;

  @ApiProperty({ description: 'New password (optional)' })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password too weak. Need at least one uppercase letter, one lowercase letter and one digit.',
  })
  password: string;

  @ApiProperty({
    description: 'New avatar string (optional)',
    example: 'new_avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ description: 'Toggle for activation 2FA (optional)' })
  @IsOptional()
  twoFAActivated: boolean;
}
