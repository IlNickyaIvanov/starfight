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
var mesTime=0;

//0 в конце - положения окна по центру (по умолчанию оно в углу)
//в квадртных скобках положение тарелки
//{} особые команды t - ограничение по времени
var messages = ["Добро Пожаловать, друг! 0","Злые тарелки атакуют ракету!\n Помоги её защитить!\n(Нажми пробел или enter для выстрела) [120,120]","Отличный выстрел! Так держать!{t}",
"Смотри, еще одна...\n В этот раз придется делать\n все самому))){t}","Начни вводить X координату,\n  затем нажми пробел, введи Y \n и еще раз пробел для выстрела... [60,60]","Точное попадание!{t}",
"Теперь ты умеешь стрелять по \nтарелкам. Но это не все, что есть в игре.\n Тебя ждут бонусы, кроважадные \nинопланетяне и многое другое...) 0"];

function tutor() {
    if(isTask && !enemy.length){
        isTask=false;
        mesCount++;
    }
    if(mesCount<messages.length) {
        if(mesTime>0){
            mesTime--;
            if(mesTime===0)
                mesCount++;
        }
        if(mesCount===3){
            var xy=["60","60"];
            xy = convert(xy[0],xy[1]);
            drawUFO(ufo,false,xy[0],xy[1]);
        }
        drawPlate("Обучение: " + (mesCount + 1) + "/" + messages.length, messages[mesCount]);
    }
    else{
        drawPlate("Поздравляем!","Вы прошли вводный курс.\nУдачи в игре! 0");
        setCookie("tutorial","completed");
        notice("Новое достижение!\nЗемля разблокирована!",180);
        earth.exist=true;
    }
}
function drawPlate(tittle,text) {
    if(plate.alpha<1)
        plate.alpha+=0.04;
    context.fillStyle="rgba(211,35,235,"+plate.alpha+")";
    context.fillRect(plate.x,plate.y,plate.width,plate.height);
    write(tittle,plate.x+plate.width/2,plate.y+45,40,"center");
    if(!isTask && text.indexOf("[")!==-1){
        isTask=true;
        var ufoXY=(text.substring(text.indexOf("[")+1,text.indexOf("]"))).split(",");
        ufoXY=convert(ufoXY[0],ufoXY[1]);
        add_cloneUFO(enemy,ufo);
        drawUFO(enemy[enemy.length-1],false,ufoXY[0],ufoXY[1]);
        text=text.substring(0,text.indexOf("["));
    }
    if(mesTime===0 && text.indexOf("{")!==-1){
        var comnd=(text.substring(text.indexOf("{")+1,text.indexOf("}")));
        if(comnd==='t')
            mesTime=180;
        text=text.substring(0,text.indexOf("{"));
    }
    if(mesCount<messages.length)messages[mesCount]=text;
    if(text[text.length-1]==='0'){
        plate.x=width/4;plate.width = width/2;
        plate.y=height/3; plate.height = height/4;
        text = text.substring(0,text.length-1)
    }
    else {
        plate.x=0;plate.width = width/2-10;
        plate.y=height/2+50; plate.height = height/5;
    }
    write(text,plate.x+plate.width/2,plate.y+plate.height/2,25,"center");
}