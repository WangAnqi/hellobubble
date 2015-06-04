var crypto = require('crypto');
var WS = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
var net = require('net');
var Server = net.createServer();

Server.on("connection",function(o){
    var key;
    var intervals = [];
    console.log(typeof(o));

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
            
            //timer
            intervals.push(setInterval(sendPlayersAction,1000));
        }else{
        	
        	console.log(o.remoteAddress);
        	console.log(o.remotePort);
            sendTextData(o,o.remoteAddress+":"+o.remotePort);

        	var packet = decodeDataFrame(e);
        	//console.log(packet);
        	if(packet.Opcode==8){
                o.end(); //断开连接
                console.log("Close the ws...");
            }

            console.log(packet);
            data = packet.PayloadData;
            //console.log(data);
            //sendTextData(o,data);
            switch (data.type){
                case 1:
                    var playerName = data.data;
                break;
                case 2:
                    var playerAction = data.data; 
                break;
                case 3:
                    var player = data.data;
                    //delete the player

                    o.end(); //断开连接
                    console.log("Close the ws...");
                break;
                default:
            }
        };
    });
    
    o.on('close',function(e){
    	console.log("Close interval send data")
        clearInterval(intervals[0]);
    });

    function sendPlayersAction(){
	    if(key){
            sendTextData(o,"{'name':'tsinghua','age':104}");
            console.log("Come on!");
	    }
    }
    
});
Server.listen(8000);



function sendClose(o,buf){
    var data = {
                   FIN:1,
                   Opcode:8,
                   PayloadData:buf
               };
    o.write(encodeDataFrame(data));
}

function sendTextData(o,buf){
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
  if(l<126)s.push(l);
  else if(l<0x10000)s.push(126,(l&0xFF00)>>2,l&0xFF);
  else s.push(
    127, 0,0,0,0, //8字节数据，前4字节一般没用留空
    (l&0xFF000000)>>6,(l&0xFF0000)>>4,(l&0xFF00)>>2,l&0xFF
  );
  //返回头部分和数据部分的合并缓冲区
  return Buffer.concat([new Buffer(s),o]);
}