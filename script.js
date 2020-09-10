var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var ballRadius = 10;
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var bricks = [];
for(var c=0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++){
        bricks[c][r] = {x:0, y:0, status:1};
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    for(var c=0; c<brickColumnCount; c++){
        for(var r=0; r<brickRowCount; r++){
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore(){
    ctx.font ="16 Arial";
    ctx.fillstyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //bounce the ball off the walls
    if(x + dx < ballRadius || x + dx > canvas.width-ballRadius){
        dx = -dx
    };
    if(y + dy < ballRadius){ // ball hits tops of screen
        dy = -dy
    } else if(y + dy > canvas.height-ballRadius){ //if it hits the bottom...
        if(x > paddleX && x < paddleX + paddleWidth){ //if it hits the paddle..
            dy = -dy;
        }else{ //...or the bottom of the screen
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // for chrome to end the game
    }
    };

    //move the paddle and...
    //stop the paddle from going through walls
    if(rightPressed == true){
        paddleX += 7;
        if(paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed == true){
        paddleX -= 7;
        if(paddleX < 0){
            paddleX = 0;
        }
    }
    
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    //keep the ball moving at constant speed
    x += dx;
    y += dy;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    } else if (e.key == "left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    } else if (e.key == "left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}
function collisionDetection(){
    for(var c=0; c<brickColumnCount; c++){
        for(var r=0; r<brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status == 1){
                if(x>b.x && x< b.x+brickWidth && y >b.y && y < b.y+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}

var interval = setInterval(draw, 10);