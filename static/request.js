var ws=new WebSocket("ws://127.0.0.1:8000/");
ws.onopen=function(e){
    console.log("成功");
    ws.send("成功"); 
};

ws.onmessage = function(e){
    var msg = e.data;
    console.log(msg);
    console.log(e);
}

ws.onclose = function(e){
	console.log("client close the ws successfully");
}

function wstry(){
	ws.close();
}

function clientclosesocket(){
   ws.send("close");
}

