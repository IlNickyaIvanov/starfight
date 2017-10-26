
var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
context = canvas.getContext("2d");

var menu = true;
var logoText = "Star Fight!";
var alpha=0.5;
var pow=0.02;

var sun = {
    img:document.getElementById("sun"),
    size:width/5,
    x:width/2-width/10,
    y:height/2-width/10,
    light:document.getElementById("light"),
    lightsize:1,
    pow:0.002
};
var earth = {
    img:document.getElementById("earth"),
    size:width/15,
    r:height/4,
    a:0,
    s:0.001,
    x:0,
    y:0
};

function drawSun() {
    if (sun.lightsize<=0.95 || sun.lightsize>=1.05)
        sun.pow=-sun.pow;
    sun.lightsize+=sun.pow;
    context.drawImage(sun.light,width/2 - sun.lightsize/2*sun.size,height/2 - sun.lightsize/2*sun.size,sun.lightsize*sun.size,sun.lightsize*sun.size);
    context.drawImage(sun.img,sun.x,sun.y,sun.size,sun.size);
}
function drawEarth(x,y) {
    earth.x=x-earth.size/2;
    earth.y=y-+earth.size/2;
    context.drawImage(earth.img,earth.x,earth.y,earth.size,earth.size);
}

function random(n) {
    return ( Math.random() * n)
}
stars = new Array(600).fill().map(function() {
    return {
        r: random(width), s: random(0.009), a: random(Math.PI * 2)
    };
});

function animMenu() {
    //анимация звезд
    context.fillStyle = "rgba(0,0,8,0.2)";
    context.fillRect(0,0,width,height);
    for (var i = 0; i<stars.length;i++) {
        stars[i].a += stars[i].s;
        context.beginPath();
        context.arc(Math.cos(stars[i].a) * stars[i].r + width / 2, Math.sin(stars[i].a) * stars[i].r + height / 2, 1, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = "white";
        context.fill();
    }

    //анимация Земли
    if(earth.a>=2*Math.PI)earth.a=0;
    earth.a+=Math.PI*earth.s;
    drawEarth(Math.cos(earth.a)*earth.r+width/2,Math.sin(earth.a)*earth.r+height/2);

    //отрисовка остальных объектов
    drawSun();
    write(logoText,width/2,height/6,70,"center");
    if (alpha<=0 || alpha>=1)
        pow=-pow;
    alpha+=pow;
    write("Нажми на Cолнце, чтобы начать...",width/2,height-height/10,30,"center",alpha);

    if(menu)requestAnimationFrame(animMenu);
}

requestAnimationFrame(animMenu);

//ловец кликов
document.onclick = function (e) {
    if(menu && checkClick(e,earth))
        alert("рекорды в разработке!");
    else if(checkClick(e,(menu)?sun:rocket)){
        menu=!menu;
        if(menu){
            requestAnimationFrame(animMenu);
        }else  {
            heart.life=3;
            gameStart();
        }
    }
    else if(!menu && checkClick(e,button)) {
        isDrawNet=!isDrawNet;
    }
};

function checkClick(event,object){
    var result = false;
    if(event.pageX>object.x && event.pageY>object.y)
        if(event.pageX<(object.x+object.size) && event.pageY<(object.y+object.size)) {
            result = true;
        }
   return result;
}

