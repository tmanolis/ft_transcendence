import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsNotEmpty()
	@IsString()
	userName: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	image: string;

	@IsNotEmpty()
	@IsString()
	hash: string;
}