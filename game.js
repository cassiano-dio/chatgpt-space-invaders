// Obtém o canvas e o contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Obtém os elementos do HTML para a pontuação e as vidas
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

// Define o tamanho do canvas
canvas.width = 800;
canvas.height = 600;

// Define o tamanho da nave do jogador
const playerWidth = 50;
const playerHeight = 50;

// Define o tamanho dos invasores
const invaderWidth = 40;
const invaderHeight = 40;

// Define o tamanho dos tiros
const shotWidth = 5;
const shotHeight = 20;

// Define o número de linhas de invasores
const numRows = 5;

// Define a velocidade do jogador
const playerSpeed = 10;

// Define a velocidade dos invasores
let invaderSpeed = 2;

// Define a velocidade dos tiros
const shotSpeed = 5;

// Define o número máximo de tiros na tela
const maxShots = 5;

// Define a pontuação inicial
let score = 0;

// Define o número de vidas
let lives = 5;

// Define a posição do jogador
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;

// Define a posição dos invasores
let invaders = [];
for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < 10; j++) {
        invaders.push({
            x: j * (invaderWidth + 10) + 50,
            y: i * (invaderHeight + 10) + 50,
            alive: true,
        });
    }
}

// Define os tiros
let shots = [];

// Desenha o jogador
function drawPlayer() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Move o jogador
function movePlayer(direction) {
    if (direction === "left") {
        playerX -= playerSpeed;
    } else if (direction === "right") {
        playerX += playerSpeed;
    }

    // Verifica se o jogador saiu da tela
    if (playerX < 0) {
        playerX = 0;
    } else if (playerX + playerWidth > canvas.width) {
        playerX = canvas.width - playerWidth;
    }
}

// Desenha os invasores
function drawInvaders() {
    for (let i = 0; i < invaders.length; i++) {
        if (invaders[i].alive) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(invaders[i].x, invaders[i].y, invaderWidth, invaderHeight);
        }
    }
}

// Move os invasores
function moveInvaders() {
    for (let i = 0; i < invaders.length; i++) {
        if (invaders[i].alive) {
            invaders[i].x += invaderSpeed;

            // Verifica se os invasores atingiram o jogador
            if (
                invaders[i].y + invaderHeight >= playerY &&
                invaders[i].x >= playerX &&
                invaders[i].x <= playerX + playerWidth
            ) {
                lives--;
                livesElement.innerHTML = lives;

                if (lives === 0) {
                    gameOver();
                }

                respawnInvaders();
            }

            // Verifica se os invasores atingiram a borda da tela
            if (
                invaders[i].x + invaderWidth >= canvas.width ||
                invaders[i].x <= 0
            ) {
                invaderSpeed = -invaderSpeed;

                for (let j = 0; j < invaders.length; j++) {
                    invaders[j].y += 10;
                }
            }
        }
    }
}

// Desenha os tiros
function drawShots() {
    for (let i = 0; i < shots.length; i++) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(shots[i].x, shots[i].y, shotWidth, shotHeight);
    }
}

// Move os tiros
function moveShots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].y -= shotSpeed;

        // Verifica se os tiros atingiram um invasor
        for (let j = 0; j < invaders.length; j++) {
            if (
                invaders[j].alive &&
                shots[i].y <= invaders[j].y + invaderHeight &&
                shots[i].x >= invaders[j].x &&
                shots[i].x <= invaders[j].x + invaderWidth
            ) {
                invaders[j].alive = false;
                shots.splice(i, 1);
                score++;
                scoreElement.innerHTML = score;
                break;
            }
        }

        // Verifica se os tiros saíram da tela
        if (shots[i] && shots[i].y < 0) {
            shots.splice(i, 1);
        }
    }
}

// Respawn dos invasores
function respawnInvaders() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < 10; j++) {
            invaders[i * 10 + j].alive = true;
        }
    }
}

// Game over
function gameOver() {
    alert("Game over!");
    location.reload();
}

// Eventos de teclado
document.addEventListener("keydown", function (event) {
    if (event.keyCode === 37) {
        movePlayer("left");
    } else if (event.keyCode === 39) {
        movePlayer("right");
    } else if (event.keyCode === 32) {
        if (shots.length < maxShots) {
            shots.push({
                x: playerX + playerWidth / 2 - shotWidth / 2,
                y: playerY - shotHeight,
            });
        }
    }
});

// Loop do jogo
function loop() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o jogador
    drawPlayer();

    // Desenha os invasores
    drawInvaders();

    // Desenha os tiros
    drawShots();

    // Move os invasores
    moveInvaders();

    // Move os tiros
    moveShots();

    // Verifica se o jogador perdeu todas as vidas
    if (lives === 0) {
        gameOver();
    }

    // Faz o loop do jogo
    requestAnimationFrame(loop);
}

// Inicia o loop do jogo
requestAnimationFrame(loop);
