import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @ApiProperty({ description: 'New username (optional)' })
  @IsString()
  @IsOptional()
  userName: string;

  @ApiProperty({ description: 'New password (optional)' })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'New avatar string (optional)',
    example: 'new_avatar.jpg',
  })
  @IsString()
  @IsOptional()
  avatar: any;

  @ApiProperty({ description: 'Toggle for activation 2FA (optional)' })
  @IsOptional()
  twoFAActivated: boolean;
}
