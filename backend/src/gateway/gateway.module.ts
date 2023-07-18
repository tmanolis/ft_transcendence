import { Module } from "@nestjs/common";
import { MainGateway } from "./gateway";

@Module({
	providers: [MainGateway],
})

export class GatewayModule {}