const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;//宣告一單位長度為20

let score = 0;
let highestScore;
loadHighestScore();

const SCORE =  document.getElementById("myScore");
const HIGHESTSCORE = document.getElementById("myScore2");

SCORE.innerHTML = `遊戲分數：${score}`;
HIGHESTSCORE.innerHTML = `最高分數：${highestScore}`;

function loadHighestScore(){
    //找瀏覽器中是否有過遊玩紀錄
    if(localStorage.getItem("highestScore") == null){
        highestScore = 0;
    }else{
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}

function setHighestScore(score){
    if (score>highestScore){
        localStorage.setItem("highestScore",score);
        highestScore = score;
    }
}


let direction = "Right";
//用來控制蛇方向的變數，初始狀態為向右

const row = canvas.height/unit;
const column = canvas.width/unit;
//設定好每直/橫排有幾格，概念為把canvas畫布畫成16宮格
//(因為畫布的長寬320除unit的20為16)

let snake = [];
//用來追蹤蛇的身體每一格的位置座標
//陣列裡面每個元素都是一個物件，物件裡存放xy座標
//有幾個元素，蛇的身體初始狀態就有幾格

snake[0] = {
    x:80,
    y:0,
}
snake[1] = {
    x:60,
    y:0,
}
snake[2] = {
    x:40,
    y:0,
}
snake[3] = {
    x:20,
    y:0,
}
//每一格的位置相差一個unit

class Fruit{
    constructor(){
        //給這個Fruit Class製作出來的物件添加xy的座標資料
        this.x = Math.floor(Math.random()*column)*unit;
        this.y = Math.floor(Math.random()*row)*unit;
        //這裡代表在canvas上隨機挑一格，
        //並且形狀為長unit寬unit
    }

    drawFruit(){
        //給這個Fruit Class製作出來的物件添加畫出食物的method
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x,this.y,unit,unit);
        //console.log(this.x,this.y)
        //console.log("正在畫");
        //用上面給的屬性資料，把圖形畫出來
    }

    pickALocation(){
        //當隨機產生的位置剛好和蛇的位置重疊時，要挑一個新位置
        let isOverlap = false;//用來控制目前是否重疊
        let newX;
        let newY;

        function checkOverlap(newX,newY){
            for (let i = 0;i<snake.length;i++){
                if(newX == snake[i].x && newY == snake[i]){
                    isOverlap = true;
                    return;
                }else{
                    isOverlap = false;
                }
            }

        }
        do{
            newX = Math.floor(Math.random()*column)*unit;
            newY = Math.floor(Math.random()*row)*unit;
            checkOverlap(newX,newY);
        }while(isOverlap);
        this.x = newX;
        this.y = newY;
    }
}

let myFruit = new Fruit();
//class製作的函式，沒有hoisting現象

//給完蛇的座標後，用canvas的method畫出來
//用for loop遍歷snake的座標資料
//宣告一個draw函式，把要執行的程式都放裡面
function draw(){
    //要隨時判斷蛇有沒有咬到身體，所以要寫在draw的最一開始
    for (let i=1;i<snake.length;i++){
        //因為是要判斷身體，所以i從1開始數
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            //當身體的座標等於頭的座標代表咬到自己
            //就清除計數器並跳出警告
            clearInterval(myGame);
            alert("Game Over");
            return;
        }
    }


    //要每次進行繪圖時都把canvas的背景重繪，
    //否則後來畫的會直接覆蓋在上面，會看不出變化
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    myFruit.drawFruit();
    //console.log(myFruit.x,myFruit.y)
    

    for (let i =0;i<snake.length;i++){
        //以下設定讓蛇的頭顏色和身體不同
        if (i == 0){
            ctx.fillStyle = "lightgreen";
            //頭的顏色
        }else{
            ctx.fillStyle = "lightblue";
            //身體的顏色
        }
    
        //以下畫出每一格的外框線
        ctx.strokeStyle = "white";
    
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
        //四個參數分別為x座標、y座標、寬度、長度

        
    //穿牆功能
    //判斷蛇的座標是否有超出canvas

    if(snake[i].x >= canvas.width){
        snake[i].x = 0;
        //當蛇的座標超出canvas的時候，讓蛇回到座標0的位置
    }
    if(snake[i].x < 0){
        snake[i].x = canvas.width - unit;
        //當蛇的座標小於0時，從另一邊出現，也就是寬-unit
    }
    if(snake[i].y >= canvas.width){
        snake[i].y = 0;
    }
    if(snake[i].y < 0){
        snake[i].y = canvas.width - unit;
    }


    }

    //讓蛇動起來
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "Right"){
        snakeX += unit;
    }else if(direction == "Left"){
        snakeX -= unit;
    }else if(direction == "Up"){
        snakeY -= unit;
    }else if(direction == "Down"){
        snakeY += unit;
    }

    let newHead = {
        x:snakeX,
        y:snakeY,
    }

    //為了要看出移動的效果，先暫時這樣寫
    //之後製作吃到食物身體變長的功能時會再改
    // snake.pop();
    // snake.unshift(newHead);

    //來製作吃到食物身體變長的功能
    //要判斷食物的座標是否有和頭重疊
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y){
        //若有重疊的話，就讓食物挑一個新的位置，且分數+1
        //並且把分數顯示在網頁上
        //並且不執行pop()
        myFruit.pickALocation();
        score++;
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
        document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
    }else{
        snake.pop();
        //沒有重疊的話，就執行pop()
    }
    //因為要讓蛇移動，所以不論有沒有吃到食物
    //都要執行unshift()
    snake.unshift(newHead);
    //讓蛇可以改變方向
    window.addEventListener("keydown",changeDirection);

}


function changeDirection(e){
    if (e.key == "ArrowUp" && direction != "Down"){
        //當蛇在往下的時候不能直接改往上
        //其他方向以此類推
        direction = "Up";
    }else if(e.key == "ArrowDown" && direction != "Up"){
        direction = "Down";
    }else if(e.key == "ArrowLeft" && direction != "Right"){
        direction = "Left";
    }else if(e.key == "ArrowRight" && direction != "Left"){
        direction = "Right";
    }
}

let myGame = setInterval(draw,100);

//試做手機操控

const mobileLeft = document.querySelector(".left");
const mobileRight = document.querySelector(".right");
const mobileUp = document.querySelector(".up");
const mobileDown = document.querySelector(".down");

mobileLeft.addEventListener("click",() => {
    if (direction != "Right"){
        direction = "Left";
    }
});

mobileRight.addEventListener("click",() => {
    if (direction != "Left"){
        direction = "Right";
    }
});
mobileUp.addEventListener("click",() => {
    if (direction != "Down"){
        direction = "Up";
    }
});
mobileDown.addEventListener("click",() => {
    if (direction != "Up"){
        direction = "Down";
    }
});