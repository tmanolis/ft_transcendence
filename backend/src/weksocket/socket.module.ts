import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { GameService } from "src/game/game.service";

@Module({
	providers: [SocketGateway, GameService],
})

export class SocketModule {}