
var xx =  document.getElementById("xx");
var jump =  document.getElementById("jump");
jump.volume = 0.3;

var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
context = canvas.getContext("2d");

var background = document.getElementById("background");

var rocket = {
    img: document.getElementById("rocket"),
    size:width/10,
    rx:width / 2 - width/10/2,
    ry:height / 2 -  width/10/2
};

var ufo ={
  img:  document.getElementById("ufo"),
  exist:false,
  size:width/10,
    stepX:0,
    stepY:0
};

var explos={
    img:document.getElementById("expl"),
    count:120,
    exist:false,
    x:0,
    y:0
};

var batUFO ={
    img:  document.getElementById("batufo"),
    exist:false,
    size:width/10,
    count:120
};

var heart={
    img: document.getElementById("heart"),
    life:3,
    size:width/15
};

var button={
    img: document.getElementById("button"),
    size:width/12,
    x:width-width/12*2.5,
    y:width/12/4
};
//------------отрисовка обЪектов-------------------------------------------------
function drawBAT_UFO(x,y) {
    if (x && y)context.drawImage(batUFO.img,x,y,batUFO.size,batUFO.size);
    else context.drawImage(batUFO.img,batUFO.x,batUFO.y,batUFO.size,batUFO.size);
    if(x)batUFO.x=x;
    if(y)batUFO.y=y;
}

function drawEX (x,y) {
    if (x && y) {
        context.drawImage(explos.img, x - 50, y - 50, 100, 100);
        explos.x = x;
        explos.y = y;
    }
    else
        context.drawImage(explos.img,explos.x-50,explos.y-50,100,100);
}

function drawBG () {
    context.fillStyle = context.createPattern(background,"no-repeat");
    context.fillRect(0,0,width,height);
    context.strokeRect(0,0,width,height);
}

function drawUFO (rand, x,y) {
    if (rand) {
        var ux=0;
        var uy=0;
        while(ux>(width/2-uVector*60) && ux<(width/2+uVector*60) &&
        uy>(height/2-uVector*60) && uy<(height/2+uVector*60) || ux===0 && uy===0){
            ux = Math.random() * (width - 2 * ufo.size) + ufo.size;
            uy = Math.random() * (height - 2 * ufo.size) + ufo.size;
        }
        ufo.stepX=0;
        ufo.stepY=0;
    }
    else if (x && y){
        ux = x;
        uy = y;
    }
    else {
        ux=ufo.x;
        uy=ufo.y;
    }
    context.drawImage(ufo.img,ux,uy,ufo.size,ufo.size);
    ufo.x=ux;
    ufo.y=uy;
    ufo.exist=true;
    if((x+ufo.size/2)>rocket.rx && x<(rocket.rx+rocket.size)) {
        if((y+ufo.size/2)>rocket.ry && y<(rocket.ry+rocket.size)){
            heart.life--;
            clearALL();
            drawUFO(true);
        }
    }
    if(heart.life<0){
        menu=true;
        requestAnimationFrame(loop);
        logoText = "Game Over";
    }
}

function drawRocket(x,y,a) {
    var dx = x+rocket.size/2;
    var dy = y+rocket.size/2;

    if (a){
        context.save();
        context.translate(dx,dy);
        context.rotate(a*(Math.PI/180));
        context.translate(-dx,-dy);
    }
    context.drawImage(rocket.img,rocket.rx,rocket.ry,rocket.size,rocket.size);

    if (a){
        context.restore();
    }
}

function drawHearts() {
    for (var i=0; i<heart.life; i++)
    context.drawImage(heart.img,i*heart.size+20,20,heart.size,heart.size);
}

function drawButton() {
    if(isDrawNet)
        drawNet();
    context.drawImage(button.img,button.x,button.y,button.size*2.5,button.size);
    //write("сетка",600,600,70);
    write("сетка",button.x+button.size/4,button.y+button.size/1.5,65);
}

//----------------игровой процесс-------------------------------------------------

var angle=1;
var rotate=false;
var count=0;
const stepTime=15;
var shotX="000";
var shotY="000";
var position=0;
var isDrawNet=false;
var uVector=height/380;

setInterval(function () {
    if(!menu)gameStart();
},1000/60);

function gameStart() {
    count++;
    clearALL();
    write((stepTime-Math.trunc(count/60)),width/20,height/5,50);
    if(heart.life<0){
        heart.life=3;
    }
    if (count===(60*stepTime)){
        count=0;
        clearALL();
        step();
    }
    if (!ufo.exist){
        drawUFO(true);
        clearALL();
    }
    if (rotate) {
        clearALL();
        angle++;
    }
    //--------для обЪектов, исчезающий после некоторого времени-----------
    if (explos.exist && explos.count>0){
        explos.count--;
        if (explos.count<=0){
            explos.exist=false;
            clearALL();
        }
    }
    if (batUFO.exist && batUFO.count>0){
        batUFO.count--;
        if (batUFO.count<=0){
            batUFO.exist = false;
            clearALL();
        }
    }
}

function shot (ar){
    var x = ar[0];
    var y = ar[1];
    if (x>ufo.x && x<(ufo.x+ufo.size) && y>ufo.y && y<(ufo.y+ufo.size)){
        ufo.exist=false;
        ufo.stepX=0;
        ufo.stepY=0;
        count=0;
        drawBAT_UFO(ufo.x,ufo.y);
        batUFO.exist=true;
        batUFO.count=120;
    }
    else {
        drawEX(x,y);
        explos.exist=true;
        explos.count=120;
    }
}

//события при нажатии на клавиатуру
var body = document.getElementById("body");
body.onkeyup = function (e) {
    //alert(e.keyCode);
    if(e.keyCode>47 && e.keyCode<58 || e.keyCode===189)inputXY(e.keyCode);
    if(e.keyCode===32)shot(convert(shotX,shotY));
    if(e.keyCode===39 && position<5)position++;
    if(e.keyCode===37 && position>0)position--;
    if(e.keyCode===38 && parseInt((shotX+shotY)[position])!==9) inputXY(0,parseInt((shotX+shotY)[position])+1);
    if(e.keyCode===40 && parseInt((shotX+shotY)[position])!==0) inputXY(0,parseInt((shotX+shotY)[position])-1);
};

function inputXY(keyCode,number) {
    var xy="0";
    if(!number)switch(keyCode){
        case 48:xy="0";break;
        case 49:xy="1";break;
        case 50:xy="2";break;
        case 51:xy="3";break;
        case 52:xy="4";break;
        case 53:xy="5";break;
        case 54:xy="6";break;
        case 55:xy="7";break;
        case 56:xy="8";break;
        case 57:xy="9";break;
        case 189:xy="-";break;
    }
    else xy=""+number;
    var result = "";
    if(position<3){
        if (xy==='-' && shotX[0]==="-"){
            shotX=shotX.substring(1,4);
        }
        else if(xy==='-'){
            shotX="-"+shotX;
        }
        else {for(var i=0; i<shotX.length;i++){
                result+=(((shotX[0]==='-')?(position)+1:position)===i)?xy:shotX[i];
            }shotX=result;}
    }else if(position>=3){
        if (xy==='-' && shotY[0]==="-"){
            shotY=shotY.substring(1,4);
        }
        else if(xy==='-'){
            shotY="-"+shotY;
        }
        else {for(var j=0; j<shotY.length;j++){
            result+=(((shotY[0]==='-')?(position-3)+1:position-3)===j)?xy:shotY[j];
        }shotY=result;}
    }
    if(position<5 && xy!=='-' && !number)position++;
    else if (xy!=="-" && !number)position=0;
}

function step(){
    if(ufo.stepX===0 && ufo.stepY===0)
    if (ufo.x > width/2){
        ufo.stepX = -(ufo.x-width/2)/5;
    } else if(ufo.x < width/2){
        ufo.stepX = (width/2-ufo.x)/5;
    }else ufo.stepX=0;
    if (ufo.y > height/2){
        ufo.stepY = -(ufo.y - height/2)/5;
    } else if (ufo.y < height/2){
        ufo.stepY = (height/2-ufo.y)/5;
    }else ufo.stepY=0;
    var x = ufo.x+ufo.stepX;
    var y = ufo.y+ufo.stepY;
    drawUFO(false,x,y);
}
//метод переделывает координаты, вводимые пользователем, в понятные системе (левый верхний угол)
function convert(shotX,shotY){
    var x = parseInt(shotX);
    var y = parseInt(shotY);
    var uVector=height/380;
    var result = [width/2,height/2];
    if (x>0) {
        result[0] = (x * uVector) + width / 2;
    }
    else if (x<0) {
        result[0] = width / 2 - (Math.abs(x) * uVector);
    }
    if (y>0)
        result[1]=height/2-(y*uVector);
    else if (y<0)
        result[1]=(Math.abs(y)*uVector)+height/2;
    return result;
}

function drawAbsOrd(){
    context.lineWidth = 2;
    context.strokeStyle = 'white';

    context.beginPath();
    context.moveTo(0,height/2);
    context.lineTo(width,height/2);
    context.stroke();

    context.lineHeight = 2;
    context.beginPath();
    context.moveTo(width/2,0);
    context.lineTo(width/2,height);
    context.stroke();

    context.strokeStyle = 'red';
    for (var i=0;i<7;i++){
        context.beginPath();
        context.moveTo(width/2-5,height/2-((180-i*60)*uVector));
        context.lineTo(width/2+5,height/2-((180-i*60)*uVector));
        context.stroke();
    }
    for (var j=0;j<7;j++){
        context.beginPath();
        context.moveTo(width/2-((180-j*60)*uVector),height/2+5);
        context.lineTo(width/2-((180-j*60)*uVector),height/2-5);
        context.stroke();
    }
}

function drawNet(){
    context.lineWidth=1;
    context.strokeStyle = 'orange';

    var uVector=height/380;
    for (var i=0;i<7;i++){
        context.beginPath();
        context.moveTo(0,height/2-((180-i*60)*uVector));
        context.lineTo(width,height/2-((180-i*60)*uVector));
        context.stroke();
    }

    context.lineHeight=1;
    for (var j=0;j<7;j++){
        context.beginPath();
        context.moveTo(width/2-((180-j*60)*uVector),0);
        context.lineTo(width/2-((180-j*60)*uVector),height);
        context.stroke();
    }
}

//--------------не игровые методы...------------------
function write(text,x,y,size,baseline,position,alpha) {
    context.fillStyle = "red";
    if(baseline)switch (baseline){
        case "end":context.textAlign = "end";break;
        case "center":context.textAlign = "center";break;
        default:context.textAlign ="start";break;
    }
    if(position===0 || position){
        var wCh = parseInt(str_size(text,"sans-serif",size))/text.length;
        if(text[0]==='-')position++;
        if(baseline==="end") {
            context.fillRect(x - wCh*text.length + wCh*position, y - size, size / 1.8, size*1.2);
        }
        else
            context.fillRect(x+wCh*position,y-size,size/1.8,size*1.2);
    }
    if(alpha)
        context.fillStyle="rgba(255,255,255,"+alpha+")";
    else
        context.fillStyle="white";
    context.font="bold "+size+"px sans-serif";
    context.fillText(text,x,y);
    //alert(text);
}


function str_size(text, fontfamily, fontsize) {
    var str = document.createTextNode(text);
    var str_size = Array();
    var obj = document.createElement('A');
    obj.style.fontSize = fontsize + 'px';
    obj.style.fontFamily = fontfamily;
    obj.style.margin = 0 + 'px';
    obj.style.padding = 0 + 'px';
    obj.appendChild(str);
    document.body.appendChild(obj);
    str_size[0] = obj.offsetWidth;
    str_size[1] = obj.offsetHeight;
    document.body.removeChild(obj);
    return str_size[0];
}

function clearALL() {
    context.clearRect(0, 0, width, height);
    drawBG();
    drawAbsOrd();
    drawButton();
    drawRocket(rocket.rx, rocket.ry, angle);
    drawHearts();
    write(shotX,width/2-10,height-height/10,70,"end",(position<3)?position:undefined);
    write(shotY,width/2+10,height-height/10,70,"start",(position>=3)?position-3:undefined);
    if (ufo.exist)drawUFO(false);
    if (batUFO.exist)drawBAT_UFO();
    if(explos.exist)drawEX(false);
}

//ловец кликов
document.onclick=function (e) {
    if (e.pageX>(width/2-rocket.size/2)&&e.pageX<(width/2+rocket.size/2))
        if (e.pageY>(height/2-rocket.size/2)&&e.pageY<(height/2+rocket.size/2)){
            menu=!menu;
            if(menu)requestAnimationFrame(loop);
        }
    if (!menu &&e.pageX>(button.x)&&e.pageX<(button.x+button.size*2.5)){
        if(e.pageY>(button.y)&&e.pageY<(button.y+button.size))
            isDrawNet=!isDrawNet;
    }
};
