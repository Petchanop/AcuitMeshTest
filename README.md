# AcuitMeshTest

Use vscode devcontainer to run this repo
- create .env file and fill variable use tic-tac-toe/.env.sample as an example
- ctrl + shift + p
- select rebuild and reopen with container
- initialize project with npm i

## User routes

![user routes](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/users_routes.png)

## Auth routes
![authentication routes](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/authentication_routes.png)

## Invitations routes
![invitation routes](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/invitation_routes.png)

## Games routes
![games routes](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/games_routes.png)

## Display register, login and user authentication with jwt token
![register](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/register_route.png)

### login
![login](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/signin_route.png)

### get user Id from another user

![get user id](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/get_user_pagination_pagesize.png)

### get user result

![get user result](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/get_user_result.png)

### send invitation to another user with userId

![send invitation](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/send_invitation_by_userid.png)

### create game with invitation id which status is accepted by receiver

![create game](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/create_game_with_invitation_id.png)

### playgame with /games/{gameId}/move
![move position](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/play_game_with_game_id_and_position.png)

### result after make move

![move result](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/make_move_result.png)


## check game detail which user is a player
![game me route](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/get_player_game_detail.png)

![check game detail](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/game_detail_result.png)

## check user game play overall statistic

### /games/history/me

![history me](https://github.com/Petchanop/AcuitMeshTest/blob/master/image/user_game_history.png)