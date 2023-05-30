The information stored into redis:

"gameID(socketID string)": "gameData(object)"
"userID(user name string)": "{
"game": {gameID(stringID), side(left or right)},
"chat": {roomID(stringID), role(admin, participant, banned, blocked...)},
}"
"gameWaiting(string)": "gameID(socketID string)"

userToken: gameID(socketID)

```
if (get(userToken) != null)
  update gameID.gameData
  update userToken.gameID
else
  create gameID;
```

gameID(socketID): gameData;

The game gateway flow:
When an user connect to the socket:
-> (if the player is already in a game) get(userID)
-> (yes) take the gameID -> find the gameData -> modify "gameData.(left or right)Player.socket"
-> (no) -> if there is a "gameWaiting"
-> (yes) player = rightPlayer -> set the gameData.rightPlayer , set the "userID": "gameID", del("gameWaiting)
-> (no) ->
