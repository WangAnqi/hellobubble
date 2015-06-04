var globle_height = 1000;//�����ͼ�ĸ߶�
var globle_width = 1000;//�����ͼ�Ŀ��
var randomBubble_queue = new Array(100);//������ɵ�bubble
var User_queue = new Array();//�û�����
var freq = 10;//ˢ��Ƶ��
var Userlength = 0;//�û�����
var start = false;//��ʼ

//���������Bubble
function randomBubble(){
    for(var i = randomBubble_queue.length; i<100; i++)
    {
        randomBubble_queue[i] = new Object();
        randomBubble_queue[i].x = Math.floor(Math.random() * globle_width);
        randomBubble_queue[i].y = Math.floor(Math.random() * globle_height);
        randomBubble_queue[i].r = 5;
        randomBubble_queue[i].score = 1;
        randomBubble_queue[i].eaten = false;
    }
}

//bubble�����ɱ
function eat(){
    for(var i = 0; i< User_queue.length; i++)
    {
        for(var k = 0; k<randomBubble_queue.length; k++)
        {
            if(distance(User_queue[i],randomBubble_queue[k]) <= 0)
            {
                checkstate(User_queue[i],randomBubble_queue[k]);
                randomBubble_queue.splice(k,1);
            }
        }
        for(var j = i+1; j<User_queue.length; j++)
        {
            if(User_queue[i].r > User_queue[j].r)
                if(distance(User_queue[i], User_queue[j]) <= 0)
                {
                    checkstate(User_queue[i], User_queue[j]);
                    User_queue.splice(j, 1);
                }
            else if(User_queue[i].r < User_queue[j].r)
                if(distance(User_queue[j], User_queue[i]) <= 0)
                {
                    checkstate(User_queue[j], User_queue[i]);
                    User_queue.splice(i, 1);
                }
        }
    }
}

//bubble�ƶ�
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

//���bubble״̬
function checkstate(Bubblebig,Bubblesmall)
{
    Bubblebig.eaten = true;
    Bubblebig.r = Math.sqrt(Bubblebig.r*Bubblebig.r + Bubblesmall.r*Bubblesmall.r);
    Bubblebig.v = 4000 / (Bubblebig.r * Bubblebig.r);
    Bubblebig.score += Bubblesmall.score;
}

//����bubble����
function distance(bubblebig, bubblesmall)
{
    var dis = Math.sqrt((bubblebig.x - bubblesmall.x)*(bubblebig.x - bubblesmall.x) + (bubblebig.y - bubblesmall.y)*(bubblebig.y - bubblesmall.y));
    if(!bubblesmall.id)
        var radius = bubblebig.r;
    else
        var radius = bubblebig.r - bubblesmall.r;
    var result = dis - radius;
    return result;
}

//���ѣ�δ�������
function splite(Bubble){
    var count = Math.pow(2,Bubble.dividecount++);
    for(var i = 0; i<count; i++)
    {
        Bubble.sub[i] = new Object();
        Bubble.sub[i].score = Bubble.score / count;
        Bubble.sub[i].r = Math.sqrt(1/count) * Bubble.r;
    }
}

//���bubble
function addBubble(length){
    User_queue.length++;
    User_queue[length] = new Object();
    User_queue[length].id = "user" + length;
    User_queue[length].x = Math.floor(Math.random()*1000);
    User_queue[length].y = Math.floor(Math.random()*1000);
    User_queue[length].r = 20;
    User_queue[length].v = 4000 / (User_queue[length].r * User_queue[length].r);
    User_queue[length].vecx = 0;
    User_queue[length].vecy = 0;
    User_queue[length].eaten = false;
    User_queue[length].score = 0;
    User_queue[length].sub = new Array();
    User_queue[length].dividecount = 0;
    User_queue[length].name = "string";
    User_queue[length].finish = false;
}

//��ʼ���û�
function initUser(){
    //���û�����
    if(start) {
        Userlength++;
        addBubble(Userlength - 1);
    }
    //ĳ�û��˳�
    for(var i = 0; i< User_queue.length; i++)
        if(User_queue[i].finish)
            User_queue[i].splice(i,1);
    //������Ϊ
    move();
    //����Ƿ񱻳�
    eat();
}

//����������
function begin()
{
    //����bubble
    randomBubble();
    //��ʼ���û�
    initUser();
}
