import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class JwtFromCookieMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		const token = req.cookies.jwt;
		if (token){
			req.headers['authorization'] = `Bearer ${token}`;
		}
		next();
	}
}