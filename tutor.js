var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
context = canvas.getContext("2d");

var plate={
    text:"",
    x:0, y:0,
    width:width/4,
    height:height/6,
    alpha:0
};
var isTutor = false;
var isTask = false;
var mesCount = 0;

//0 в конце - положения окна по центру (по умолчанию оно в углу)
//в квадртных скобках положение тарелки
var messages = ["Добро Пожаловать, друг! 0","Злые тарелки атакуют ракету!\n Помоги её защитить!\n(Нажми пробел или enter для выстрела) [120,120]","Отличный выстрел! Так держать!",
"Смотри, еще одна...\n В этот раз придется делать\n все самому)))","Начни вводить X координату,\n  затем нажми пробел, введи Y \n и еще раз пробел для выстрела... [60,60]","Точное попадание!",
"Теперь ты умеешь стрелять по \nтарелкам. Но это не все, что есть в игре.\n Тебя ждут бонусы, кроважадные \nинопланетяне и многое другое...) 0"];

function tutor() {
    if(isTask && !ufo.exist){
        isTask=false;
        mesCount++;
    }
    if(mesCount<messages.length)
        drawPlate("Обучение: "+(mesCount+1)+"/"+messages.length,messages[mesCount]);
    else{
        drawPlate("Поздравляем!","Вы прошли вводный курс,\nмой юнный падаван! 0");
        setCookie("tutorial","completed");
    }
}
function drawPlate(tittle,text) {
    if(plate.alpha<1)
        plate.alpha+=0.04;
    context.fillStyle="rgba(211,35,235,"+plate.alpha+")";
    if(text[text.length-1]==='0'){
        plate.x=width/4;plate.width = width/2;
        plate.y=height/3; plate.height = height/4;
        text = text.substring(0,text.length-1)
    }
    else {
        plate.x=0;plate.width = width/2-10;
        plate.y=height/2+50; plate.height = height/5;
    }
    context.fillRect(plate.x,plate.y,plate.width,plate.height);
    write(tittle,plate.x+plate.width/2,plate.y+45,40,"center");
    if(text.indexOf("[")!==-1){
        isTask=true;
        var ufoXY=(text.substring(text.indexOf("[")+1,text.indexOf("]"))).split(",");
        ufoXY=convert(ufoXY[0],ufoXY[1]);
        drawUFO(ufo,false,ufoXY[0],ufoXY[1]);
        text=text.substring(0,text.indexOf("["));
    }
    write(text,plate.x+plate.width/2,plate.y+plate.height/2,25,"center");
}

function setCookie(name,value) {
    var date = new Date;
    date.setDate(date.getDate() + 30);
    document.cookie = name+"="+value+"; path=/; expires=" + date.toUTCString();
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function deleteCookie() {
    document.cookie = "tutorial=; path=/; expires=-1";
    alert("обнуление обучения");//+ на клавиатуре
}

if(!getCookie("tutorial"))
    isTutor=true;