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

| function         | event name       | parameters      | description                       |
| ---------------- | ---------------- | --------------- | --------------------------------- |
| handleSetCanvas  | setCanvas        | client, payload |                                   |
| handleFindGame   | findGame         | client          | User try to join or create a game |
| handleStartGame  | startGame        | client, payload | the gameInterval starts           |
| handleMovePaddle | movePaddle       | client, payload |
| handeInvitePlayer| invitePlayer			| client, payload | User invites player
|									 |									|	{userName}			| 											            |
| handleRespondTo	 | respondToInvite	| client, payload | User invites player
|	Invite					 |									|	{accept, user-	| User accepts or declines invitation
|									 |									|	Name, gameID}		|
|                  | pauseGame        |                 |                                   |

### Emit

| event name 		| body     | description                |
| ---------- 		| -------- | -------------------------- |
| updateGame 		| gameData | inside "startGame", 30 fps |
| accessDenied 	| reason	 | after connect/disconnect		|

## CHAT

## General

- handleConnection
	returns the full message history in format Record<roomName, Message[]> {} te be displayed

- handleDisconnection


### HTTP requests

| request 	          | parameters  				| description        																		|
| ------------------- | ------------------- | ----------------------------------------------------- |
| create-channel			| roomName, status		|	creates room for dm/channel, for dm naming convention	|
|											|											|	is email1-email2 (in alphabetical order)							|
| join-channel				| roonName, password?	| joins user to room - if status public or private, and |
|											|											|	the right password has been provided									|

### Listen

| event name          | parameters  				| description        																		|
| ------------------- | ------------------- | ----------------------------------------------------- |
|	message							|	roomName						| broadcasts message if no block is active							|
| updateHistory				|											| returns full message history every time, can be used  |
|											|											|	to refresh chat page																	|


### Emit

| event name       | body                    | description 																					|
| ---------------- | ------------------------| ---------------------------------------------------- |
| messageBroadcast | messageBody             | broadcasts message to the relevant room	            |

