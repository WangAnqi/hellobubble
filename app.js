var http = require('http'),
    querystring = require("querystring");
exports.runServer = function(port){
    port = port || 8080;
    var server = http.createServer(function(req, res){
        var _postData = '';
        //on用于添加一个监听函数到一个特定的事件
        req.on('data', function(chunk)
        {
            _postData += chunk;
        })
        .on('end', function()
        {
            req.post = querystring.parse(_postData);
            handlerRequest(req, res);
        });
    }).listen(port);
    console.log('Server running at http://127.0.0.1:'+ port +'/');
};

var route = require('./route');
var handlerRequest = function(req, res){
    //通过route来获取controller和action信息
    var actionInfo = route.getActionInfo(req.url, req.method);
    //如果route中有匹配的action，则分发给对应的action
    if(actionInfo.action){
        //假设controller都放到当前目录的controllers目录里面，还记得require是怎么搜索module的么？
        var controller = require('./controllers/'+actionInfo.controller); // ./controllers/blog
        if(controller[actionInfo.action]){
            var ct = new controllerContext(req, res);
            //动态调用，动态语言就是方便啊
            //通过apply将controller的上下文对象传递给action
            controller[actionInfo.action].apply(ct, actionInfo.args);
        }else{
            handler500(req, res, 'Error: controller "' + actionInfo.controller + '" without action "' + actionInfo.action + '"')
        }
    }else{
        //如果route没有匹配到，则当作静态文件处理
        staticFileServer(req, res);
    }
};