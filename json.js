/*from web client to server*/
//connect
{"type":0}
{"t":0}
//start game
{"type":1, "data":{"id":10, "name":"dogedoge"}}
{"t":1,"d":{"i":10,"n":"dogedoge"}}
//bubble's action
{"type":2, "data":{"id":510, "directionx":10,"directiony":200,"keydown":true}}
{"t":2,"d":{"i":510,"x":10,"y":200,"k":true}}
//close the game
{"type":3, "data":{"id":203}}
{"t":3,"d":{"i":203}}
/*from server to webclient*/
//open the ws
{"id":2333}
{"i":2333}
{"myx":50,"myy":100,"mysize":50,"id":20, "live":true, "map":[{"id":1,"x":20,"y":30,"size":10,"name":"123"}]}
{"x":50,"y":100,"s":50,"i":20,"l":true,"m":[{"i":1,"x":20,"y":30,"s":10,"n":"123"}]}
{"x":50,"y":100,"s":50,"i":20,"l":true,"m":[[1,20,30,10,"123"],[2,20,30,10,"223"],[3,20,30,10,"323"]]}
//net --- server
/*
getID() ---return: a new id {"id":10}
setIDName(data) ---set id's name---data = {"id":10, "name":"dogedoge"}
setIDAction(data) --- set id's action --- data = {"id":510, "direction":"?","mouse":"w"}
setIDQuitGame(data) --- user temporarily quit the game, not end game --- data = {"id":203}
setIDEndGame(data) --- user end the game --- data = {"id":203}

getIDMapAction(id) --- return {'myx':50,'myy':100,'mysize':50,'id':20, 'live':true, 'map':[{'id':1,'x':20,'y':30,'size':10,'type':0,'name':'123'}]}
*/