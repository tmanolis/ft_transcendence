# Websocket with Socket.io

- Basic Websocket gateway

- Still considering setting only one gateway as the unique entry point to the backend socket.io server (like here) or seperate game and chat gateways in their own modules.  
  (Was using 2 seperate gateways for game and chat. Changed it to a generic/unique gateway for the whole site.)

- No frontend for now. Need Postman or other client for testing.

## CHAT

## General

- handleConnection
	returns the full message history in format Record<roomName, Message[]> {} te be displayed

- handleDisconnection


### HTTP requests

See Swagger at http://localhost:3000/api


### Listen

| event name          | parameters  				| description        																		|
| ------------------- | ------------------- | ----------------------------------------------------- |
|	sendMessage					|	messageDTO					| broadcasts message if no block is active							|
| createChannel					|	createRoomDTO				| returns full message history every time, can be used  |
|	joinChannel					|	joinRoomDTO					|	to refresh chat page																	|
| ------------------- | ------------------- | ----------------------------------------------------- |



### Expected DTO's

| DTO name 			| variable name | descirption  																				|
| ------------- |	-------------	| --------------------------------------------------- |
|	messageDTO		| room					|	destination room name																|
| 							|	sender				|	username of sender												 					|
|								| text					|	message text (max 128 characters)										|
| ------------- |	-------------	| --------------------------------------------------- |
|	createRoomDTO	| name					|	channel name (private/public) or username	(direct)	|
| 							|	status				|	'PRIVATE', 'PUBLIC' or 'DIRECT'						  				|
|								| pasword?			|	mandatory for private rooms													|
| ------------- |	-------------	| --------------------------------------------------- |
|	joinRoomDTO		| name					|	channel name 																				|
| 							|	password?			|	mandatory for private rooms								  				|
| ------------- |	-------------	| --------------------------------------------------- |



### Emit

| event name       			| body            | description 																		|
| --------------------- | ---------------	| ----------------------------------------------- |
| accessDenied		 			| messageBody			| error when connection fails 										|
| reconnectNeeded  			| messageBody		  | prompt to refresh chat socket upon DM creation	|
| createChannelSuccess	| messageBody			|	channel has been created succesfully						|
| createChannelError		| messageBody			|	error creating channel													|
| joinChannelSuccess		| messageBody			|	user has joined channel succesfully							|
| joinChannelError			| messageBody			|	error joining channel														|
| --------------------- | ---------------	| ----------------------------------------------- |

