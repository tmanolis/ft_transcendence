import { Module, forwardRef } from "@nestjs/common";
import { GameService } from "./game.service";
import { SocketGateway } from "src/weksocket/socket.gateway";
import { SocketModule } from "src/weksocket/socket.module";

@Module({
	imports: [forwardRef(() => SocketModule)],
	providers: [GameService],
	exports: [GameService],
})

export class GameModule {}