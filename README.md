# :zap: Zap server
Zap server is a game server for card game. Game is made with MVC model and talking between server and client is handled with web socket.

Game works with one window watching and players playing in their own devices. Player throws card on table and which is watching screen.

## Requirements
* Redis 4.0 (Used in current development)
* NodeJS version >=8.0.0 (With nvm in use, run `nvm use`)

## Development

### Useful NPM scripts
* Install dependencies

  `npm install`
* Run tests

  `npm test`
* Run application

  `npm start`
* Run lint for NodeJS code

  `npm run node-lint`

### Other
* Environment credentials

  Copy /.env.example to /.env and fill right credentials.

* Githooks

  Before commits and pushes, tests and lints are run. Git action is denied if tests or lints fail.


## Functionality description

## User management
Users can be divided in two roles. Watchers and players. Players are playing the game and others are watching. Users are identified with web socket connection. No AJAX and sessions.

 In database users are hash lists named like `player:profile:{player name}`.

## Deck management
Deck management can also be called as card management. Deck model handles cards in database. In start of game deck is made which means starting collection named 'default' is made. (`Deck.createDeck(cards)`) All cards are at the start in default collection and can be moved to created collections. Collections can be deleted and emptied.

Because use of Redis database, two types keys are created. `deck:index` is a list of all collections. This is because collections (`deck:collection:{collection name}`) can't be empty in Redis. When list is empty in Redis, it does not exist.
