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
        if(User_queue[i].start == true)
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
                if(User_queue[j].start == true)
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

    }
}

//bubble移动
function move()
{
    for(var i = 0; i < User_queue.length; i++)
    {
        if(User_queue[i].start == true)
        {
            var sx = User_queue[i].vecx - User_queue[i].x;
            var sy = User_queue[i].vecy - User_queue[i].y;
            User_queue[i].x += freq * User_queue[i].v * (sx / Math.sqrt(sx*sx + sy*sy));
            User_queue[i].y += freq * User_queue[i].v * (sy / Math.sqrt(sx*sx + sy*sy));
        }
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
    spliteBubble(User_queue.length, x, y, Bubble.id, Bubble.vecx, Bubble.vecy, speed*3, Bubble.dividecount, score,Bubble.allscore);
}

//建立小球，返回ID
exports.getID = function (length){
    User_queue[length] = new Object();
    User_queue[length].id = "user" + length;
    User_queue[length].x = Math.floor(Math.random()*1000);
    User_queue[length].y = Math.floor(Math.random()*1000);
    User_queue[length].r = 20;
    User_queue[length].v = 4000 / (User_queue[length].r * User_queue[length].r);
    User_queue[length].vecx = 0;
    User_queue[length].vecy = 0;
    User_queue[length].eaten = false;
    User_queue[length].allscore = 0;
    User_queue[length].score = 0;
    User_queue[length].dividecount = 0;
    User_queue[length].name = "string";
    User_queue[length].finish = false;
    User_queue[length].start = false;
    User_queue[length].type = 1;
    User_queue[length].restart = false;
    Userlength++;
    return User_queue[length].id;
}

function spliteBubble(pos, x, y, r, id, vecx, vecy, v, dc, score, allscore)
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
    User_queue[pos].allscore = allscore;
    User_queue[pos].score = score;
    User_queue[pos].dividecount = dc;
    User_queue[pos].name = "string";
    User_queue[pos].finish = false;
    User_queue[pos].type = 1;
    User_queue[pos].restart = false;
}

function resetBubble(Bubble)
{
    Bubble.r = 20;
    Bubble.v = 4000 / (Bubble.r * Bubble.r);
    Bubble.vecx = 0;
    Bubble.vecy = 0;
    Bubble.eaten = false;
    Bubble.allscore = 0;
    Bubble.score = 0;
    Bubble.dividecount = 0;
    Bubble.name = "string";
    Bubble.finish = false;
    Bubble.start = false;
    Bubble.type = 1;
    Bubble.restart = true;
}

function setIDName(data){
    for(var i = 0; i<User_queue.length; i++)
        if(data.id == User_queue[i].id)
            User_queue[i].name = data.name;
}

exports.setIDEndGame = function (data){
    for(var i = 0; i<User_queue[i]; i++)
    {
        if(data.id == User_queue[i].id)
            User_queue.splice(i, 1);
    }
}

exports.setIDAction = function (data)
{
    for(var i = 0; i<User_queue[i]; i++)
    {
        if(data.id == User_queue[i].id &&　data.keydown)
        {
            User_queue[i].vecx = data.directionx;
            User_queue[i].vecy = data.directiony;
        }
    }
}

function checkSplite()
{
    for(var i = 0; i<User_queue.length; i++)
    {

    }
}

exports.setIDQuitGame = function (data)
{
    for(var i = 0; i<User_queue.length; i++)
        if(data.id == User_queue[i].id)
            User_queue[i].start = false;
}

exports.getIDMapAction = function (data)
{
    //是否分裂
    checkSplite();
    //更新行为
    move();
    //检查是否被吃
    eat();
    //检查是否有需要重新开始的用户
    restart();
    var user = new String();
    var map = new String();
    for(var i = 0; i<User_queue[i]; i++) {
        if (data.id == User_queue[i].id) {
            if (User_queue[i].dividecount == 0) {
                user += '"myx":' + User_queue[i].x + ',' + '"myy":' + User_queue[i].y + ','
                    + '"mysize":' + User_queue[i].r + ',' + '"id":' + User_queue[i].id + ','
                    + '"live":' + User_queue[i].eaten + ',' + '"map":';
                break;
            }
            else
            {
                var count = 0;
                var xbar = 0;
                var ybar = 0;
                for(var j = i; i<User_queue.length; j++)
                {
                    if(User_queue[j].id == User_queue[i].id)
                    {
                        count++;
                        xbar += User_queue[j].x;
                        ybar += User_queue[j].y;
                    }
                }
                xbar /= count;
                ybar /= count;
                user += '"myx":' + xbar + ',' + '"myy":' + ybar + ','
                    + '"mysize":' + User_queue[i].r + ',' + '"id":' + User_queue[i].id + ','
                    + '"live":' + User_queue[i].eaten + ',' + '"map":';
                break;
            }
        }
    }
    for(var i = 0; i<User_queue.length; i++)
    {
        map += '{'+ '"id":' + User_queue[i].id + ',' + '"x":' + User_queue[i].x + ','+ '"y":' + User_queue[i].y + ',' +
            '"size":'+ User_queue[i].r + ',' + '"type":' + User_queue[i].type + ',' + '"name"' + User_queue[i].name + '}'+ ',';
    }
    for(var i = 0; i<randomBubble_queue.length; i++)
    {
        map += '{'+ '"id":' + '-1' + ',' + '"x":' + randomBubble_queue.x + ','+ '"y":' + randomBubble_queue.y + ',' +
            '"size":'+ randomBubble_queue.r + ',' + '"type":' + randomBubble_queue.type + ',' + '"name"' + randomBubble_queue.name + '}';
        if(i != randomBubble_queue.length - 1)
            map += ',';
    }
    var result = '{' + user + '[' + map + ']' + '}';
    var jsonText = JSON.stringify(result);
    return jsonText;
}

function restart()
{
    for(var i = 0; i< User_queue.length; i++)
    {
        if(User_queue[i].dividecount == 0)
        {
            if(User_queue[i].eaten){
                User_queue[i].restart = true;
            }
        }
        else
        {
            var live = Math.pow(2, User_queue[i].dividecount);
            for(var j = 0; j<User_queue.length; j++)
            {
                if(User_queue[j].eaten && User_queue[j].id == User_queue[i].id)
                    live--;
            }
            if(live == 0){
                for(var j = i+1; j<User_queue; j++)
                {
                    if(User_queue[j].id == User_queue[i].id)
                        User_queue.splice(j,1);
                }
                resetBubble(User_queue[i]);
            }//未完成
        }
    }
}