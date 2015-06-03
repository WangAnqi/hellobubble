(function(win, jqu) {
    function Start() {
        mycanvas = document.getElementById("canvas");
        myContext = mycanvas.getContext("2d");
        
        
        smallcircle=[];
        bigcircle=[];
        team1 = Object.create(circle);
        team1.x=200;
        team1.size=20;
        team1.name="23333"
        if(team1.isAgitated){smallcircle.push(team1);}
        else{bigcircle.push(team1); } 
         
        team2 = Object.create(circle);
        team2.isAgitated=!0;
        
         if(team2.isAgitated){smallcircle.push(team2);}
        else{bigcircle.push(team2); }  
        team3 = Object.create(circle);
        team3.isVirus=!0;
        team3.x=800;
        team3.y=400;
        team3.size=100;   
        if(team3.isAgitated){smallcircle.push(team3);}
        else{bigcircle.push(team3); }  
        
        win.onresize = myresize;
        myresize();
        setInterval(paint, 1E3 / 60);
    }
      
    function myresize(){
        winW = win.innerWidth;
        winH = win.innerHeight;
        mycanvas.width = winW;
        mycanvas.height = winH;
        paint()
    }
    
    function paint(){
        //myy++;
        mysize=team1.size;
        myscal=0.8-mysize/200*0.2;
        if(myscal==0){myscal=0.05} 
        team1.x++;
        team1.y++;
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
    }
    
    var circle = {
        id: 0,
        name: null,
        x: 500,
        y: 600,
        size: 5,
        color1:"#00FF00",
        color2:"#00DD00",
        isVirus: !1,
        isAgitated: !1,
        draw: function(){
            myContext.save();
            myContext.lineWidth=10+this.size/50;
            myContext.fillStyle = this.color1;
            myContext.strokeStyle = this.color2;
            myContext.beginPath();
            myContext.lineJoin = this.isVirus ? "mitter": "round";
            if(this.isVirus){
                myContext.moveTo(this.x+this.size*1*Math.cos(0), this.y+this.size*1*Math.sin(0));
                for(i=0;i<40;i++)
                {
                    myContext.lineTo(this.x+this.size*1*Math.cos(Math.PI*(2*i)/40), this.y+this.size*1*Math.sin(Math.PI*(2*i)/40));
                    myContext.lineTo(this.x+this.size*0.95*Math.cos(Math.PI*(2*i+1)/40), this.y+this.size*0.95*Math.sin(Math.PI*(2*i+1)/40));
                }
            }
            else if(this.isAgitated)
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
  
    win.onload = Start;
    myscal=1;
    mysize=0;
    myx=500;
    myy=500;
})(window, jQuery);