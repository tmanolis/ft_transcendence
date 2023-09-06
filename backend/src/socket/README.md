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
|function | event name | parameters |description|
|---------|------------| -----------|-----------|
|handleSetCanvas|setCanvas | client, payload||
|handlePlayGame | playGame | client| User try to join or create a game|
|handleStartGame| startGame| client, payload| the gameInterval starts |
|handleMovePaddle| movePaddle| client, payload|
||inviteUserToPlay||todo|
||pauseGame||todo|


### Emit
| event name | body |description|
|-----------|-----------|------------|
|updateGame|gameData|inside "startGame", 30 fps|

## CHAT

### Listen
|function | event name | parameters |description|
|---------|------------| -----------|-----------|
||startChat||todo|
||inviteUserToChat||todo|
||joinChanel||todo|
||leaveChanel||todo|
||kickUserFromChanel||todo, chanel admin|
||banUserFromChanel||todo, chanel admin|
||unBanUserFromChanel||todo, chanel admin|
||muteUser||todo, filter|
||unMuteUser||todo, filter|
||message|messageBody|todo|

### Emit
| event name | body |description|
|-----------|-----------|------------|
|messageBroadcast|messageBody, chanel/room ID|todo|
|userJoined|userName, chanel/room ID|todo|
