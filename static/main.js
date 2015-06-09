(function(win, jqu) {
    function Start() {
    
    
        //win.onbeforeunload = gamestop;
        myid=0;
        mykeydown=!1
        ws=new WebSocket("ws://101.5.232.175:8000/");
        ws.onopen=function(e){
            ws.send('{"type":0}'); 
            console.log("成功");};
            
        ws.onmessage = function(e){
            msg =  JSON.parse(e.data);
            getmessage();
        }
       
        mycanvas = document.getElementById("canvas");
        myContext = mycanvas.getContext("2d");
        
        mycanvas.onmousemove = function(a) {
            mouseX = a.clientX;
            mouseY = a.clientY; 
            getDirection(0);
        };
        
        win.onkeydown = function(d) {
            32 != d.keyCode || keycontrol || (getDirection(1), keycontrol = !0);
          
        };
        win.onkeyup = function(d) {
            32 == d.keyCode && (keycontrol = !1);
        };
        win.onblur = function() {
            keycontrol = !1
        };
        DirectionX=0;
        DirectionY=0;
        keycontrol=!1;
        smallcircle=[];
        bigcircle=[];
        mytimer=null;
        mouseX=0;
        mouseY=0;
        win.onresize = myresize;
        myresize();
        $("#playBtn")[0].onclick=clickplay;
        //setInterval(paint, 1E3 / 60);
        //setInterval(reconnect, 1000);
    }
      
    function gamestop(){
        ws.send('{"type":3,"data":{"id":'+myid+'}}'); 
    }
    
   /* function reconnect()
    {
        if(ws.readyState!=1)
        {
            console.log(ws.readyState);
            ws=new WebSocket("ws://101.5.232.175:8000/");
        }
    }*/
    
    
    function clickplay(){
        myname = '"'+$("#nick")[0].value+'"';
        ws.send('{"type":1,"data":{"id":'+myid+',"name":'+myname+'}}'); 
        myname = $("#nick")[0].value;
    }  
    
    function getDirection(num){
        DirectionX = (mouseX - winW / 2) / myscal+myx;
        DirectionY = (mouseY - winH / 2) / myscal+myy;
        console.log(ws.readyState);
        if(num==0)
        {
            ws.send('{"type":2,"data":{"id":'+myid+',"directionx":'+DirectionX+',"directiony":'+DirectionY+',"keydown":false}}');
        }
        else {
            ws.send('{"type":2,"data":{"id":'+myid+',"directionx":'+DirectionX+',"directiony":'+DirectionY+',"keydown":true}}');
        }
    }
    
    function getDirection0(){getDirection(0)}
      
    function myresize(){
        winW = win.innerWidth;
        winH = win.innerHeight;
        mycanvas.width = winW;
        mycanvas.height = winH;
        paint();
    }
    
    
    function getmessage(){
        myx = msg.myx;
        myy = msg.myy;
        myid = msg.id;
        mysize = msg.mysize;
        mymap = msg.map;
        if(msg.live)
        {
            $("#overlays").hide();
            if(!mytimer){   
                mytimer=setInterval(getDirection0,100);}    
        }
        else
        {
            if(mytimer){    
                clearInterval(mytimer);}
            $("#overlays").show();
        }
        smallcircle=[];
        bigcircle=[];
        for(i=0;i<mymap.length;i++)
        {
            play = Object.create(circle);
           /* play.id=mymap[i].id
            play.size=mymap[i].size
            play.x = mymap[i].x
            play.y = mymap[i].y
            play.name = mymap[i].name*/
            play.id=mymap[i][0]
            play.x = mymap[i][1]
            play.y = mymap[i][2]
            play.size=mymap[i][3]
            play.name = mymap[i][4]
            if(play.id==-1){    
                play.color1=mycolor1[play.x % 3];
                play.color2=mycolor2[play.x % 3];
                play.type=0;
            }
            else{
                play.color1=mycolor1[play.id % 3]
                play.color2=mycolor2[play.id % 3]
            }
            if(play.type==0){smallcircle.push(play);}
            else{bigcircle.push(play); } 
        }
        paint();
    }
    
    function paint(){
        
        myscal=0.8-mysize/200*0.2;
        if(myscal==0){myscal=0.05};
        myContext.clearRect(0, 0, winW, winH);
        myContext.fillStyle = "#F2FBFF";
        myContext.fillRect(0, 0, winW, winH);
        myContext.save();
        myContext.strokeStyle = "#000000";
        myContext.globalAlpha = .2;
        myContext.scale(myscal, myscal);
        b = winW / myscal;
        c = winH / myscal;
        for (i = -.5 + (b / 2-myx) % 50; i < b; i += 50) myContext.beginPath(),
        myContext.moveTo(i, 0),
        myContext.lineTo(i, c),
        myContext.stroke();
        for (i = -.5 + (c / 2-myy) % 50; i < c; i += 50) myContext.beginPath(),
        myContext.moveTo(0, i),
        myContext.lineTo(b, i),
        myContext.stroke();
        myContext.restore();
        myContext.save();
        myContext.translate(winW / 2, winH / 2);
        myContext.scale(myscal,myscal);
        myContext.translate( - myx, -myy);
        for(i=0;i<smallcircle.length;i++) {smallcircle[i].draw();}
        for(i=0;i<bigcircle.length;i++) {bigcircle[i].draw();}
        myContext.restore();
        myContext.save();
        myContext.textAlign = 'left';
        myContext.fillStyle = '#000000';
        myContext.font = 'bold 20px arial';
        myContext.strokeText("score:"+parseInt(10+2*mysize), 30, winH-30);
        myContext.restore();
    }
    
    var circle = {
        id: 0,
        name: null,
        x: 500,
        y: 600,
        size: 5,
        color1:"#00FF00",
        color2:"#00DD00",
        type:3,
        draw: function(){
            myContext.save();
            myContext.lineWidth=10+this.size/50;
            myContext.fillStyle = this.color1;
            myContext.strokeStyle = this.color2;
            myContext.beginPath();
            myContext.lineJoin = this.isVirus ? "mitter": "round";
            if(this.type == 2){
                myContext.moveTo(this.x+this.size*1*Math.cos(0), this.y+this.size*1*Math.sin(0));
                for(i=0;i<40;i++)
                {
                    myContext.lineTo(this.x+this.size*1*Math.cos(Math.PI*(2*i)/40), this.y+this.size*1*Math.sin(Math.PI*(2*i)/40));
                    myContext.lineTo(this.x+this.size*0.95*Math.cos(Math.PI*(2*i+1)/40), this.y+this.size*0.95*Math.sin(Math.PI*(2*i+1)/40));
                }
            }
            else if(this.type == 4)
            {
                myContext.moveTo(this.x+this.size*1*Math.cos(15), this.y+this.size*1*Math.sin(15));
                for(i=0;i<6;i++)
                {
                    myContext.lineTo(this.x+this.size*1*Math.cos(Math.PI*i/3+15), this.y+this.size*1*Math.sin(Math.PI*i/3+15));
                }
            }
            else{
                myContext.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
            }
            myContext.closePath();
            myContext.stroke();
            myContext.fill();
            if(this.name){
                if(this.size<100){myContext.font = 'bold 20px arial';}
                else  if(this.size<200){myContext.font = 'bold 40px arial';}
                else  if(this.size<300){myContext.font = 'bold 60px arial';}
                else  if(this.size<400){myContext.font = 'bold 80px arial';}
                else  if(this.size<500){myContext.font = 'bold 100px arial';}
                else  if(this.size<600){myContext.font = 'bold 120px arial';}
                else  if(this.size<700){myContext.font = 'bold 140px arial';}
                else  if(this.size<800){myContext.font = 'bold 1600px arial';}
                else  if(this.size<900){myContext.font = 'bold 180px arial';}
                else  if(this.size<1000){myContext.font = 'bold 200px arial';}
                else  {myContext.font = 'bold 60px arial';}
                myContext.textAlign = 'center';
                myContext.fillStyle = '#000000';
                myContext.lineWidth=1;
                myContext.fillText(this.name, this.x, this.y);
            }
            myContext.restore();
        }
    }
    mycolor1=["#00FF00","#FF0000","#0000FF"]
    mycolor2=["#00DD00","#DD0000","#0000DD"]
    win.onload = Start;
    myscal=1;
    mysize=0;
    myx=500;
    myy=500;
})(window, jQuery);