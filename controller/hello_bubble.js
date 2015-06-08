var globle_height = 5000;//世界地图的高度
var globle_width = 5000;//世界地图的宽度
var randomBubble_queue = new Array();//随机生成的bubble
var User_queue = new Array();//用户队列
var freq = 1;//刷新频率
var Userlength = 0;//用户总数
var Bubblelength = 0;
var start = false;//开始

exports.Users = User_queue;
//生成随机的Bubble
exports.randomBubble = function (){
    for(var i = User_queue.length; i<100; i++)
    {
        randomBubble_queue[i] = new Object();
        randomBubble_queue[i].x = Math.floor(Math.random() * globle_width);
        randomBubble_queue[i].y = Math.floor(Math.random() * globle_height);
        randomBubble_queue[i].r = 5;
        randomBubble_queue[i].score = 1;
        randomBubble_queue[i].type = 0;
    }
}

//bubble自相残杀
function eat(){
    for(var i = 0; i< User_queue.length; i++)
    {
        if(User_queue[i].start == true && User_queue[i].live)
        {
            for(var k = 0; k<randomBubble_queue.length; k++)
            {

                if(distance(User_queue[i],randomBubble_queue[k]) <= User_queue[i].r + randomBubble_queue[k].r) {
                    checkstate(User_queue[i], randomBubble_queue[k]);
                    randomBubble_queue.splice(k, 1);
                    Bubblelength--;
                }
            }
            for(var j = i+1; j<User_queue.length; j++)
            {
                if(User_queue[j].id != User_queue[i].id)
                {
                    if(User_queue[j].start == true && User_queue[j].live)
                    {
                        if(User_queue[i].r > User_queue[j].r) {
                            if (distance(User_queue[i], User_queue[j]) < User_queue[i].r - User_queue[j].r) {
                                checkstate(User_queue[i], User_queue[j]);
                                Userlength--;
                            }
                        }
                        else if(User_queue[i].r < User_queue[j].r) {
                            if (distance(User_queue[j], User_queue[i]) < User_queue[j].r - User_queue[i].r) {
                                checkstate(User_queue[j], User_queue[i]);
                                Userlength--;
                            }
                        }
                    }
                 }
                else 
                {
                    if(User_queue[j].start && User_queue[j].live)
                    {
                        if(distance(User_queue[i], User_queue[j]) < 4/5*(User_queue[i].r + User_queue[j].r))
                        {
                            checkstate(User_queue[i], User_queue[j]);
                            User_queue.splice(j,1);
                            Userlength--;
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
    Bubblesmall.live = false;
    Bubblebig.r = Math.sqrt(Bubblebig.r*Bubblebig.r + Bubblesmall.r*Bubblesmall.r);
    Bubblebig.v = 150 /  Bubblebig.r;
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
    var speed = 150 / r;
    var score = Bubble.score /2;
    Bubble.r = r;
    Bubble.v = speed;
    Bubble.score = score;
    Bubble.dividecount = 0;
    var sx = Bubble.vecx - Bubble.x;
    var sy = Bubble.vecy - Bubble.y;
    var x = Bubble.x + 2*(Bubble.r+10) * (sx / Math.sqrt(sx*sx + sy*sy));
    var y = Bubble.y + 2*(Bubble.r+10) * (sy / Math.sqrt(sx*sx + sy*sy));
    spliteBubble(Userlength, x, y, r, Bubble.id, Bubble.vecx, Bubble.vecy, speed*3, score,Bubble.allscore,Bubble.name);
}

//建立小球，返回ID
exports.getID = function (){
    User_queue[Userlength] = {};
    User_queue[Userlength].id = Userlength;
    User_queue[Userlength].x = Math.floor(Math.random()*1000);
    User_queue[Userlength].y = Math.floor(Math.random()*1000);
    User_queue[Userlength].r = Math.floor(Math.random()*20 + 10);
    User_queue[Userlength].v = 150 / User_queue[Userlength].r;
    User_queue[Userlength].vecx = User_queue[Userlength].x + 1;
    User_queue[Userlength].vecy = User_queue[Userlength].y + 1;
    User_queue[Userlength].live = false;
    User_queue[Userlength].allscore = 0;
    User_queue[Userlength].score = 0;
    User_queue[Userlength].dividecount = 0;
    //User_queue[Userlength].name = "string";
    User_queue[Userlength].finish = false;
    User_queue[Userlength].start = false;
    User_queue[Userlength].type = 1;
    User_queue[Userlength].restart = false;
    var result = { "id" : User_queue[Userlength].id };
    Userlength++;
    return result;
}

function spliteBubble(pos, x, y, r, id, vecx, vecy, v, score, allscore, name)
{
    User_queue[pos] = new Object();
    User_queue[pos].id = id;
    User_queue[pos].x = x;
    User_queue[pos].y = y;
    User_queue[pos].r = r;
    User_queue[pos].v = v;
    User_queue[pos].vecx = vecx;
    User_queue[pos].vecy = vecy;
    User_queue[pos].live = true;
    User_queue[pos].allscore = allscore;
    User_queue[pos].score = score;
    User_queue[pos].dividecount = 0;
    User_queue[pos].name = name;
    User_queue[pos].finish = false;
    User_queue[pos].type = 1;
    User_queue[pos].start = true;
    User_queue[pos].restart = false;
    console.log(User_queue[pos]);
    Userlength++;
}

function resetBubble(Bubble)
{
    Bubble.r = 20;
    Bubble.v = 150 / Bubble.r;
    Bubble.vecx = 0;
    Bubble.vecy = 0;
    Bubble.live = false;
    Bubble.allscore = 0;
    Bubble.score = 0;
    Bubble.dividecount = 0;
    //Bubble.name = "string";
    Bubble.finish = false;
    Bubble.start = false;
    Bubble.type = 1;
    Bubble.restart = false;
}

exports.setIDName = function (data){
	//randomBubble();
    for(var i = 0; i<User_queue.length; i++)
        {
        if(data.id == User_queue[i].id)
            User_queue[i].name = data.name;
            User_queue[i].start = true;
            User_queue[i].live = true;
        }
}

exports.setIDEndGame = function (data){
    for(var i = 0; i<User_queue.length; i++)
    {
        if(data.id == User_queue[i].id)
        {
            User_queue.splice(i, 1);
        	Userlength--;
    	}
    }
}

exports.setIDAction = function (data)
{
    for(var i = 0; i<User_queue.length; i++)
    {
        if(data.id == User_queue[i].id)
        {
            User_queue[i].vecx = data.directionx;
            User_queue[i].vecy = data.directiony;
            if(data.keydown && User_queue[i].r >= 30) 
            {
            	User_queue[i].dividecount++;
                //console.log(User_queue[i].dividecount);
            }
        }
        //if(User_queue[i].dividecount != 0)
        	//splite(User_queue[i]);
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
    for(var i = 0; i<User_queue.length; i++)
    {
        if(User_queue[i].dividecount != 0)
            splite(User_queue[i]);
    }
    //更新行为
    move();
    //检查是否被吃
    eat();
    var result = {};
    var map = [];
    for(var i = 0; i<User_queue.length; i++)
    {	
    	if(User_queue[i].live)
    	{
    		var temp = {"id":User_queue[i].id,"x":Math.round(User_queue[i].x),"y":Math.round(User_queue[i].y),"size":User_queue[i].r,"type":User_queue[i].type,"name":User_queue[i].name};
       		map.push(temp);
        }
    }
    for(var i = 0; i<randomBubble_queue.length; i++)
    {
    	var temp = {"id":-1,"x":randomBubble_queue[i].x,"y":randomBubble_queue[i].y,"size":randomBubble_queue[i].r,"type":randomBubble_queue[i].type,"name":randomBubble_queue[i].name}
        map.push(temp);
    }
    for(var i = 0; i<User_queue.length; i++) {
        if (data.id == User_queue[i].id) {
            //if (User_queue[i].dividecount == 0) {
                //result = {"myx":Math.round(User_queue[i].x),"myy":Math.round(User_queue[i].y),"mysize":User_queue[i].r,"id":User_queue[i].id, "live":User_queue[i].live, "map": map};
                //break;
            //}
            //else
            //{
                var count = 0;
                var xbar = 0;
                var ybar = 0;
                for(var j = i; j<User_queue.length; j++)
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
                result = {"myx":xbar,"myy":ybar,"mysize":User_queue[i].r,"id":User_queue[i].id, "live":User_queue[i].live, "map": map};
                break;
            //}
        }
    } 
    //检查是否有需要重新开始的用户
    restart();
    return result;
}

function restart()
{
    for(var i = 0; i< User_queue.length; i++)
    {
        if(User_queue[i].dividecount == 0)
        {
            if(!User_queue[i].live){
                User_queue[i].restart = true;
                resetBubble(User_queue[i]);
            }
        }
        else
        {
            var live = Math.pow(2, User_queue[i].dividecount);
            for(var j = 0; j<User_queue.length; j++)
            {
                if(User_queue[j].live && User_queue[j].id == User_queue[i].id)
                    live--;
            }
            if(live == 0){
                for(var j = i+1; j<User_queue; j++)
                {
                    if(User_queue[j].id == User_queue[i].id)
                        User_queue.splice(j,1);
                }
                resetBubble(User_queue[i]);
            }
        }
    }
}