
var note={
    timeCount:0,
    x:0.65*width,
    y:0.8*height,
    width:width/3,
    height:height/10,
    text:"",
    alpha:0,
    pow:0.04
};

if(!getCookie("tutorial")){
    isTutor=true;
    notice("Welcome Junior!",180);
}
function notice(text,time){
    if(time)
        note.timeCount=time;
    if(note.text==="")
        note.text=text;
    context.fillStyle="rgba(254,146,37,"+note.alpha+")";
    context.fillRect(note.x,note.y,note.width,note.height);
    write(note.text,note.x+note.width/2,note.y+note.height/2,25,"center");
    if(note.timeCount>0) {
        note.timeCount--;
        if(note.alpha<1)
            note.alpha+=note.pow;
        requestAnimationFrame(notice);
    }
    else if(note.alpha>0){
        note.alpha-=note.pow;
        requestAnimationFrame(notice)
    }
    else {
        note.text="";
    }
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

//функция, которая всеми силами пытается устранить минусы выведения текста в canvas
function write(text, x, y, size, baseline, alpha) {
    context.textAlign = "start";
    text = text.toString();
    if (baseline) switch (baseline) {
        case "end":
            context.textAlign = "end";
            break;
        case "center":
            context.textAlign = "center";
            break;
        default:
            context.textAlign = "start";
            break;
    }
    if (alpha)
        context.fillStyle = "rgba(255,255,255," + alpha + ")";
    else
        context.fillStyle = "white";
    context.font = "bold " + size + "px sans-serif";
    if (text.indexOf("\n") !== -1) {
        var rows = text.split("\n");
        for (var i = 0; i < rows.length; i++) {
            write(rows[i], x, y, size, "center", alpha);
            y += size;
        }
    }
    else context.fillText(text, x, y);
}
