const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const introScreen = document.getElementById("introScreen");

const mcqBox = document.getElementById("mcqBox");
const questionText = document.getElementById("question");
const choicesDiv = document.getElementById("choices");

const messageBox = document.getElementById("messageBox");

const endScreen = document.getElementById("endScreen");
const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");

let gameStarted = false;
let gameEnded = false;

const background = new Image();
background.src = "assets/background.png";

const pollutionImg = new Image();
pollutionImg.src = "assets/pollution.png";

const playerImg = new Image();
playerImg.src = "assets/player.png";

const heartImg = new Image();
heartImg.src = "assets/heart.png";

let score = 0;

let lives = 4;

let invincible = false;

let seaRise = 0.01;

let waveOffset = 0;

let successfulJumps = 0;

let currentQuestion = 0;

let mcqActive = false;

let obstacles = [];


let gameSpeed = 10;
let player = {

    x: 180,

    y: canvas.height - 125,

    width: 80,

    height: 100,

    dy: 0,

    gravity: 1,

    jumpForce: -22,

    grounded: true

};

const questions = [

{
question:"Which gas is NOT a greenhouse gas?",
choices:["Methane","Nitrogen","Carbon dioxide","Water vapour"],
answer:1
},

{
question:"What causes sea levels to rise?",
choices:["Tsunamis","Melting land ice","Volcanoes","Tidal waves"],
answer:1
},

{
question:"Which areas are most threatened by sea rise?",
choices:["Mountains","Deserts","Coastal cities","Forests"],
answer:2
},

{
question:"Which agreement combats climate change?",
choices:["Paris Agreement","NATO","Geneva Convention","League of Nations"],
answer:0
}

];

function startGame(){

    if(!gameStarted){

        gameStarted = true;

        introScreen.style.display = "none";

    }

}

function jump(){

    if(!gameStarted) return;

    if(gameEnded) return;

    if(mcqActive) return;

    if(player.grounded){

        player.dy = player.jumpForce;

        player.grounded = false;

    }

}

window.addEventListener("keydown",(e)=>{

    if(e.code === "Space"){

        e.preventDefault();

        if(!gameStarted){

            startGame();

        }

        jump();

    }

});



    window.addEventListener("touchstart",(e)=>{

    e.preventDefault();

    if(!gameStarted){

        startGame();

    }

    jump();

},{passive:false});

window.addEventListener("click",()=>{

    if(!gameStarted){

        startGame();

    }

    jump();

});

function spawnObstacle(){

    if(mcqActive) return;

    obstacles.push({

        x: canvas.width + 100,

        y: canvas.height - 235,

        width: 150,

        height: 120,

        passed:false

    });

}

setInterval(spawnObstacle,1400);

function showMessage(text,color="#ff4444"){

    messageBox.innerHTML = text;

    messageBox.style.color = color;

    messageBox.style.display = "block";

    setTimeout(()=>{

        messageBox.style.display = "none";

    },1000);

}

function loseLife(){

    if(invincible) return;

    invincible = true;

    lives--;

    showMessage("STRIKE!");

    setTimeout(()=>{

        invincible = false;

    },1500);

    if(lives <= 0){

        endGame();

    }

}

function endGame(){

    gameEnded = true;

    endScreen.style.display = "flex";

    endTitle.innerHTML = "GAME TERMINATED";

    endMessage.innerHTML =
    "The sea has risen beyond repair.<br><br>Thank you for playing :).";

}

function winGame(){

    gameEnded = true;

    endScreen.style.display = "flex";

    endTitle.innerHTML = "CONGRATULATIONS";

    endMessage.innerHTML =
    "You successfully survived the climate crisis and kept sea levels at bay (for now).<br><br>Thank you for playing :).";

}

function openQuestion(){

    mcqActive = true;

    mcqBox.style.display = "block";

    let q = questions[currentQuestion];

    questionText.innerHTML = q.question;

    choicesDiv.innerHTML = "";

    q.choices.forEach((choice,index)=>{

        let btn = document.createElement("div");

        btn.classList.add("choice");

        btn.innerHTML = choice;

        btn.onclick = ()=>{

            if(index !== q.answer){

                loseLife();

            }else{

                showMessage("CORRECT","#00ffff");

            }

            mcqBox.style.display = "none";

            mcqActive = false;

            currentQuestion++;

           if(
    currentQuestion >= questions.length &&
    successfulJumps >= questions.length * 5
){

    setTimeout(()=>{

        winGame();

    },1200);

}

        };

        choicesDiv.appendChild(btn);

    });

}

function update(){

    if(!gameStarted) return;

    if(gameEnded) return;

    score++;

    gameSpeed += 0.002;

    seaRise += 0.05;

    waveOffset += 0.04;

    player.dy += player.gravity;

    player.y += player.dy;

    let groundLevel = canvas.height - 240;

    if(player.y >= groundLevel){

        player.y = groundLevel;

        player.dy = 0;

        player.grounded = true;

    }

    obstacles.forEach((o)=>{

        o.x -= gameSpeed;

        if(

            player.x < o.x + o.width &&
            player.x + player.width > o.x &&
            player.y < o.y + o.height &&
            player.y + player.height > o.y

        ){

            loseLife();

            o.x = -9999;

        }

        if(o.x + o.width < player.x && !o.passed){

            o.passed = true;

            
successfulJumps++;

console.log("Jumps:", successfulJumps);

if(
    successfulJumps > 0 &&
    successfulJumps % 5 === 0 &&
    currentQuestion < questions.length &&
    !mcqActive
){

    mcqActive = true;

    setTimeout(()=>{

        openQuestion();

    },300);

}
           

        }

    });

    obstacles = obstacles.filter(o => o.x > -300);

}

function drawBackground(){

    ctx.drawImage(

        background,

        0,
        0,

        canvas.width,

        canvas.height - 180

    );

    ctx.fillStyle = "black";

    ctx.fillRect(

        0,
        canvas.height - 180,

        canvas.width,
        180

    );

}

function drawSea(){

    let seaTop = canvas.height - 125 - seaRise;

    ctx.fillStyle = "#0aa6c6";

    ctx.beginPath();

    ctx.moveTo(0,canvas.height);

    for(let x=0;x<=canvas.width;x+=20){

        let y = seaTop +

        Math.sin((x * 0.02) + waveOffset) * 18 +

        Math.sin((x * 0.01) + waveOffset) * 12;

        ctx.lineTo(x,y);

    }

    ctx.lineTo(canvas.width,canvas.height);

    ctx.closePath();

    ctx.fill();

}

function drawGround(){

    ctx.fillStyle = "#3b2d20";

    ctx.fillRect(

        0,
        canvas.height - 120,

        canvas.width,
        120

    );

    ctx.fillStyle = "#57402d";

    ctx.fillRect(

        0,
        canvas.height - 130,

        canvas.width,
        12

    );

}

function drawObstacles(){

    obstacles.forEach((o)=>{

        ctx.drawImage(

            pollutionImg,

            o.x,
            o.y,

            o.width,
            o.height

        );

    });

}

function drawPlayer(){
if(invincible){

    ctx.globalAlpha = 0.5;

}

    ctx.drawImage(

        playerImg,

        player.x,
        player.y,

        player.width,
        player.height

    );
ctx.globalAlpha = 1;
}

function drawLives(){

    for(let i=0;i<lives;i++){

        ctx.drawImage(

            heartImg,

            canvas.width - 70 - (i*60),

            20,

            45,
            45

        );

    }

}

function drawScore(){

    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.fillText(

        "Score: " + score,

        40,
        60

    );

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBackground();

    drawSea();

    drawGround();

    drawObstacles();

    drawPlayer();

    drawLives();

    drawScore();

}

function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}

gameLoop();