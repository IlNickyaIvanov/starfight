

var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
context = canvas.getContext("2d");
var menu = true;
var logoText = "Star Fight!";

var sun = {
    img:document.getElementById("sun"),
    size:width/5,
    x:width/2-width/10,
    y:height/2-width/10,
    light:document.getElementById("light"),
    lightsize:1,
    pow:0.002
};

function drawSun() {
    if (sun.lightsize<=0.95 || sun.lightsize>=1.05)
        sun.pow=-sun.pow;
    sun.lightsize+=sun.pow;
    context.drawImage(sun.light,width/2 - sun.lightsize/2*sun.size,height/2 - sun.lightsize/2*sun.size,sun.lightsize*sun.size,sun.lightsize*sun.size);
    context.drawImage(sun.img,sun.x,sun.y,sun.size,sun.size);
}

function random(n) {
    return ( Math.random() * n)
}
stars = new Array(600).fill().map(function() {
    return {
        r: random(width), s: random(0.009), a: random(Math.PI * 2)
    };
});

var alpha=0.5;
var pow=0.02;
function loop() {
    context.fillStyle = "rgba(0,0,8,0.2)";
    context.fillRect(0,0,width,height);
    drawSun();
    write(logoText,width/2,height/4,70,"center");
    if (alpha<=0 || alpha>=1)
        pow=-pow;
    alpha+=pow;
    write("Нажми на Cолнце, чтобы начать...",width/2,height-height/10,30,"center",alpha);
    for (var i = 0; i<stars.length;i++) {
        stars[i].a += stars[i].s;
        context.beginPath();
        context.arc(Math.cos(stars[i].a) * stars[i].r + width / 2, Math.sin(stars[i].a) * stars[i].r + height / 2, 1, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = "white";
        context.fill();
    }
    if(menu)requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

