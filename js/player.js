let gamePlayers = {};
let playerSprites = {};

let playerSpeed = 4;
let updatingPosition = false;


function startPlayers() {

    database.ref("matchmakeroom/players").on("value", function(data) {

        gamePlayers = data.val() || {};

    });

}


function drawPlayers() {

    for (let id in gamePlayers) {

        let player = gamePlayers[id];

        if (!playerSprites[id]) {

            let sprite = createSprite(
                player.x,
                player.y,
                40,
                60
            );

            if (player.number === 1) {
                sprite.shapeColor = "blue";
            } else {
                sprite.shapeColor = "red";
            }

            playerSprites[id] = sprite;

        }

        playerSprites[id].position.x = player.x;
        playerSprites[id].position.y = player.y;

    }

    movePlayer();

    drawSprites();

    showPlayerNames();

}


function movePlayer() {

    if (!playerId || !gamePlayers[playerId]) {
        return;
    }

    let player = gamePlayers[playerId];
    let sprite = playerSprites[playerId];

    if (!sprite) {
        return;
    }

    let moved = false;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        sprite.position.x -= playerSpeed;
        moved = true;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        sprite.position.x += playerSpeed;
        moved = true;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        sprite.position.y -= playerSpeed;
        moved = true;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        sprite.position.y += playerSpeed;
        moved = true;
    }

    // Mantém o personagem dentro da tela
    sprite.position.x = constrain(sprite.position.x, 20, width - 20);
    sprite.position.y = constrain(sprite.position.y, 30, height - 30);

    if (moved && !updatingPosition) {

        updatingPosition = true;

        database.ref("matchmakeroom/players/" + playerId).update({
            x: sprite.position.x,
            y: sprite.position.y
        }).then(function() {

            updatingPosition = false;

        }).catch(function(error) {

            console.log("Position update error:", error);

            updatingPosition = false;

        });

    }

}


function showPlayerNames() {

    for (let id in gamePlayers) {

        let player = gamePlayers[id];
        let sprite = playerSprites[id];

        if (!sprite) {
            continue;
        }

        fill("white");
        noStroke();

        textAlign(CENTER);
        textSize(14);

        text(
            player.name,
            sprite.position.x,
            sprite.position.y - 40
        );

    }

}