var crypto = require('crypto');
var WS = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
var net = require('net');
var con = require('./controller/hello_bubble');
var Server = net.createServer();
var INTIME = 1000/60;
var RANDOMBUBBLE = 20000;

Server.on("connection",function(o){//o: class net.socket
    var key;
    var interval;
    var player_id;
    var send_flag;
    o.on('data',function(e){
        if(!key){
            //握手
            console.log("Start the ws...");
            key = e.toString().match(/Sec-WebSocket-Key: (.+)/)[1];
            key = crypto.createHash('sha1').update(key + WS).digest('base64');
            o.write('HTTP/1.1 101 Switching Protocols\r\n');
            o.write('Upgrade: websocket\r\n');
            o.write('Connection: Upgrade\r\n');
            o.write('Sec-WebSocket-Accept: ' + key + '\r\n');
            o.write('\r\n');
            
        }else{
        	
        	  var packet = decodeDataFrame(e);
        	  
        	  if(packet.Opcode==8){
                console.log("Close the ws...");
                clearInterval(interval);
                con.setIDEndGame(player_id);
                o.end(); //断开连接
            }
            else{
                //console.log(packet);
                strdata = packet.PayloadData;
                data = JSON.parse(strdata);
                //console.log(data);
                //sendTextData(o,data);
                //console.log(data.type);
                switch (data.type){
                    case 0:
                        player_id = con.getID();
                        //timer
                        console.log(player_id);
                        interval = setInterval(sendPlayersAction,INTIME);
                        break;
                    case 1:
                        con.setIDName(data.data);
                        //console.log(data.data);
                        break;
                    case 2:
                        con.setIDAction(data.data);
                        //console.log(data.data);
                        break;
                    case 3:
                        con.setIDQuitGame(data.data);
                        //console.log(data.data);
                        break;
                    default:
                }    
            }
        };
    });
    
    o.on('close',function(e){
    	//clearInterval(interval);
    	console.log("Close interval send data")
    });

    function sendPlayersAction(){
        if(!(con.Users[player_id.id])) return;
        //try{
            actions = con.getIDMapAction(player_id);
            //console.log(actions);
            sendTextData(o,JSON.stringify(actions));
        //}
        //catch(e){
        //  console.log(e);
        //}
    }
});
Server.listen(8000);

//generate random bubbles
con.randomBubble();
setInterval(con.randomBubble,RANDOMBUBBLE);


function sendClose(o,buf){
    var data = {
                   FIN:1,
                   Opcode:8,
                   PayloadData:buf
               };
    o.write(encodeDataFrame(data));
}

function sendTextData(o,buf){
  //console.log(buf.length);
    var data = {
                   FIN:1,
                   Opcode:1,
                   PayloadData:buf
               };
    o.write(encodeDataFrame(data));
}

function decodeDataFrame(e){
  var i=0,j,s,frame={
    //解析前两个字节的基本数据
    FIN:e[i]>>7,Opcode:e[i++]&15,Mask:e[i]>>7,
    PayloadLength:e[i++]&0x7F
  };
  //处理特殊长度126和127
  if(frame.PayloadLength==126)
    frame.length=(e[i++]<<8)+e[i++];
  if(frame.PayloadLength==127)
    i+=4, //长度一般用四字节的整型，前四个字节通常为长整形留空的
    frame.length=(e[i++]<<24)+(e[i++]<<16)+(e[i++]<<8)+e[i++];
  //判断是否使用掩码
  if(frame.Mask){
    //获取掩码实体
    frame.MaskingKey=[e[i++],e[i++],e[i++],e[i++]];
    //对数据和掩码做异或运算
    for(j=0,s=[];j<frame.PayloadLength;j++)
      s.push(e[i+j]^frame.MaskingKey[j%4]);
  }else s=e.slice(i,frame.PayloadLength); //否则直接使用数据
  //数组转换成缓冲区来使用
  s=new Buffer(s);
  //如果有必要则把缓冲区转换成字符串来使用
  if(frame.Opcode==1)s=s.toString();
  //设置上数据部分
  frame.PayloadData=s;
  //返回数据帧
  return frame;
}

function encodeDataFrame(e){
  var s=[],o=new Buffer(e.PayloadData),l=o.length;
  //输入第一个字节
  s.push((e.FIN<<7)+e.Opcode);
  //输入第二个字节，判断它的长度并放入相应的后续长度消息
  //永远不使用掩码
  if(l<126){
    s.push(l);
    //console.log("data length"+"<126");
  }
  else if(l<0x10000){
    s.push(126,(l&0xFF00)>>8,l&0xFF);
    //console.log("data length"+"126");
  }
  else{
    s.push(
      127, (l&0xFF00000000000000)>>56,(l&0xFF000000000000)>>48,(l&0xFF0000000000)>>40,(l&0xFF00000000)>>32, //8字节数据，前4字节一般没用留空
      (l&0xFF000000)>>24,(l&0xFF0000)>>16,(l&0xFF00)>>8,l&0xFF
    );
    //console.log("data length"+"127");
  }
  //返回头部分和数据部分的合并缓冲区
  return Buffer.concat([new Buffer(s),o]);
}