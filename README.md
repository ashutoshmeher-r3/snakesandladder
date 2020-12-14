# Snakes And Ladders

This sample implements a simple Snakes And Ladder Game on Corda.

Its a simple game which has a board with numbers from 1 to 100. Each player starts at 1. 
Players takes turn to roll a dice and move as many places as they rolled. If a player lands on a number 
with a ladder thay climb up using the ladder or if they land in a number with a snake they move down on the board.
The player who reach 100 first wins.

The cordapp runs  a network having 4 nodes, 
1. Classis Games
2. Mega Games
3. Oracle
4. Notary

Each player can create an account to participate. Players can either be on the same node or different nodes. 
Oracle node is used to obtain the player dice rolls.

# Setting up
Go into the project directory and build the project
```
./gradlew clean deployNodes
```
Run the project
```
./build/nodes/runnodes
```

Now, you should have four Corda terminals opened automatically.

Run the below command to start  client:

``` ./gradlew runClassicGamesClient```





