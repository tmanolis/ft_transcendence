# Websocket with Socket.io

## GAME

- Basic Websocket gateway

## General

- handleConnection
  When the client connect to the socket.io gateway.  
  Will check the jwt token and make sure the user has the right to connect.  
  If ok, set a { socketID, userEmail } information in the cache.  

- handleDisconnection
  Remove the corresponding { socketID, userEmail } information from the cache.  

### Listen
| event name        | payload         | description                           |
| ---------------   | --------------- | -----------------------------------   |
| setCanvas         | { }             |                                       |
| findGame          | none            | User try find a game to join          |
|                   |                 |(will create a new game when failed)   |
| startGame         |                 | the gameInterval starts               |
| movePaddle        | {key,gameID}    |                                       |
| inviteUserToPlay  | username        | User invites player                   |
| acceptInvitation  | username        | User accept the invitation from player|
| declineInvitation | username        | User accept the invitation from player|
| enterGame         |                 | enter the game page                   |
| leaveGame         |                 | leave the game page                   |

### Emit
| event name 		| body           | description                                |
| ---------- 		| --------       | --------------------------                 |
| updateGame 		| gameData       | The game data sent to the client at 30 fps |
| accessDenied 	| reason	       | When the auth doesn't pass	                |
| error        	| errorMessage	 | when there is an error	  	                |

