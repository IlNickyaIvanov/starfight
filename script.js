var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
context = canvas.getContext("2d");
//обЪекты
var background = document.getElementById("background");

var rocket = {
    img: document.getElementById("rocket"),
    size: width / 10,
    x: width / 2 - width / 10 / 2,
    y: height / 2 - width / 10 / 2,
    a: 0
};

var ufo = {
    type: 1,
    img: document.getElementById("ufo"),
    exist: false,
    size: width / 10,
    stepX: 0,
    stepY: 0
};
var or_ufo = {
    type: 2,
    img: document.getElementById("or_ufo"),
    exist: false,
    size: width / 10,
    stepX: 0,
    stepY: 0
};
var batUFO = {
    type: 1,//(1 - ufo or 2 - or_ufo )'s img
    fire: document.getElementById("fire"),
    exist: false,
    size: width / 10,
    count: 120
};

var enemy = [];

var explosion = {
    img: document.getElementById("expl"),
    count: 60,
    exist: false,
    size: 40,
    x: 0,
    y: 0
};

var heart = {
    img: document.getElementById("heart"),
    life: 0,
    size: width / 15
};

var button = {
    img1: document.getElementById("button"),
    img2: document.getElementById("cl_button"),
    size: width / 13,
    x: width - width / 13 - 15,
    y: 20
};

var bullet = {
    img: document.getElementById("bullet"),
    size: width / 10,
    x: 0,
    y: 0
};

var life = {
    img: document.getElementById("life"),
    size: width / 10,
    exist: false,
    pow: 1,
    count: 120,
    x: 0,
    y: 0
};

var star = {
    img: document.getElementById("star"),
    size: width / 10,
    exist: false,
    pow: 1,
    count: 120,
    x: 0,
    y: 0
};

//отрисовка обЪектов
function drawBAT_UFO(batUFO, x, y, type) {
    if (x && y) {
        batUFO.exist = true;
        batUFO.count = 120;
        batUFO.x = x;
        batUFO.y = y;
    }
    else batUFO.count--;
    if (type)
        batUFO.type = type;
    if (batUFO.type === 1)
        context.drawImage(ufo.img, batUFO.x, batUFO.y, batUFO.size, batUFO.size);
    else if (batUFO.type === 2)
        context.drawImage(or_ufo.img, batUFO.x, batUFO.y, batUFO.size, batUFO.size);
    context.drawImage(batUFO.fire, batUFO.x, batUFO.y, batUFO.size, batUFO.size);
    if (batUFO.count <= 0)
        enemy.splice(batUFO.id, 1);
}

function drawUFO(ufo, rand, x, y) {
    if (rand) {
        var randXY = randomXY();
        var ux = randXY.x;
        var uy = randXY.y;
        ufo.stepX = 0;
        ufo.stepY = 0;
        ufo.exist = true;
    }
    else if (x && y) {
        ux = x - ufo.size / 2;
        uy = y - ufo.size / 2;
        ufo.exist = true;
    }
    else {
        ux = ufo.x;
        uy = ufo.y;
    }
    context.drawImage(ufo.img, ux, uy, ufo.size, ufo.size);
    ufo.x = ux;
    ufo.y = uy;
    if ((ux + ufo.size / 2) > rocket.x && ux < (rocket.x + rocket.size) && ufo.exist) {
        if ((uy + ufo.size / 2) > rocket.y && uy < (rocket.y + rocket.size)) {
            ufo.exist = false;
            enemy.splice(ufo.id, 1);
            heart.life--;
            clearALL();
            //drawUFO(true);
        }
    }
    if (heart.life < 0) {
        gameOver();
    }
}

function drawEX(x, y) {
    if (x && y) {
        context.drawImage(explosion.img, x - explosion.size / 2, y - explosion.size / 2, explosion.size, explosion.size);
        explosion.x = x;
        explosion.y = y;
        explosion.exist = true;
        explosion.count = 60;
    }
    else
        context.drawImage(explosion.img, explosion.x - 50, explosion.y - 50, 100, 100);
}

function drawBG() {
    context.fillStyle = context.createPattern(background, "no-repeat");
    context.fillRect(0, 0, width, height);
    context.strokeRect(0, 0, width, height);
}

function drawRocket(a) {
    var dx = rocket.x + rocket.size / 2;
    var dy = rocket.y + rocket.size / 2;

    if (a) rocket.a = a;
    context.save();
    context.translate(dx, dy);
    context.rotate(rocket.a);//*(Math.PI/180)); если угол в градусах
    context.translate(-dx, -dy);

    context.drawImage(rocket.img, rocket.x, rocket.y, rocket.size, rocket.size);

    context.restore();
}

function drawHearts() {
    for (var i = 0; i < heart.life; i++)
        context.drawImage(heart.img, i * heart.size + 20, 20, heart.size, heart.size);
}

function drawButton() {
    if (isDrawNet) {
        drawNet();
        context.drawImage(button.img2, button.x, button.y, button.size, button.size);
    }
    else context.drawImage(button.img1, button.x, button.y, button.size, button.size);
    //write("сетка",button.x+button.size/4,button.y+button.size/1.5,65);
}

function drawBullet(x, y, a) {
    if (a) {
        a = -((x < width / 2) ? Math.PI : 0) + a;
        context.save();
        context.translate(x, y);
        context.rotate(a);
        context.translate(-x, -y);
    }
    context.drawImage(bullet.img, x - bullet.size / 2, y - bullet.size / 2, bullet.size, bullet.size);
    if (a) {
        context.restore();
    }
    bullet.x = x;
    bullet.y = y;
}

function drawBonus(bonus,x, y) {
    if (x && y) {
        context.drawImage(bonus.img, x - bonus.size / 2, y - bonus.size / 2, bonus.size, bonus.size);
        bonus.x = x;
        bonus.y = y;
        bonus.exist = true;
        bonus.count = 60;
    }
    else
        context.drawImage(bonus.img, bonus.x - bonus.size / 2, bonus.y - bonus.size / 2, bonus.size, bonus.size);
}

//----------------игровой процесс---------------------------------------------------------------------------------------
var count = 0;
var stepTime = 0;//задается GameCount
var isDrawNet = false;
var uVector = height / 380;
var shotX = "", shotY = "";
var x = 0, y = 0;
var positionX = true;
var points = 0;
var enemy_points=0;
var alpha = 0.5;
var pow = 0.02;
var wave = 1;

function gameStart() {
    if (!isTutor) count++;
    //шаг обычных тарелок
    if (count === (60 * stepTime)) {
        count = 0;
        for (var i = 0; i < enemy.length; i++) {
            if (enemy[i].type === 1 && !enemy[i].fire) step(enemy[i]);
        }

    }
    //создание врагов
    if (Math.random() >= 0.5 && !isTutor && active_ufo()) {
        add_cloneUFO(enemy, ufo);
    }
    if (wave > 1 && Math.random() < 0.5 && active_ufo()) {
        add_cloneUFO(enemy, or_ufo);
        animUFO2(enemy[enemy.length - 1], enemy.length - 1);
    }
    //--------для обЪектов, исчезающий после некоторого времени-----------
    if (explosion.exist && explosion.count > 0) {
        explosion.count--;
        if (explosion.count <= 0) {
            explosion.exist = false;
        }
    }
    if (points % 5 === 0 && !life.exist && !star.exist && points > 0) {
        createBonus();
    }
    //обновление экрана
    clearALL();
    if (game) requestAnimationFrame(gameStart);

    if (isTutor)
        requestAnimationFrame(tutor);
}

//обнуление всех параметров
function gameOver() {
    shotX = "";
    shotY = "";
    wave = 1;
    menu = true;
    game = false;
    enemy.length = 0;
    life.exist = false;
    logoText = "Ваш счет: " + points;
    requestAnimationFrame(animMenu);
    points = 0;
    heart.life = 0;
}

function clearALL() {
    context.clearRect(0, 0, width, height);
    drawBG();
    drawAbsOrd();
    drawButton();
    drawRocket();
    drawHearts();
    drawXY();
    for (var i = 0; i < enemy.length; i++) {
        if (enemy[i].id !== i) enemy[i].id = i;
        if (!enemy[i].fire) drawUFO(enemy[i], false);
        else if (enemy[i].fire) drawBAT_UFO(enemy[i]);
    }
    if (life.exist) drawBonus(life);
    if (star.exist) drawBonus(star);
    if (explosion.exist) drawEX(false);
    write(Math.round(stepTime - count / 60), width / 20, height / 5, 50);
    write(points, 0.9 * width, 0.2 * height);
}

//события при нажатии на клавиатуру
var body = document.getElementById("body");
body.onkeydown = function (e) {
    //alert(e.keyCode);
    if (e.keyCode > 47 && e.keyCode < 58 || e.keyCode === 189) inputXY(e.keyCode);
    if (e.keyCode === 32 || e.keyCode === 13)
        if (!positionX) shot(convert(shotX, shotY));
        else positionX = false;
    if (e.keyCode === 39 && positionX) {
        positionX = false;
        shotY = "";
    }
    if (e.keyCode === 37 && !positionX) {
        positionX = true;
        shotX = "";
    }
    if (e.keyCode === 8)
        if (positionX) shotX = shotX.substring(0, shotX.length - 1);
        else shotY = shotY.substring(0, shotY.length - 1);
    if (e.keyCode === 187) destroy_all();
};

function shot(ar) {
    positionX = true;
    var x = ar[0];
    var y = ar[1];
    this.x = x;
    this.y = y;
    var shX = parseInt(shotX);
    var shY = parseInt(shotY);
    var startAngle = rocket.a;
    this.x = 0;
    this.y = 0;
    shotY = "";
    shotX = "";
    animate({
        duration: 1000,
        timing: function (timeFraction) {
            return timeFraction;
        },
        draw: function (progress) {
            drawRocket(startAngle - progress * (Math.atan((shY !== 0) ? shY / shX : 1 / shX) + startAngle - Math.PI / 2 - ((x < width / 2) ? Math.PI : 0)));
            return true;
        },
        onEnd: function () {
            animate({
                duration: 1000,
                timing: function (timeFraction) {
                    return timeFraction
                },
                draw: function (progress) {
                    drawBullet((x - width / 2) * progress + width / 2, (y - height / 2) * progress + height / 2,
                        -Math.atan((shY !== 0) ? shY / shX : 1 / shX));
                    return true;
                },
                onEnd: function () {
                    var hitting = checkShot(x, y);
                    var object = null;
                    switch (hitting[0]) {
                        case (1):
                        case (2):
                            object = enemy;break;
                        case (3):
                            object = life;
                            heart.life++;
                            life.exist = false;
                            break;
                        case (4):
                            object = star;
                            star.exist=false;
                            destroy_all();
                            break;
                    }
                    if (object !== null) {

                        points++;
                        if (points - enemy_points > points/5)
                            enemy_points+=points/6;
                        else enemy_points = points;

                        if (points > (getCookie("score") || 0)) {
                            setCookie("score", points);
                            notice("Новый рекорд!\n" + points, 180);
                        }
                        if (hitting[0]<3){
                            object[hitting[1]].exist = false;
                            object[hitting[1]] = getClone(batUFO, object[hitting[1]]);
                            count = 0;
                            if (stepTime > 5) stepTime -= 1;
                            //усовершенствовать после введения других видов противников
                            if (points >= 5 && !isTutor && wave < 2) {
                                wave = 2;
                                stepTime = gameCount;
                            }
                        }
                    }
                    drawEX(x, y);
                }
            });
        }
    });
}

function checkShot(x, y) {
    for (var i = 0; i < enemy.length; i++)
        if (checkClick({pageX: x, pageY: y}, enemy[i])) return [enemy[i].type, i];
    if (checkClick({pageX: x, pageY: y}, {
            x: life.x - width / 12,
            y: life.y - width / 12,
            size: width / 6
        })) return [3, 0];
    if (checkClick({pageX: x, pageY: y}, {
            x: star.x - width / 12,
            y: star.y - width / 12,
            size: width / 6
        })) return [4, 0];
    return 0;
}

function drawShot() {
    if (shotX !== "" || shotY !== "") {
        var conv = convert(shotX, shotY);
        x = conv[0];
        y = conv[1];

        context.beginPath();
        context.fillStyle = "rgba(31,108,240,1)";
        context.strokeStyle = "rgba(31,108,240,1)";
        context.arc(x, height / 2, 5, 0, Math.PI * 2, false);
        context.fill();
        context.moveTo(x, (y === 0) ? 0 : height / 2);
        context.lineTo(x, (y === 0) ? height : y);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.fillStyle = "rgba(29,179,49,1)";
        context.strokeStyle = "rgba(29,179,49,1)";
        context.arc(width / 2, y, 5, 0, Math.PI * 2, false);
        context.fill();
        context.moveTo((x === 0) ? 0 : width / 2, y);
        context.lineTo((x === 0) ? width : x, y);
        context.stroke();
        context.closePath();
    }
    if (game) requestAnimationFrame(drawShot);
}

function inputXY(keyCode) {
    var xy = "0";
    switch (keyCode) {
        case 48:
            xy = "0";
            break;
        case 49:
            xy = "1";
            break;
        case 50:
            xy = "2";
            break;
        case 51:
            xy = "3";
            break;
        case 52:
            xy = "4";
            break;
        case 53:
            xy = "5";
            break;
        case 54:
            xy = "6";
            break;
        case 55:
            xy = "7";
            break;
        case 56:
            xy = "8";
            break;
        case 57:
            xy = "9";
            break;
        case 189:
            xy = "-";
            break;
        default:
            break;
    }
    if (positionX && (shotX.length < 4 && shotX[0] === "-" || shotX.length < 3 && shotX[0] !== "-")) {
        if (xy === '-' && shotX[0] === "-") {
            shotX = shotX.substring(1, shotX.length);
        }
        else if (xy === '-') {
            shotX = "-" + shotX;
        }
        else shotX += xy;
    } else if (!positionX && (shotY.length < 4 && shotY[0] === "-" || shotY.length < 3 && shotY[0] !== "-")) {
        if (xy === '-' && shotY[0] === "-") {
            shotY = shotY.substring(1, shotY.length);
        }
        else if (xy === '-') {
            shotY = "-" + shotY;
        }
        else shotY += xy;
    }
    var conv = convert(shotX, shotY);
    x = conv[0];
    y = conv[1];
}

function drawXY() {
    var texts = str_size("000", "sans-serif", 70) * 1.5;
    var size = 60;
    if (alpha <= 0 || alpha >= 1)
        pow = -pow;
    alpha += pow;
    if (positionX) {
        context.fillStyle = "rgba(31,108,240," + alpha + ")";
        context.fillRect(width / 2 - texts - 10, height - height / 12 - size - 5, texts, size * 1.2);
        context.fillStyle = "rgba(29,179,49,1)";
        context.fillRect(width / 2 + 10, height - height / 12 - size - 5, texts, size * 1.2);
    } else {
        context.fillStyle = "rgba(31,108,240,1)";
        context.fillRect(width / 2 - texts - 10, height - height / 12 - size - 5, texts, size * 1.2);
        context.fillStyle = "rgba(29,179,49," + alpha + ")";
        context.fillRect(width / 2 + 10, height - height / 12 - size - 5, texts, size * 1.2);
    }
    write(shotX, width / 2 - 30, height - height / 12, 70, "end");
    write(shotY, width / 2 + 30, height - height / 12, 70, "start");
}

function step(ufo) {
    //если тарелка создается впервые, то у нее нет шаговых пременных, их нужно создать для каждой индивидуально
    if (ufo.stepX === 0 && ufo.stepY === 0) {
        if (ufo.x) ufo.stepX = (ufo.x - ufo.size / 2 > width / 2) ? -(ufo.x + ufo.size / 2 - width / 2) / 5 : (width / 2 - (ufo.x + ufo.size / 2)) / 5;
        else ufo.stepX = 0;
        if (ufo.y) ufo.stepY = (ufo.y - ufo.size / 2 > height / 2) ? -(ufo.y + ufo.size / 2 - height / 2) / 5 : (height / 2 - (ufo.y + ufo.size / 2)) / 5;
        else ufo.stepY = 0;
    }
    var fromX = ufo.x + ufo.size / 2;
    var fromY = ufo.y + ufo.size / 2;
    animate({
        duration: 1000,
        timing: function (timeFraction) {
            return Math.pow(timeFraction, 5);
        },
        draw: function (progress) {
            drawUFO(ufo, false, ufo.stepX * progress + fromX, ufo.stepY * progress + fromY);
            return ufo.exist;
        },
        onEnd: function () {
        }
    });
}

function animUFO2(or_ufo, id) {
    var x = or_ufo.x;//X and y у тарелки - левый верхний угол
    var y = or_ufo.y;
    animate({
        duration: 2*stepTime*1000,
        timing: function (timeFraction) {
            return timeFraction
        },
        draw: function (progress) {
            or_ufo.x = x - (x - width / 2) * progress-or_ufo.size/2;
            or_ufo.y = y - (y - height / 2) * progress-or_ufo.size/2;
            //if (or_ufo.exist) drawUFO(or_ufo, false, x - (x - width / 2) * progress, y - (y - height / 2) * progress);
            return (or_ufo.exist && game);
        },
        onEnd: function () {
            if (or_ufo.exist) {
                enemy.splice(id, 1);
            }
        }
    });
}

//метод переделывает координаты, вводимые пользователем, в понятные системе (левый верхний угол)
function convert(shotX, shotY) {
    var x = parseInt(shotX);
    var y = parseInt(shotY);
    var uVector = height / 380;
    var result = [width / 2, height / 2];
    if (x > 0) {
        result[0] = (x * uVector) + width / 2;
    }
    else if (x < 0) {
        result[0] = width / 2 - (Math.abs(x) * uVector);
    }
    if (y > 0)
        result[1] = height / 2 - (y * uVector);
    else if (y < 0)
        result[1] = (Math.abs(y) * uVector) + height / 2;
    return result;
}

function drawAbsOrd() {
    context.lineWidth = 2;
    context.strokeStyle = 'white';

    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();

    context.lineHeight = 2;
    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2, height);
    context.stroke();

    context.strokeStyle = 'red';
    for (var i = 0; i < 7; i++) {
        context.beginPath();
        context.moveTo(width / 2 - 5, height / 2 - ((180 - i * 60) * uVector));
        context.lineTo(width / 2 + 5, height / 2 - ((180 - i * 60) * uVector));
        context.stroke();
    }
    for (var j = 0; j < 7; j++) {
        context.beginPath();
        context.moveTo(width / 2 - ((180 - j * 60) * uVector), height / 2 + 5);
        context.lineTo(width / 2 - ((180 - j * 60) * uVector), height / 2 - 5);
        context.stroke();
    }
}

function drawNet() {
    context.lineWidth = 1;
    context.strokeStyle = 'orange';

    var uVector = height / 380;
    for (var i = 0; i < 7; i++) {
        context.beginPath();
        context.moveTo(0, height / 2 - ((180 - i * 60) * uVector));
        context.lineTo(width, height / 2 - ((180 - i * 60) * uVector));
        context.stroke();
    }

    context.lineHeight = 1;
    for (var j = 0; j < 7; j++) {
        context.beginPath();
        context.moveTo(width / 2 - ((180 - j * 60) * uVector), 0);
        context.lineTo(width / 2 - ((180 - j * 60) * uVector), height);
        context.stroke();
    }
}

function str_size(text, fontfamily, fontsize) {
    var str = document.createTextNode(text);
    var str_size = [];
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

function animate(options) {
    var start = Date.now();
    requestAnimationFrame(function animate() {
        var timeFraction = (Date.now() - start) / options.duration;
        if (timeFraction > 1) timeFraction = 1;
        var progress = options.timing(timeFraction);
        if (timeFraction < 1 && options.draw(progress)) {
            requestAnimationFrame(animate);
        } else if (timeFraction >= 1)
            options.onEnd();
    });
}

function createBonus() {
    var randXY = randomXY();
    var bonus = {};
    if (Math.random()>=0.4) bonus=star;
    else bonus = life;
    drawBonus(bonus,randXY.x, randXY.y);
    animate({
        duration: bonus.count * 1000,
        timing: function (timeFraction) {
            return timeFraction;
        },
        draw: function () {
            if (bonus.size > width / 9 || bonus.size < width / 14) {
                bonus.pow = -bonus.pow;
            }
            bonus.size += bonus.pow;
            drawBonus(bonus);
            return bonus.exist && game;
        },
        onEnd: function () {
            bonus.exist = false;
        }
    })
}

function randomXY() {
    var ux = 0, uy = 0;
    var rand=120;
    while (ux + ufo.size / 2 > (width / 2 - uVector * rand) && ux + ufo.size / 2 < (width / 2 + uVector * rand) &&
    uy + ufo.size / 2 > (height / 2 - uVector * rand) && uy + ufo.size / 2 < (height / 2 + uVector * rand) || ux === 0 && uy === 0) {
        ux = Math.random() * width;
        uy = Math.random() * height;
    }
    return {x: ux, y: uy};
}

function active_ufo() {
    var ufo_count = 0;
    for (var i = 0; i < enemy.length; i++)
        if (!enemy[i].fire) ufo_count++;
    if (enemy_points===0 && enemy.length>0) return false;
    else return ufo_count <= enemy_points / 4;
}

function add_cloneUFO(array, object) {
    var clone = {};
    for (var key in ufo) {
        clone[key] = object[key];
    }
    clone.id = enemy.length;
    array.push(clone);
    drawUFO(array[array.length - 1], true);
}

function getClone(object, data) {
    var clone = {};
    for (var key in batUFO) {
        clone[key] = object[key];
    }
    if (data) {
        clone.x = data.x;
        clone.y = data.y;
        clone.type = data.type;
        clone.id = data.id;
    }
    return clone;
}

function destroy_all() {
    var array = [];
    for (var i = 0; i < enemy.length; i++) {
        array[i] = getClone(batUFO, enemy[i]);
        points++;
    }
    enemy = array;
    enemy_points=0;
    stepTime = gameCount;
}