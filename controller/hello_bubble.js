var globle_height = 1000;//世界地图的高度
var globle_width = 1000;//世界地图的宽度
var randomBubble_queue = new Array();//随机生成的bubble
var User_queue = new Array();//用户队列
var freq = 10;//刷新频率
var Userlength = 0;//用户总数
var Bubblelength = 0;
var start = false;//开始

//生成随机的Bubble
function randomBubble(){
    for(var i = Bubblelength; i<100; i++)
    {
        randomBubble_queue[i] = new Object();
        randomBubble_queue[i].x = Math.floor(Math.random() * globle_width);
        randomBubble_queue[i].y = Math.floor(Math.random() * globle_height);
        randomBubble_queue[i].r = 5;
        randomBubble_queue[i].score = 1;
        randomBubble_queue[i].type = 0;
    }
    Bubblelength = 100;
    console.log(randomBubble_queue);
}

//bubble自相残杀
function eat(){
    for(var i = 0; i< User_queue.length; i++)
    {
        for(var k = 0; k<randomBubble_queue.length; k++)
        {

            if(distance(User_queue[i],randomBubble_queue[k]) <= User_queue[i].r + randomBubble_queue[k]) {
                checkstate(User_queue[i], randomBubble_queue[k]);
                randomBubble_queue.splice(k, 1);
                Bubblelength--;
            }
        }
        for(var j = i+1; j<User_queue.length; j++)
        {
            if(User_queue[i].r > User_queue[j].r) {
                if (distance(User_queue[i], User_queue[j]) < User_queue[i].r - User_queue[j].r) {
                    checkstate(User_queue[i], User_queue[j]);
                    User_queue[j].eaten = true;
                }
            }
            else if(User_queue[i].r < User_queue[j].r) {
                if (distance(User_queue[j], User_queue[i]) < User_queue[j].r - User_queue[i].r) {
                    checkstate(User_queue[j], User_queue[i]);
                    User_queue.live = false;
                }
            }
        }
    }
}

//bubble移动
function move()
{
    for(var i = 0; i < User_queue.length; i++)
    {
        var sx = User_queue[i].vecx - User_queue[i].x;
        var sy = User_queue[i].vecy - User_queue[i].y;
        User_queue[i].x += freq * User_queue[i].v * (sx / Math.sqrt(sx*sx + sy*sy));
        User_queue[i].y += freq * User_queue[i].v * (sy / Math.sqrt(sx*sx + sy*sy));
    }
}

//检查bubble状态
function checkstate(Bubblebig,Bubblesmall)
{
    Bubblesmall.eaten = true;
    Bubblebig.r = Math.sqrt(Bubblebig.r*Bubblebig.r + Bubblesmall.r*Bubblesmall.r);
    Bubblebig.v = 4000 / (Bubblebig.r * Bubblebig.r);
    Bubblebig.allscore += Bubblesmall.score;
    Bubblebig.score += Bubblesmall.score;
}

//计算bubble距离
function distance(bubblebig, bubblesmall)
{
    var dis = Math.sqrt((bubblebig.x - bubblesmall.x)*(bubblebig.x - bubblesmall.x) + (bubblebig.y - bubblesmall.y)*(bubblebig.y - bubblesmall.y));
    return dis;
}

//分裂
function splite(Bubble){
    //var count = Math.pow(2,Bubble.dividecount++);
    var r = Math.sqrt(1/2) * Bubble.r;
    var speed = Bubble.v / 2;
    var score = Bubble.score /2;
    Bubble.r = r;
    Bubble.v = speed;
    Bubble.score = score;
    Bubble.dividecount++;
    var sx = Bubble.vecx - Bubble.x;
    var sy = Bubble.vecy - Bubble.y;
    var x = Bubble.x + 2*Bubble.r * (sx / Math.sqrt(sx*sx + sy*sy));
    var y = Bubble.y + 2*Bubble.r * (sy / Math.sqrt(sx*sx + sy*sy));
    addBubble(User_queue.length, x, y, Bubble.id, Bubble.vecx, Bubble.vecy, speed*3, Bubble.dividecount, score,Bubble.allscore);
}

//添加bubble
function addBubble(length){
    User_queue[length] = new Object();
    User_queue[length].id = "user" + length;
    User_queue[length].x = Math.floor(Math.random()*1000);
    User_queue[length].y = Math.floor(Math.random()*1000);
    User_queue[length].r = 20;
    User_queue[length].v = 4000 / (User_queue[length].r * User_queue[length].r);
    User_queue[length].vecx = 0;
    User_queue[length].vecy = 0;
    User_queue[length].eaten = false;
    User_queue[length].allscore = allscore;
    User_queue[length].score = 0;
    User_queue[length].dividecount = 0;
    User_queue[length].name = "string";
    User_queue[length].finish = false;
    User_queue[length].start = false;
    User_queue[length].type = 1;
}

function addBubble(pos, x, y, r, id, vecx, vecy, v, dc, score)
{
    User_queue[pos] = new Object();
    User_queue[pos].id = id;
    User_queue[pos].x = x;
    User_queue[pos].y = y;
    User_queue[pos].r = r;
    User_queue[pos].v = v;
    User_queue[pos].vecx = vecx;
    User_queue[pos].vecy = vecy;
    User_queue[pos].eaten = false;
    User_queue[pos].allscore = 0;
    User_queue[pos].score = score;
    User_queue[pos].dividecount = dc;
    User_queue[pos].name = "string";
    User_queue[pos].finish = false;
    User_queue[pos].type = 1;
}
//初始化用户
function initUser(){
    //新用户出现
    if(start) {
        Userlength++;
        addBubble(Userlength - 1);
    }
    if(Userlength > 0) {
        //某用户退出,或者分裂
        for (var i = 0; i < User_queue.length; i++) {
            if (User_queue[i].finish)
                User_queue.splice(i, 1);
            if(User_queue[i].dividecount != 0)
                splite(User_queue[i]);
        }
        //更新行为
        move();
        //检查是否被吃
        eat();
        //检查是否有需要重新开始的用户
        restart();
    }
    console.log(User_queue[Userlength-1]);
}

function restart()
{
    for(var i = 0; i< User_queue.length; i++)
    {
        if(User_queue[i].dividecount == 0)
        {
            if(User_queue[i].eaten){}
        }
        else
        {
            var live = Math.pow(2, User_queue[i].dividecount);
            for(var j = 0; j<User_queue.length && User_queue[j].id == User_queue[i].id; j++)
            {
                if(User_queue[j].eaten)
                    live--;
            }
            if(live == 0){}
        }
    }
}

//开启服务器
function begin()
{
    //产生bubble
    setInterval("randomBubble()", 20*1000);
    //初始化用户
    setInterval("initUser()", 1000);
}
