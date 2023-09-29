# Websocket with Socket.io

- Basic Websocket gateway

- Still considering setting only one gateway as the unique entry point to the backend socket.io server (like here) or seperate game and chat gateways in their own modules.  
  (Was using 2 seperate gateways for game and chat. Changed it to a generic/unique gateway for the whole site.)

- No frontend for now. Need Postman or other client for testing.

## General

- handleConnection

- handleDisconnection

## GAME

### Listen

| event name      | parameters      | description                         |
| --------------- | --------------- | ----------------------------------- |
| setCanvas       | client, payload |                                     |
| findGame        | client          | User try to join or create a game   |
| startGame       | client, payload | the gameInterval starts             |
| movePaddle      | client, payload |
| invitePlayer    | client, payload | User invites player                 |
|                 | {userName}      |                                     |
| respondToInvite | client, payload | User invites player                 |
|                 | {accept, user-  | User accepts or declines invitation |
|                 | Name, gameID}   |
| pauseGame       |                 |                                     |

### Emit

| event name 		| body     | description                |
| ---------- 		| -------- | -------------------------- |
| updateGame 		| gameData | inside "startGame", 30 fps |
| accessDenied 	| reason	 | after connect/disconnect		|

