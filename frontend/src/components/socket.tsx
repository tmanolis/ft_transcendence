import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const URL = "http://jas0nhuang.eu.org:3000";

let access_token = 0;
if (Cookies.get('jwt')) {
  access_token = Cookies.get('jwt');
}

export const gameSocket = io(`${URL}/game`, {
  autoConnect: false,
  extraHeaders: {
    Authorization: access_token,
  }
});
