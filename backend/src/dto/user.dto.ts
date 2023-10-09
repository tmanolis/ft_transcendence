import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsAlphanumeric,
} from 'class-validator';
import { Game, Status } from '@prisma/client';

export class UpdateDto {
  @ApiProperty({ description: 'New username (optional)' })
  @IsString()
  @IsOptional()
  @IsAlphanumeric()
  userName: string;

  @ApiProperty({
    description: 'Old password (required when updating password)',
  })
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

export class UsernameDTO {
  @ApiProperty({ description: 'Requested username' })
  @IsString()
  userName: string;
}

export class SecureUser {
  constructor(
    public userName: string,
    public avatar: string,
    public status: Status,
    public gamesWon: number,
    public gamesLost: number,
    public achievements: string[],
  ) {}
}

export class LeaderboardUser {
  constructor(
    public userName: string,
    public avatar: string,
    public place: number,
    public gamesWon: number,
    public gamesPlayed: number,
  ) {}
}
