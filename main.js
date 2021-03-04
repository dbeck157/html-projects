//Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
let x = canvas.width / 2;
let y = canvas.height - 30;

//Game Data
let score = 0;
let lives = 3;

//Ball
const ballRadius = 10;
let dx = Math.floor(Math.random() * 5 + 1);
let dy = -4;

//Paddle
const paddleHeight = 10;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

//Brick
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = initBricks();

//Movement
let rightPressed = false;
let leftPressed = false;

//Color
let randomColorArray = ["red", "orange", "yellow", "green", "blue", "ingido", "violet"];
let randomColor = "purple";

function initBricks(){
    let newBricks = [];
    for(let c = 0; c < brickColumnCount; c++){
        newBricks[c] = [];
        for (let r = 0; r < brickRowCount; r++){
            newBricks[c][r] = {x:0, y:0, status:1};
        }
    }
    return newBricks;
}

function drawBricks(){
    for(let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            if (bricks[c][r].status == 1){
                const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft + canvas.width / 4;
                const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop + canvas.height / 10;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = randomColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = randomColor;
    ctx.fill();
    ctx.closePath();
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = randomColor;
    ctx.fill();
    ctx.closePath();
}

function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = randomColor;
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives(){
    ctx.font = '16px Arial';
    ctx.fillStyle = randomColor;
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();
    drawBricks();
    drawScore();
    drawLives();
    
    //Handling Left/Right walls
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius){
        dx = -dx;
    }

    //Handling Top/Bottom walls
    if (y + dy < ballRadius){
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius){
        //Paddle hit detection
        if (x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
            changeBallSpeed(Math.round(Math.random()) * 2 - 1);
            colorChange();
        }
        else{
            lives--;
            if(!lives){
                alert("GAME OVER!");
                document.location.reload();
            } 
            else{
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth)/2;
            }
        }
    }

    if (rightPressed){
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed){
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

function collisionDetection(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            const b = bricks[c][r];
            if (b.status == 1){
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    colorChange();
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount){
                        alert("YOU WIN BUCKO");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function changeBallSpeed(newSpeed){
    if (newSpeed > 0){
        if (dy < 0){
            dy = dy - newSpeed;
        }
        else if (dy > 0){
            dy = dy + newSpeed;
        }
        if (dx < 0){
            dx = dx - newSpeed;
        }
        else if (dx > 0){
            dx = dx + newSpeed;
        }
    }
    else if (newSpeed < 0 && dy != -1){
        if (dy < 0){
            dy = dy - newSpeed;
        }
        else if (dy > 0){
            dy = dy + newSpeed;
        }
        if (dx < 0){
            dx = dx - newSpeed;
        }
        else if (dx > 0){
            dx = dx + newSpeed;
        }
    }
}

function colorChange(){
    randomColor = randomColorArray[getRandomInt(randomColorArray.length)];
}

function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

//Input Handlers
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e){
    if(e.key == "ArrowRight" || e.key == "Right"){
        rightPressed = true;
    }
    else if (e.key == "ArrowLeft" || e.key == "Left"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key == "ArrowRight" || e.key == "Right"){
        rightPressed = false;
    }
    else if (e.key == "ArrowLeft" || e.key == "Left"){
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth /2;
    }
}

draw();






















