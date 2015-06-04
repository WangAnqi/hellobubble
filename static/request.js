﻿/*
 * Wang Anqi
 * send data to Server      --- ws.send("data");
 * receive data from Server --- ws.onmessage = function(){处理消息的函数写到这里} 
 */
var ws=new WebSocket("ws://192.168.1.176:8000/");

ws.onopen=function(e){
    console.log("成功");
    ws.send("成功"); 
};

ws.onmessage = function(e){
    var msg = e.data;
    //console.log(msg);
    console.log(e);
    
}

//send data when the window is close
window.onbeforeunload = function(){
	ws.send("close");
}

ws.onclose = function(e){
	console.log("client close the ws successfully");
}

//test function
function wstry(){
	//ws.close();
	ws.send("{'name':'tsinghua','age':104}");
}

function clientclosesocket(){
   ws.send("close");
}

