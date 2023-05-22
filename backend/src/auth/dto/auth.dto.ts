// import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
	id: number;

	// @IsString()
	// @IsNotEmpty()
	login: string;
	
	// @IsEmail()
	// @IsNotEmpty()
	email: string;
	
	image: string;
}