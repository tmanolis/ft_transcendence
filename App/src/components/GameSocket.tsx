import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const access_token: string = Cookies.get("jwt")!;
export const GameSocket: Socket = io(`${import.meta.env.VITE_BACKEND_URL}/game`, {
  extraHeaders: {
    Authorization: access_token,
  },
});
