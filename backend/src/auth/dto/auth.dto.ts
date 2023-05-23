// import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
	id: string;
	userName: string;
	email: string;
	image: string;
	hash: string;
}